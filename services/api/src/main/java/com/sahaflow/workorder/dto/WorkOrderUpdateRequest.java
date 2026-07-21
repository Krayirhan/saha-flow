package com.sahaflow.workorder.dto;

import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;

public record WorkOrderUpdateRequest(
    @Size(max = 200) String title,
    @Size(max = 4000) String description,
    String priority,
    Instant scheduledAt,
    String addressText,
    Double latitude,
    Double longitude,
    Integer estimatedDurationMinutes,
    BigDecimal estimatedCost,
    String assignedUserId
) {}
