package com.sahaflow.identity.service;

import com.sahaflow.identity.domain.Membership;
import com.sahaflow.identity.domain.Role;
import com.sahaflow.identity.domain.User;
import com.sahaflow.identity.dto.LoginRequest;
import com.sahaflow.identity.dto.LoginResponse;
import com.sahaflow.identity.dto.RegisterRequest;
import com.sahaflow.identity.dto.TokenRefreshRequest;
import com.sahaflow.identity.repository.UserRepository;
import com.sahaflow.tenant.domain.Tenant;
import com.sahaflow.tenant.service.TenantService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TenantService tenantService;

    public AuthenticationService(UserRepository userRepository,
                                  PasswordEncoder passwordEncoder,
                                  JwtService jwtService,
                                  TenantService tenantService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tenantService = tenantService;
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (tenantService.existsBySlug(request.tenantSlug())) {
            throw new IllegalArgumentException("Tenant slug '" + request.tenantSlug() + "' is already in use");
        }

        var tenant = tenantService.create(request.tenantSlug(), request.tenantName());

        var user = new User();
        user.setTenantId(tenant.getId());
        user.setEmail(request.email().toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPhone(request.phone());
        user.setEmailVerified(false);
        user.setEnabled(true);

        user = userRepository.save(user);

        var accessToken = jwtService.generateAccessToken(user, tenant.getId());
        var refreshToken = jwtService.generateRefreshToken(user, tenant.getId());

        return new LoginResponse(
            accessToken,
            refreshToken,
            "Bearer",
            jwtService.getAccessTokenExpiration(),
            user.getId(),
            tenant.getId(),
            "ADMIN",
            user.getFirstName() + " " + user.getLastName()
        );
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request, String tenantId) {
        if (tenantId == null || tenantId.isBlank()) {
            throw new BadCredentialsException("Tenant context is required");
        }

        var user = userRepository.findByTenantIdAndEmailIgnoreCase(tenantId,
                request.email().toLowerCase().trim())
            .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!user.isEnabled()) {
            throw new BadCredentialsException("Account is disabled");
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        String roleName = user.getMemberships().stream()
            .findFirst()
            .map(Membership::getRole)
            .map(Role::getName)
            .orElse("USER");

        var accessToken = jwtService.generateAccessToken(user, tenantId);
        var refreshToken = jwtService.generateRefreshToken(user, tenantId);

        return new LoginResponse(
            accessToken,
            refreshToken,
            "Bearer",
            jwtService.getAccessTokenExpiration(),
            user.getId(),
            tenantId,
            roleName,
            user.getFirstName() + " " + user.getLastName()
        );
    }

    @Transactional(readOnly = true)
    public LoginResponse refresh(TokenRefreshRequest request) {
        if (!jwtService.validateToken(request.refreshToken())) {
            throw new BadCredentialsException("Invalid or expired refresh token");
        }

        String userId = jwtService.extractUserId(request.refreshToken());
        String tenantId = jwtService.extractTenantId(request.refreshToken());

        var user = userRepository.findByTenantIdAndId(tenantId, userId)
            .orElseThrow(() -> new BadCredentialsException("User not found"));

        String roleName = user.getMemberships().stream()
            .findFirst()
            .map(Membership::getRole)
            .map(Role::getName)
            .orElse("USER");

        var newAccessToken = jwtService.generateAccessToken(user, tenantId);
        var newRefreshToken = jwtService.generateRefreshToken(user, tenantId);

        return new LoginResponse(
            newAccessToken,
            newRefreshToken,
            "Bearer",
            jwtService.getAccessTokenExpiration(),
            user.getId(),
            tenantId,
            roleName,
            user.getFirstName() + " " + user.getLastName()
        );
    }
}
