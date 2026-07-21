package com.sahaflow.identity.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record LoginResponse(
    @JsonProperty("access_token") String accessToken,
    @JsonProperty("refresh_token") String refreshToken,
    @JsonProperty("token_type") String tokenType,
    @JsonProperty("expires_in") long expiresIn,
    @JsonProperty("user_id") String userId,
    @JsonProperty("tenant_id") String tenantId,
    String role,
    @JsonProperty("full_name") String fullName
) {}
