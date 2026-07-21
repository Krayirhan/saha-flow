package com.sahaflow.shared.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class ValidFileValidator implements ConstraintValidator<ValidFile, MultipartFile> {

    private long maxSize;
    private Set<String> allowedTypes;

    @Override
    public void initialize(ValidFile constraintAnnotation) {
        this.maxSize = constraintAnnotation.maxSize();
        this.allowedTypes = new HashSet<>(Arrays.asList(constraintAnnotation.allowedTypes()));
    }

    @Override
    public boolean isValid(MultipartFile file, ConstraintValidatorContext context) {
        if (file == null || file.isEmpty()) {
            return true;
        }
        if (file.getSize() > maxSize) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(
                "File size must not exceed " + (maxSize / (1024 * 1024)) + "MB")
                .addConstraintViolation();
            return false;
        }
        if (!allowedTypes.isEmpty() && file.getContentType() != null
                && !allowedTypes.contains(file.getContentType())) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(
                "File type '" + file.getContentType() + "' is not allowed. Allowed: " + allowedTypes)
                .addConstraintViolation();
            return false;
        }
        return true;
    }
}
