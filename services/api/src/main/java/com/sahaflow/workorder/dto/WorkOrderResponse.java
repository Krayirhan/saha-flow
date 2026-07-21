package com.sahaflow.workorder.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record WorkOrderResponse(
    String id,
    String tenantId,
    String title,
    String description,
    String status,
    String priority,
    Instant scheduledAt,
    Instant startedAt,
    Instant completedAt,
    String customerId,
    String customerName,
    String addressText,
    Double latitude,
    Double longitude,
    Integer estimatedDurationMinutes,
    Integer actualDurationMinutes,
    BigDecimal estimatedCost,
    BigDecimal actualCost,
    String assignedUserId,
    String createdBy,
    String cancellationReason,
    Instant createdAt,
    Instant updatedAt
) {}
