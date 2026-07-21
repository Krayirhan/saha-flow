package com.sahaflow.shared.tenant;

import com.sahaflow.identity.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class TenantFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(TenantFilter.class);
    private static final String TENANT_HEADER = "X-Tenant-Id";

    private final JwtService jwtService;

    public TenantFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain) throws ServletException, IOException {
        try {
            String tenantId = extractTenantId(request);
            String userId = null;
            String role = null;

            String token = extractToken(request);
            if (token != null && jwtService.validateToken(token)) {
                userId = jwtService.extractUserId(token);
                role = jwtService.extractRole(token);
                if (tenantId == null) {
                    tenantId = jwtService.extractTenantId(token);
                }

                var authorities = jwtService.extractPermissions(token).stream()
                    .map(p -> new SimpleGrantedAuthority("ROLE_" + role))
                    .toList();

                var auth = new UsernamePasswordAuthenticationToken(
                    userId, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(auth);
            }

            if (tenantId != null && userId != null) {
                TenantContextHolder.set(new TenantContext(tenantId, userId, role));
            }
        } catch (Exception e) {
            log.debug("Tenant context could not be resolved: {}", e.getMessage());
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            TenantContextHolder.clear();
        }
    }

    private String extractTenantId(HttpServletRequest request) {
        String fromHeader = request.getHeader(TENANT_HEADER);
        if (StringUtils.hasText(fromHeader)) {
            return fromHeader;
        }
        String fromSubdomain = extractFromSubdomain(request.getServerName());
        if (fromSubdomain != null) {
            return fromSubdomain;
        }
        return null;
    }

    private String extractFromSubdomain(String serverName) {
        if (serverName == null) return null;
        int dot = serverName.indexOf('.');
        if (dot > 0) {
            String sub = serverName.substring(0, dot);
            if (!"api".equals(sub) && !"www".equals(sub)) {
                return sub;
            }
        }
        return null;
    }

    private String extractToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }
}
