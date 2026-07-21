package com.sahaflow.shared.tenant;

public final class TenantContext {

    private final String tenantId;
    private final String userId;
    private final String role;

    public TenantContext(String tenantId, String userId, String role) {
        this.tenantId = tenantId;
        this.userId = userId;
        this.role = role;
    }

    public String getTenantId() {
        return tenantId;
    }

    public String getUserId() {
        return userId;
    }

    public String getRole() {
        return role;
    }

    public boolean hasTenant() {
        return tenantId != null && !tenantId.isBlank();
    }
}
