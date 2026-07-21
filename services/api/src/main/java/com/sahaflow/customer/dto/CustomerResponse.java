package com.sahaflow.customer.dto;

import java.time.Instant;
import java.util.List;

public record CustomerResponse(
    String id,
    String tenantId,
    String name,
    String email,
    String phone,
    String taxId,
    String taxOffice,
    String notes,
    boolean active,
    Instant createdAt,
    Instant updatedAt,
    String createdBy,
    List<AddressResponse> addresses
) {
    public record AddressResponse(
        String id,
        String label,
        String addressLine1,
        String addressLine2,
        String city,
        String district,
        String postalCode,
        String country,
        Double latitude,
        Double longitude,
        boolean isDefault
    ) {}
}
