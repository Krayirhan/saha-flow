package com.sahaflow.shared.error;

public enum ErrorCode {
    VALIDATION_ERROR("VALIDATION_ERROR", "Request validation failed"),
    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", "The requested resource was not found"),
    UNAUTHORIZED("UNAUTHORIZED", "Authentication is required"),
    FORBIDDEN("FORBIDDEN", "Access to this resource is denied"),
    TENANT_NOT_FOUND("TENANT_NOT_FOUND", "The specified tenant does not exist"),
    TENANT_MISMATCH("TENANT_MISMATCH", "Cross-tenant access is not allowed"),
    IDEMPOTENCY_CONFLICT("IDEMPOTENCY_CONFLICT", "Idempotent request already processed with a different payload"),
    RATE_LIMIT_EXCEEDED("RATE_LIMIT_EXCEEDED", "Too many requests, please try again later"),
    FILE_TOO_LARGE("FILE_TOO_LARGE", "Uploaded file exceeds the maximum allowed size"),
    INVALID_FILE_TYPE("INVALID_FILE_TYPE", "Uploaded file type is not supported"),
    INVALID_STATE_TRANSITION("INVALID_STATE_TRANSITION", "The requested state transition is not allowed"),
    DUPLICATE_RESOURCE("DUPLICATE_RESOURCE", "A resource with the same key already exists"),
    INTERNAL_ERROR("INTERNAL_ERROR", "An unexpected internal error occurred");

    private final String code;
    private final String defaultMessage;

    ErrorCode(String code, String defaultMessage) {
        this.code = code;
        this.defaultMessage = defaultMessage;
    }

    public String getCode() {
        return code;
    }

    public String getDefaultMessage() {
        return defaultMessage;
    }
}
