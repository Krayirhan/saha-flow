package com.sahaflow.shared.audit;

import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class AuditEventListener {

    private final AuditLogService auditLogService;

    public AuditEventListener(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @Async
    @EventListener
    public void handleAuditEvent(AuditEvent event) {
        auditLogService.persist(event);
    }
}
