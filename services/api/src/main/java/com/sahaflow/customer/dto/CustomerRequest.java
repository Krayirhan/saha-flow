package com.sahaflow.customer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record CustomerRequest(
    @NotBlank @Size(max = 200) String name,
    @Email @Size(max = 255) String email,
    @Size(max = 20) String phone,
    @Size(max = 20) String taxId,
    @Size(max = 100) String taxOffice,
    @Size(max = 2000) String notes,
    List<AddressRequest> addresses
) {
    public record AddressRequest(
        @NotBlank String label,
        @NotBlank String addressLine1,
        String addressLine2,
        @NotBlank String city,
        String district,
        String postalCode,
        String country,
        Double latitude,
        Double longitude,
        boolean isDefault
    ) {}
}
