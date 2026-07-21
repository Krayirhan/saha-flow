package com.sahaflow.workorder.web;

import com.sahaflow.shared.pagination.PageRequest;
import com.sahaflow.shared.pagination.PagedResponse;
import com.sahaflow.shared.tenant.TenantContextHolder;
import com.sahaflow.workorder.dto.WorkOrderCreateRequest;
import com.sahaflow.workorder.dto.WorkOrderResponse;
import com.sahaflow.workorder.dto.WorkOrderUpdateRequest;
import com.sahaflow.workorder.service.WorkOrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/work-orders")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    public WorkOrderController(WorkOrderService workOrderService) {
        this.workOrderService = workOrderService;
    }

    @PostMapping
    public ResponseEntity<WorkOrderResponse> create(@Valid @RequestBody WorkOrderCreateRequest request) {
        var tenantId = TenantContextHolder.getTenantId();
        var response = workOrderService.create(tenantId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<PagedResponse<WorkOrderResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String assignee) {
        var tenantId = TenantContextHolder.getTenantId();
        var pageRequest = new PageRequest(page, size, "createdAt", "DESC");

        var result = status != null
            ? workOrderService.findByStatus(tenantId, status, pageRequest)
            : assignee != null
                ? workOrderService.findByAssignee(tenantId, assignee, pageRequest)
                : workOrderService.findAll(tenantId, pageRequest);

        return ResponseEntity.ok(PagedResponse.from(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkOrderResponse> get(@PathVariable String id) {
        var tenantId = TenantContextHolder.getTenantId();
        return ResponseEntity.ok(workOrderService.findById(tenantId, id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkOrderResponse> update(@PathVariable String id,
                                                     @Valid @RequestBody WorkOrderUpdateRequest request) {
        var tenantId = TenantContextHolder.getTenantId();
        return ResponseEntity.ok(workOrderService.update(tenantId, id, request));
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<WorkOrderResponse> assign(@PathVariable String id,
                                                     @RequestBody Map<String, String> body) {
        var tenantId = TenantContextHolder.getTenantId();
        var userId = body.get("userId");
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("userId is required");
        }
        return ResponseEntity.ok(workOrderService.assign(tenantId, id, userId));
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<WorkOrderResponse> startProgress(@PathVariable String id) {
        var tenantId = TenantContextHolder.getTenantId();
        return ResponseEntity.ok(workOrderService.startProgress(tenantId, id));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<WorkOrderResponse> complete(@PathVariable String id,
                                                       @RequestBody(required = false) Map<String, String> body) {
        var tenantId = TenantContextHolder.getTenantId();
        var note = body != null ? body.getOrDefault("note", null) : null;
        return ResponseEntity.ok(workOrderService.complete(tenantId, id, note));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<WorkOrderResponse> approve(@PathVariable String id) {
        var tenantId = TenantContextHolder.getTenantId();
        return ResponseEntity.ok(workOrderService.approve(tenantId, id));
    }

    @PostMapping("/{id}/invoice")
    public ResponseEntity<WorkOrderResponse> invoice(@PathVariable String id,
                                                      @RequestBody(required = false) Map<String, Object> body) {
        var tenantId = TenantContextHolder.getTenantId();
        var cost = body != null && body.containsKey("actualCost")
            ? new BigDecimal(body.get("actualCost").toString()) : null;
        var duration = body != null && body.containsKey("actualDurationMinutes")
            ? ((Number) body.get("actualDurationMinutes")).intValue() : null;
        return ResponseEntity.ok(workOrderService.invoice(tenantId, id, cost, duration));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<WorkOrderResponse> markPaid(@PathVariable String id) {
        var tenantId = TenantContextHolder.getTenantId();
        return ResponseEntity.ok(workOrderService.markPaid(tenantId, id));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<WorkOrderResponse> cancel(@PathVariable String id,
                                                     @RequestBody(required = false) Map<String, String> body) {
        var tenantId = TenantContextHolder.getTenantId();
        var reason = body != null ? body.getOrDefault("reason", "Cancelled by user") : "Cancelled by user";
        return ResponseEntity.ok(workOrderService.cancel(tenantId, id, reason));
    }
}
