package com.sahaflow.identity.web;

import com.sahaflow.identity.dto.LoginRequest;
import com.sahaflow.identity.dto.LoginResponse;
import com.sahaflow.identity.dto.RegisterRequest;
import com.sahaflow.identity.dto.TokenRefreshRequest;
import com.sahaflow.identity.service.AuthenticationService;
import com.sahaflow.shared.config.RateLimitConfig;
import com.sahaflow.shared.error.ErrorCode;
import com.sahaflow.shared.error.ProblemDetailBuilder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationService authenticationService;
    private final RateLimitConfig rateLimitConfig;

    public AuthController(AuthenticationService authenticationService,
                           RateLimitConfig rateLimitConfig) {
        this.authenticationService = authenticationService;
        this.rateLimitConfig = rateLimitConfig;
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request,
                                                   HttpServletRequest httpRequest) {
        var bucket = rateLimitConfig.resolveAuthBucket(getClientIp(httpRequest));
        if (!bucket.tryConsume(1)) {
            throw new RateLimitExceededException();
        }

        var response = authenticationService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request,
                                                @RequestHeader(value = "X-Tenant-Id", required = false) String tenantId,
                                                HttpServletRequest httpRequest) {
        var bucket = rateLimitConfig.resolveAuthBucket(getClientIp(httpRequest));
        if (!bucket.tryConsume(1)) {
            throw new RateLimitExceededException();
        }

        var response = authenticationService.login(request, tenantId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(@Valid @RequestBody TokenRefreshRequest request) {
        var response = authenticationService.refresh(request);
        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(RateLimitExceededException.class)
    public ProblemDetail handleRateLimit(RateLimitExceededException ex, HttpServletRequest request) {
        return ProblemDetailBuilder.build(HttpStatus.TOO_MANY_REQUESTS,
            ErrorCode.RATE_LIMIT_EXCEEDED,
            "Rate limit exceeded. Try again later.",
            request.getRequestURI());
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    static class RateLimitExceededException extends RuntimeException {}
}
