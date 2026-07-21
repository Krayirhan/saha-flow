package com.sahaflow.tenant.web;

import com.sahaflow.tenant.domain.Tenant;
import com.sahaflow.tenant.service.TenantService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {

    private final TenantService tenantService;

    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @GetMapping("/{tenantId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Tenant> getTenant(@PathVariable String tenantId) {
        return ResponseEntity.ok(tenantService.findById(tenantId));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<Tenant> getTenantBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(tenantService.findBySlug(slug));
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createTenant(@Valid @RequestBody CreateTenantRequest request) {
        var tenant = tenantService.create(request.slug(), request.name());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(Map.of("id", tenant.getId(), "slug", tenant.getSlug()));
    }

    @PostMapping("/{tenantId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deactivateTenant(@PathVariable String tenantId) {
        tenantService.deactivate(tenantId);
        return ResponseEntity.ok(Map.of("status", "deactivated"));
    }

    public record CreateTenantRequest(
        @NotBlank String slug,
        @NotBlank String name
    ) {}
}
