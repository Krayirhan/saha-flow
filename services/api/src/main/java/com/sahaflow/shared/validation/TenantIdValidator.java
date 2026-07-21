package com.sahaflow.shared.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class TenantIdValidator implements ConstraintValidator<ValidTenantId, String> {

    private static final String TENANT_ID_PATTERN = "^[a-z][a-z0-9]{2,29}$";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return false;
        }
        return value.matches(TENANT_ID_PATTERN);
    }
}
