package com.sahaflow.workorder.service;

import com.sahaflow.workorder.domain.WorkOrderStatus;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.Map;
import java.util.Set;

@Component
public class WorkOrderStateMachine {

    private final Map<WorkOrderStatus, Set<WorkOrderStatus>> allowedTransitions;

    public WorkOrderStateMachine() {
        this.allowedTransitions = new EnumMap<>(WorkOrderStatus.class);
        allowedTransitions.put(WorkOrderStatus.OPEN, Set.of(WorkOrderStatus.ASSIGNED, WorkOrderStatus.CANCELLED));
        allowedTransitions.put(WorkOrderStatus.ASSIGNED, Set.of(WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.OPEN, WorkOrderStatus.CANCELLED));
        allowedTransitions.put(WorkOrderStatus.IN_PROGRESS, Set.of(WorkOrderStatus.COMPLETED, WorkOrderStatus.ASSIGNED, WorkOrderStatus.CANCELLED));
        allowedTransitions.put(WorkOrderStatus.COMPLETED, Set.of(WorkOrderStatus.APPROVED));
        allowedTransitions.put(WorkOrderStatus.APPROVED, Set.of(WorkOrderStatus.INVOICED));
        allowedTransitions.put(WorkOrderStatus.INVOICED, Set.of(WorkOrderStatus.PAID));
        allowedTransitions.put(WorkOrderStatus.PAID, Set.of());
        allowedTransitions.put(WorkOrderStatus.CANCELLED, Set.of());
    }

    public void validateTransition(WorkOrderStatus from, WorkOrderStatus to) {
        if (from == null) {
            if (to != WorkOrderStatus.OPEN) {
                throw new IllegalStateException(
                    "Work order must start in OPEN status, not " + to);
            }
            return;
        }

        var allowed = allowedTransitions.get(from);
        if (allowed == null || !allowed.contains(to)) {
            throw new IllegalStateException(
                "Invalid state transition: " + from + " -> " + to +
                ". Allowed transitions from " + from + ": " + allowed);
        }
    }

    public boolean canCancel(WorkOrderStatus status) {
        return status == WorkOrderStatus.OPEN
            || status == WorkOrderStatus.ASSIGNED
            || status == WorkOrderStatus.IN_PROGRESS;
    }
}
