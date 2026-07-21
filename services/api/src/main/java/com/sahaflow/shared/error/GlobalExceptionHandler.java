package com.sahaflow.shared.error;

import com.sahaflow.shared.tenant.TenantContextHolder;
import com.sahaflow.shared.idempotency.IdempotencyFilter;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        var errors = ex.getBindingResult().getFieldErrors().stream()
            .map(fe -> Map.of(
                "field", fe.getField(),
                "message", fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "Invalid value",
                "rejectedValue", fe.getRejectedValue() != null ? fe.getRejectedValue().toString() : "null"
            ))
            .toList();

        var problem = ProblemDetailBuilder.build(HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR,
            "Validation failed for fields: " + errors.stream()
                .map(e -> e.get("field")).reduce((a, b) -> a + ", " + b).orElse("unknown"));
        problem.setProperty("errors", errors);
        problem.setProperty("correlationId", getCorrelationId(request));
        return problem;
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ProblemDetail handleHttpMessageNotReadable(HttpMessageNotReadableException ex, HttpServletRequest request) {
        return ProblemDetailBuilder.build(HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR,
            "Request body is missing or malformed", request.getRequestURI());
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ProblemDetail handleMissingParam(MissingServletRequestParameterException ex, HttpServletRequest request) {
        return ProblemDetailBuilder.build(HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR,
            "Required parameter '" + ex.getParameterName() + "' is missing", request.getRequestURI());
    }

    @ExceptionHandler(MissingRequestHeaderException.class)
    public ProblemDetail handleMissingHeader(MissingRequestHeaderException ex, HttpServletRequest request) {
        return ProblemDetailBuilder.build(HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR,
            "Required header '" + ex.getHeaderName() + "' is missing", request.getRequestURI());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ProblemDetail handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest request) {
        return ProblemDetailBuilder.build(HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR,
            ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ProblemDetail handleIllegalState(IllegalStateException ex, HttpServletRequest request) {
        return ProblemDetailBuilder.build(HttpStatus.CONFLICT, ErrorCode.INVALID_STATE_TRANSITION,
            ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ProblemDetail handleBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        return ProblemDetailBuilder.build(HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED,
            "Invalid email or password", request.getRequestURI());
    }

    @ExceptionHandler(AuthenticationException.class)
    public ProblemDetail handleAuthentication(AuthenticationException ex, HttpServletRequest request) {
        return ProblemDetailBuilder.build(HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED,
            ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ProblemDetail handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        return ProblemDetailBuilder.build(HttpStatus.FORBIDDEN, ErrorCode.FORBIDDEN,
            "You do not have permission to access this resource", request.getRequestURI());
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ProblemDetail handleNoResourceFound(NoResourceFoundException ex, HttpServletRequest request) {
        return ProblemDetailBuilder.build(HttpStatus.NOT_FOUND, ErrorCode.RESOURCE_NOT_FOUND,
            "No static resource found at " + request.getRequestURI(), request.getRequestURI());
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ProblemDetail handleMaxUploadSize(MaxUploadSizeExceededException ex, HttpServletRequest request) {
        return ProblemDetailBuilder.build(HttpStatus.PAYLOAD_TOO_LARGE, ErrorCode.FILE_TOO_LARGE,
            "File size exceeds the maximum allowed limit of 10MB", request.getRequestURI());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ProblemDetail handleDataIntegrity(DataIntegrityViolationException ex, HttpServletRequest request) {
        String message = ex.getMostSpecificCause().getMessage();
        if (message != null && message.contains("duplicate")) {
            return ProblemDetailBuilder.build(HttpStatus.CONFLICT, ErrorCode.DUPLICATE_RESOURCE,
                "A resource with the same unique key already exists", request.getRequestURI());
        }
        log.error("Data integrity violation", ex);
        return ProblemDetailBuilder.build(HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_ERROR,
            "A data integrity error occurred", request.getRequestURI());
    }

    @ExceptionHandler(IdempotencyFilter.IdempotencyConflictException.class)
    public ProblemDetail handleIdempotencyConflict(IdempotencyFilter.IdempotencyConflictException ex,
                                                    HttpServletRequest request) {
        return ProblemDetailBuilder.build(HttpStatus.CONFLICT, ErrorCode.IDEMPOTENCY_CONFLICT,
            ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGeneric(Exception ex, HttpServletRequest request) {
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        return ProblemDetailBuilder.build(HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_ERROR,
            "An unexpected error occurred. Reference: " + getCorrelationId(request),
            request.getRequestURI());
    }

    private String getCorrelationId(HttpServletRequest request) {
        Object attr = request.getAttribute("correlationId");
        if (attr != null) {
            return attr.toString();
        }
        String tenantId = TenantContextHolder.getTenantId();
        if (tenantId != null) {
            return tenantId + "/" + UUID.randomUUID().toString().substring(0, 8);
        }
        return UUID.randomUUID().toString().substring(0, 8);
    }
}
