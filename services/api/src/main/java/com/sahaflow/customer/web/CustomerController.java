package com.sahaflow.customer.web;

import com.sahaflow.customer.dto.CustomerRequest;
import com.sahaflow.customer.dto.CustomerResponse;
import com.sahaflow.customer.service.CustomerService;
import com.sahaflow.shared.pagination.PageRequest;
import com.sahaflow.shared.pagination.PagedResponse;
import com.sahaflow.shared.tenant.TenantContextHolder;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public ResponseEntity<CustomerResponse> create(@Valid @RequestBody CustomerRequest request) {
        var tenantId = TenantContextHolder.getTenantId();
        var response = customerService.create(tenantId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<PagedResponse<CustomerResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        var tenantId = TenantContextHolder.getTenantId();
        var pageRequest = new PageRequest(page, size, "createdAt", "DESC");
        var result = search != null
            ? customerService.search(tenantId, search, pageRequest)
            : customerService.findAll(tenantId, pageRequest);
        return ResponseEntity.ok(PagedResponse.from(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> get(@PathVariable String id) {
        var tenantId = TenantContextHolder.getTenantId();
        return ResponseEntity.ok(customerService.findById(tenantId, id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> update(@PathVariable String id,
                                                    @Valid @RequestBody CustomerRequest request) {
        var tenantId = TenantContextHolder.getTenantId();
        return ResponseEntity.ok(customerService.update(tenantId, id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
        var tenantId = TenantContextHolder.getTenantId();
        customerService.delete(tenantId, id);
        return ResponseEntity.ok(Map.of("status", "deleted"));
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<Map<String, String>> deactivate(@PathVariable String id) {
        var tenantId = TenantContextHolder.getTenantId();
        customerService.deactivate(tenantId, id);
        return ResponseEntity.ok(Map.of("status", "deactivated"));
    }
}
