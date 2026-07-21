package com.sahaflow.shared.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = TenantIdValidator.class)
@Documented
public @interface ValidTenantId {
    String message() default "Invalid tenant ID format";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
