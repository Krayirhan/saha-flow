package com.sahaflow.workorder.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;

public record WorkOrderCreateRequest(
    @NotBlank @Size(max = 200) String title,
    @Size(max = 4000) String description,
    @NotNull String customerId,
    String customerName,
    @Size(max = 500) String addressText,
    String priority,
    Instant scheduledAt,
    Double latitude,
    Double longitude,
    Integer estimatedDurationMinutes,
    BigDecimal estimatedCost,
    String assignedUserId
) {}
