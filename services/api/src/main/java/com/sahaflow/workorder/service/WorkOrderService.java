package com.sahaflow.workorder.service;

import com.sahaflow.customer.service.CustomerService;
import com.sahaflow.shared.error.ResourceNotFoundException;
import com.sahaflow.shared.tenant.TenantContextHolder;
import com.sahaflow.shared.pagination.PageRequest;
import com.sahaflow.workorder.domain.WorkOrder;
import com.sahaflow.workorder.domain.WorkOrderAssignment;
import com.sahaflow.workorder.domain.WorkOrderStatus;
import com.sahaflow.workorder.domain.WorkOrderStatusHistory;
import com.sahaflow.workorder.dto.WorkOrderCreateRequest;
import com.sahaflow.workorder.dto.WorkOrderResponse;
import com.sahaflow.workorder.dto.WorkOrderUpdateRequest;
import com.sahaflow.workorder.repository.WorkOrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;

@Service
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final CustomerService customerService;
    private final WorkOrderStateMachine stateMachine;

    public WorkOrderService(WorkOrderRepository workOrderRepository,
                             CustomerService customerService,
                             WorkOrderStateMachine stateMachine) {
        this.workOrderRepository = workOrderRepository;
        this.customerService = customerService;
        this.stateMachine = stateMachine;
    }

    @Transactional
    public WorkOrderResponse create(String tenantId, WorkOrderCreateRequest request) {
        stateMachine.validateTransition(null, WorkOrderStatus.OPEN);

        var customer = customerService.findById(tenantId, request.customerId());

        var wo = new WorkOrder();
        wo.setTenantId(tenantId);
        wo.setTitle(request.title());
        wo.setDescription(request.description());
        wo.setCustomerId(request.customerId());
        wo.setCustomerName(customer.name());
        wo.setAddressText(request.addressText());
        wo.setPriority(request.priority() != null ? request.priority() : "MEDIUM");
        wo.setScheduledAt(request.scheduledAt());
        wo.setLatitude(request.latitude());
        wo.setLongitude(request.longitude());
        wo.setEstimatedDurationMinutes(request.estimatedDurationMinutes());
        wo.setEstimatedCost(request.estimatedCost());
        wo.setCreatedBy(TenantContextHolder.getUserId());
        wo.setStatus(WorkOrderStatus.OPEN);

        wo = workOrderRepository.save(wo);

        if (request.assignedUserId() != null && !request.assignedUserId().isBlank()) {
            transitionStatus(wo, WorkOrderStatus.ASSIGNED, "Auto-assigned on creation", tenantId);
        }

        return toResponse(wo);
    }

    @Transactional(readOnly = true)
    public WorkOrderResponse findById(String tenantId, String id) {
        var wo = workOrderRepository.findByTenantIdAndId(tenantId, id)
            .orElseThrow(() -> ResourceNotFoundException.of("Work order", id));
        return toResponse(wo);
    }

    @Transactional(readOnly = true)
    public Page<WorkOrderResponse> findAll(String tenantId, PageRequest pageRequest) {
        return workOrderRepository.findAllByTenantId(tenantId, pageRequest.toSpringPageRequest())
            .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<WorkOrderResponse> findByStatus(String tenantId, String status, PageRequest pageRequest) {
        var st = WorkOrderStatus.valueOf(status.toUpperCase());
        return workOrderRepository.findAllByTenantIdAndStatus(tenantId, st, pageRequest.toSpringPageRequest())
            .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<WorkOrderResponse> findByAssignee(String tenantId, String userId, PageRequest pageRequest) {
        return workOrderRepository.findAllByTenantIdAndAssignedUserId(tenantId, userId,
                pageRequest.toSpringPageRequest())
            .map(this::toResponse);
    }

    @Transactional
    public WorkOrderResponse update(String tenantId, String id, WorkOrderUpdateRequest request) {
        var wo = workOrderRepository.findByTenantIdAndId(tenantId, id)
            .orElseThrow(() -> ResourceNotFoundException.of("Work order", id));

        if (request.title() != null) wo.setTitle(request.title());
        if (request.description() != null) wo.setDescription(request.description());
        if (request.priority() != null) wo.setPriority(request.priority());
        if (request.scheduledAt() != null) wo.setScheduledAt(request.scheduledAt());
        if (request.addressText() != null) wo.setAddressText(request.addressText());
        if (request.latitude() != null) wo.setLatitude(request.latitude());
        if (request.longitude() != null) wo.setLongitude(request.longitude());
        if (request.estimatedDurationMinutes() != null) wo.setEstimatedDurationMinutes(request.estimatedDurationMinutes());
        if (request.estimatedCost() != null) wo.setEstimatedCost(request.estimatedCost());

        wo = workOrderRepository.save(wo);
        return toResponse(wo);
    }

    @Transactional
    public WorkOrderResponse assign(String tenantId, String id, String assignedUserId) {
        var wo = workOrderRepository.findByTenantIdAndId(tenantId, id)
            .orElseThrow(() -> ResourceNotFoundException.of("Work order", id));

        transitionStatus(wo, WorkOrderStatus.ASSIGNED,
            "Assigned to user " + assignedUserId, tenantId);
        wo.setAssignedUserId(assignedUserId);

        wo = workOrderRepository.save(wo);
        return toResponse(wo);
    }

    @Transactional
    public WorkOrderResponse startProgress(String tenantId, String id) {
        var wo = workOrderRepository.findByTenantIdAndId(tenantId, id)
            .orElseThrow(() -> ResourceNotFoundException.of("Work order", id));

        transitionStatus(wo, WorkOrderStatus.IN_PROGRESS,
            "Work started by field technician", tenantId);
        wo.setStartedAt(Instant.now());

        wo = workOrderRepository.save(wo);
        return toResponse(wo);
    }

    @Transactional
    public WorkOrderResponse complete(String tenantId, String id, String note) {
        var wo = workOrderRepository.findByTenantIdAndId(tenantId, id)
            .orElseThrow(() -> ResourceNotFoundException.of("Work order", id));

        transitionStatus(wo, WorkOrderStatus.COMPLETED,
            note != null ? note : "Work completed", tenantId);
        wo.setCompletedAt(Instant.now());

        wo = workOrderRepository.save(wo);
        return toResponse(wo);
    }

    @Transactional
    public WorkOrderResponse approve(String tenantId, String id) {
        var wo = workOrderRepository.findByTenantIdAndId(tenantId, id)
            .orElseThrow(() -> ResourceNotFoundException.of("Work order", id));

        transitionStatus(wo, WorkOrderStatus.APPROVED,
            "Approved by customer", tenantId);

        wo = workOrderRepository.save(wo);
        return toResponse(wo);
    }

    @Transactional
    public WorkOrderResponse invoice(String tenantId, String id, BigDecimal actualCost,
                                      Integer actualDurationMinutes) {
        var wo = workOrderRepository.findByTenantIdAndId(tenantId, id)
            .orElseThrow(() -> ResourceNotFoundException.of("Work order", id));

        transitionStatus(wo, WorkOrderStatus.INVOICED,
            "Invoice generated", tenantId);

        if (actualCost != null) wo.setActualCost(actualCost);
        if (actualDurationMinutes != null) wo.setActualDurationMinutes(actualDurationMinutes);

        wo = workOrderRepository.save(wo);
        return toResponse(wo);
    }

    @Transactional
    public WorkOrderResponse markPaid(String tenantId, String id) {
        var wo = workOrderRepository.findByTenantIdAndId(tenantId, id)
            .orElseThrow(() -> ResourceNotFoundException.of("Work order", id));

        transitionStatus(wo, WorkOrderStatus.PAID,
            "Payment received", tenantId);

        wo = workOrderRepository.save(wo);
        return toResponse(wo);
    }

    @Transactional
    public WorkOrderResponse cancel(String tenantId, String id, String reason) {
        var wo = workOrderRepository.findByTenantIdAndId(tenantId, id)
            .orElseThrow(() -> ResourceNotFoundException.of("Work order", id));

        if (!stateMachine.canCancel(wo.getStatus())) {
            throw new IllegalStateException(
                "Cannot cancel work order in status " + wo.getStatus());
        }

        transitionStatus(wo, WorkOrderStatus.CANCELLED,
            reason != null ? reason : "Cancelled", tenantId);
        wo.setCancellationReason(reason);

        wo = workOrderRepository.save(wo);
        return toResponse(wo);
    }

    private void transitionStatus(WorkOrder wo, WorkOrderStatus to, String note, String tenantId) {
        var history = new WorkOrderStatusHistory();
        history.setWorkOrder(wo);
        history.setFromStatus(wo.getStatus());
        history.setToStatus(to);
        history.setChangedBy(TenantContextHolder.getUserId());
        history.setNote(note);
        wo.getStatusHistory().add(history);
        wo.setStatus(to);
    }

    private WorkOrderResponse toResponse(WorkOrder wo) {
        return new WorkOrderResponse(
            wo.getId(), wo.getTenantId(), wo.getTitle(), wo.getDescription(),
            wo.getStatus().name(), wo.getPriority(),
            wo.getScheduledAt(), wo.getStartedAt(), wo.getCompletedAt(),
            wo.getCustomerId(), wo.getCustomerName(), wo.getAddressText(),
            wo.getLatitude(), wo.getLongitude(),
            wo.getEstimatedDurationMinutes(), wo.getActualDurationMinutes(),
            wo.getEstimatedCost(), wo.getActualCost(),
            wo.getAssignedUserId(), wo.getCreatedBy(), wo.getCancellationReason(),
            wo.getCreatedAt(), wo.getUpdatedAt()
        );
    }
}
