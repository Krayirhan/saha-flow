package com.sahaflow.shared.audit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogService {

    private static final Logger log = LoggerFactory.getLogger(AuditLogService.class);
    private final JdbcClient jdbcClient;

    public AuditLogService(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void persist(AuditEvent event) {
        jdbcClient.sql("""
                INSERT INTO audit_event (tenant_id, user_id, action, resource_type, resource_id,
                    old_values, new_values, ip_address, correlation_id, created_at)
                VALUES (:tenantId, :userId, :action, :resourceType, :resourceId,
                    CAST(:oldValues AS jsonb), CAST(:newValues AS jsonb), :ipAddress, :correlationId, :createdAt)
                """)
            .param("tenantId", event.getTenantId())
            .param("userId", event.getUserId())
            .param("action", event.getAction())
            .param("resourceType", event.getResourceType())
            .param("resourceId", event.getResourceId())
            .param("oldValues", event.getOldValues())
            .param("newValues", event.getNewValues())
            .param("ipAddress", event.getIpAddress())
            .param("correlationId", event.getCorrelationId())
            .param("createdAt", event.getCreatedAt())
            .update();
    }
}
