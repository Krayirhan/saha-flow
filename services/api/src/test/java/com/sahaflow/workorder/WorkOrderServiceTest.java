package com.sahaflow.workorder;

import com.sahaflow.workorder.domain.WorkOrder;
import com.sahaflow.workorder.domain.WorkOrderStatus;
import com.sahaflow.workorder.service.WorkOrderStateMachine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class WorkOrderServiceTest {

    private WorkOrderStateMachine stateMachine;

    @BeforeEach
    void setUp() {
        stateMachine = new WorkOrderStateMachine();
    }

    @Test
    @DisplayName("validateTransition - should allow OPEN to ASSIGNED")
    void validateTransition_openToAssigned() {
        stateMachine.validateTransition(WorkOrderStatus.OPEN, WorkOrderStatus.ASSIGNED);
    }

    @Test
    @DisplayName("validateTransition - should allow OPEN to CANCELLED")
    void validateTransition_openToCancelled() {
        stateMachine.validateTransition(WorkOrderStatus.OPEN, WorkOrderStatus.CANCELLED);
    }

    @Test
    @DisplayName("validateTransition - should throw on OPEN to COMPLETED (skip states)")
    void validateTransition_openToCompleted_shouldThrow() {
        assertThatThrownBy(() ->
            stateMachine.validateTransition(WorkOrderStatus.OPEN, WorkOrderStatus.COMPLETED))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("Invalid state transition");
    }

    @Test
    @DisplayName("validateTransition - should throw on COMPLETED to CANCELLED")
    void validateTransition_completedToCancelled_shouldThrow() {
        assertThatThrownBy(() ->
            stateMachine.validateTransition(WorkOrderStatus.COMPLETED, WorkOrderStatus.CANCELLED))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("Invalid state transition");
    }

    @Test
    @DisplayName("validateTransition - should throw on CANCELLED to any state")
    void validateTransition_cancelledToAny_shouldThrow() {
        assertThatThrownBy(() ->
            stateMachine.validateTransition(WorkOrderStatus.CANCELLED, WorkOrderStatus.ASSIGNED))
            .isInstanceOf(IllegalStateException.class);
    }

    @ParameterizedTest
    @EnumSource(value = WorkOrderStatus.class, names = {"OPEN", "ASSIGNED", "IN_PROGRESS"})
    @DisplayName("canCancel - should return true for cancellable states")
    void canCancel_shouldReturnTrue(WorkOrderStatus status) {
        assertThat(stateMachine.canCancel(status)).isTrue();
    }

    @ParameterizedTest
    @EnumSource(value = WorkOrderStatus.class, names = {"COMPLETED", "APPROVED", "INVOICED", "PAID", "CANCELLED"})
    @DisplayName("canCancel - should return false for non-cancellable states")
    void canCancel_shouldReturnFalse(WorkOrderStatus status) {
        assertThat(stateMachine.canCancel(status)).isFalse();
    }

    @Test
    @DisplayName("Full happy path: OPEN -> ASSIGNED -> IN_PROGRESS -> COMPLETED -> APPROVED -> INVOICED -> PAID")
    void fullHappyPath() {
        var wo = new WorkOrder();
        wo.setStatus(WorkOrderStatus.OPEN);

        stateMachine.validateTransition(wo.getStatus(), WorkOrderStatus.ASSIGNED);
        wo.setStatus(WorkOrderStatus.ASSIGNED);

        stateMachine.validateTransition(wo.getStatus(), WorkOrderStatus.IN_PROGRESS);
        wo.setStatus(WorkOrderStatus.IN_PROGRESS);

        stateMachine.validateTransition(wo.getStatus(), WorkOrderStatus.COMPLETED);
        wo.setStatus(WorkOrderStatus.COMPLETED);

        stateMachine.validateTransition(wo.getStatus(), WorkOrderStatus.APPROVED);
        wo.setStatus(WorkOrderStatus.APPROVED);

        stateMachine.validateTransition(wo.getStatus(), WorkOrderStatus.INVOICED);
        wo.setStatus(WorkOrderStatus.INVOICED);

        stateMachine.validateTransition(wo.getStatus(), WorkOrderStatus.PAID);
        wo.setStatus(WorkOrderStatus.PAID);

        assertThat(wo.getStatus()).isEqualTo(WorkOrderStatus.PAID);
    }
}
