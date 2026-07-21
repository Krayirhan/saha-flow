package com.sahaflow.identity.service;

import com.sahaflow.identity.domain.Membership;
import com.sahaflow.identity.domain.Permission;
import com.sahaflow.identity.domain.Role;
import com.sahaflow.identity.domain.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.*;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    private final SecretKey accessSecretKey;
    private final SecretKey refreshSecretKey;
    private final long accessExpirationSec;
    private final long refreshExpirationSec;

    public JwtService(
            @Value("${sahaflow.jwt.access-secret}") String accessSecret,
            @Value("${sahaflow.jwt.refresh-secret}") String refreshSecret,
            @Value("${sahaflow.jwt.access-expiration:900}") long accessExpirationSec,
            @Value("${sahaflow.jwt.refresh-expiration:86400}") long refreshExpirationSec) {
        this.accessSecretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(accessSecret));
        this.refreshSecretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(refreshSecret));
        this.accessExpirationSec = accessExpirationSec;
        this.refreshExpirationSec = refreshExpirationSec;
    }

    public String generateAccessToken(User user, String tenantId) {
        return buildToken(user, tenantId, accessSecretKey, accessExpirationSec);
    }

    public String generateRefreshToken(User user, String tenantId) {
        return buildToken(user, tenantId, refreshSecretKey, refreshExpirationSec);
    }

    public long getAccessTokenExpiration() {
        return accessExpirationSec;
    }

    private String buildToken(User user, String tenantId, SecretKey key, long expiration) {
        var now = Instant.now();
        var claims = new HashMap<String, Object>();
        claims.put("sub", user.getId());
        claims.put("email", user.getEmail());
        claims.put("tenant_id", tenantId);

        String roleName = user.getMemberships().stream()
            .findFirst()
            .map(Membership::getRole)
            .map(Role::getName)
            .orElse("USER");
        claims.put("role", roleName);

        List<String> permissions = user.getMemberships().stream()
            .map(Membership::getRole)
            .map(Role::getPermissions)
            .flatMap(Set::stream)
            .map(Permission::getName)
            .distinct()
            .toList();
        claims.put("permissions", permissions);

        return Jwts.builder()
            .claims(claims)
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusSeconds(expiration)))
            .id(UUID.randomUUID().toString())
            .signWith(key)
            .compact();
    }

    public boolean validateToken(String token) {
        try {
            parseToken(token, accessSecretKey);
            return true;
        } catch (JwtException e) {
            try {
                parseToken(token, refreshSecretKey);
                return true;
            } catch (JwtException ex) {
                return false;
            }
        }
    }

    public String extractUserId(String token) {
        return extractClaim(token, "sub");
    }

    public String extractTenantId(String token) {
        return extractClaim(token, "tenant_id");
    }

    public String extractRole(String token) {
        return extractClaim(token, "role");
    }

    @SuppressWarnings("unchecked")
    public List<String> extractPermissions(String token) {
        try {
            var claims = parseToken(token, accessSecretKey);
            return claims.get("permissions", List.class);
        } catch (JwtException e) {
            try {
                var claims = parseToken(token, refreshSecretKey);
                return claims.get("permissions", List.class);
            } catch (JwtException ex) {
                return Collections.emptyList();
            }
        }
    }

    private String extractClaim(String token, String claim) {
        try {
            var claims = parseToken(token, accessSecretKey);
            return claims.get(claim, String.class);
        } catch (JwtException e) {
            try {
                var claims = parseToken(token, refreshSecretKey);
                return claims.get(claim, String.class);
            } catch (JwtException ex) {
                return null;
            }
        }
    }

    private Claims parseToken(String token, SecretKey key) {
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
