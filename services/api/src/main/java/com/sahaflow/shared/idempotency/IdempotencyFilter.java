package com.sahaflow.shared.idempotency;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class IdempotencyFilter extends OncePerRequestFilter {

    private static final String IDEMPOTENCY_KEY_HEADER = "Idempotency-Key";

    private final IdempotencyService idempotencyService;

    public IdempotencyFilter(IdempotencyService idempotencyService) {
        this.idempotencyService = idempotencyService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain) throws ServletException, IOException {
        String idempotencyKey = request.getHeader(IDEMPOTENCY_KEY_HEADER);
        String method = request.getMethod();

        if (("POST".equalsIgnoreCase(method) || "PUT".equalsIgnoreCase(method))
                && idempotencyKey != null && !idempotencyKey.isBlank()) {

            if (request.getRequestURI().contains("/api/auth/")) {
                filterChain.doFilter(request, response);
                return;
            }

            var wrappedRequest = new CachedBodyHttpServletRequest(request);
            String requestBody = new String(wrappedRequest.getCachedBody(), StandardCharsets.UTF_8);

            String existingResponse = idempotencyService.get(idempotencyKey);
            if (existingResponse != null) {
                if (!idempotencyService.matchesPayload(idempotencyKey, requestBody)) {
                    throw new IdempotencyConflictException(
                        "Idempotency-Key '" + idempotencyKey + "' was already used with a different request payload");
                }
                response.setStatus(HttpStatus.OK.value());
                response.setContentType("application/json");
                response.getWriter().write(existingResponse);
                return;
            }

            idempotencyService.storePending(idempotencyKey, requestBody);

            try {
                filterChain.doFilter(wrappedRequest, response);
            } catch (Exception e) {
                idempotencyService.remove(idempotencyKey);
                throw e;
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }

    public static class IdempotencyConflictException extends RuntimeException {
        public IdempotencyConflictException(String message) {
            super(message);
        }
    }
}
