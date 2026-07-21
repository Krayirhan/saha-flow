package com.sahaflow.shared.tenant;

public final class TenantContextHolder {

    private static final ThreadLocal<TenantContext> CONTEXT = new ThreadLocal<>();

    private TenantContextHolder() {}

    public static void set(TenantContext context) {
        CONTEXT.set(context);
    }

    public static TenantContext get() {
        return CONTEXT.get();
    }

    public static String getTenantId() {
        var ctx = CONTEXT.get();
        return ctx != null ? ctx.getTenantId() : null;
    }

    public static String getUserId() {
        var ctx = CONTEXT.get();
        return ctx != null ? ctx.getUserId() : null;
    }

    public static void clear() {
        CONTEXT.remove();
    }
}
