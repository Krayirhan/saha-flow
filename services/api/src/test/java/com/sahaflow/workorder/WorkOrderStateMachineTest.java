package com.sahaflow.workorder;

import com.sahaflow.workorder.domain.WorkOrder;
import com.sahaflow.workorder.domain.WorkOrderStatus;
import com.sahaflow.workorder.service.WorkOrderStateMachine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class WorkOrderStateMachineTest {

    private WorkOrderStateMachine stateMachine;

    @BeforeEach
    void setUp() {
        stateMachine = new WorkOrderStateMachine();
    }

    // -----------------------------------------------------------------------
    // validateTransition — initial creation (from == null)
    // -----------------------------------------------------------------------

    @Nested
    @DisplayName("Initial creation (from = null)")
    class InitialCreation {

        @Test
        @DisplayName("null → OPEN is valid")
        void nullToOpen_isValid() {
            stateMachine.validateTransition(null, WorkOrderStatus.OPEN);
        }

        @ParameterizedTest
        @EnumSource(value = WorkOrderStatus.class, names = {"ASSIGNED", "IN_PROGRESS", "COMPLETED",
                "APPROVED", "INVOICED", "PAID", "CANCELLED"})
        @DisplayName("null → non-OPEN throws")
        void nullToNonOpen_shouldThrow(WorkOrderStatus to) {
            assertThatThrownBy(() -> stateMachine.validateTransition(null, to))
                    .isInstanceOf(IllegalStateException.class);
        }
    }

    // -----------------------------------------------------------------------
    // validateTransition — OPEN
    // -----------------------------------------------------------------------

    @Nested
    @DisplayName("From OPEN")
    class FromOpen {

        @Test
        @DisplayName("OPEN → ASSIGNED is valid")
        void toAssigned() {
            stateMachine.validateTransition(WorkOrderStatus.OPEN, WorkOrderStatus.ASSIGNED);
        }

        @Test
        @DisplayName("OPEN → CANCELLED is valid")
        void toCancelled() {
            stateMachine.validateTransition(WorkOrderStatus.OPEN, WorkOrderStatus.CANCELLED);
        }

        @ParameterizedTest
        @EnumSource(value = WorkOrderStatus.class, names = {"OPEN", "IN_PROGRESS", "COMPLETED", "APPROVED", "INVOICED", "PAID"})
        @DisplayName("OPEN → other states throw")
        void toInvalid_shouldThrow(WorkOrderStatus to) {
            assertThatThrownBy(() -> stateMachine.validateTransition(WorkOrderStatus.OPEN, to))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("Invalid state transition");
        }
    }

    // -----------------------------------------------------------------------
    // validateTransition — ASSIGNED
    // -----------------------------------------------------------------------

    @Nested
    @DisplayName("From ASSIGNED")
    class FromAssigned {

        @Test
        @DisplayName("ASSIGNED → IN_PROGRESS is valid")
        void toInProgress() {
            stateMachine.validateTransition(WorkOrderStatus.ASSIGNED, WorkOrderStatus.IN_PROGRESS);
        }

        @Test
        @DisplayName("ASSIGNED → OPEN is valid (unassign)")
        void toOpen_unassign() {
            stateMachine.validateTransition(WorkOrderStatus.ASSIGNED, WorkOrderStatus.OPEN);
        }

        @Test
        @DisplayName("ASSIGNED → CANCELLED is valid")
        void toCancelled() {
            stateMachine.validateTransition(WorkOrderStatus.ASSIGNED, WorkOrderStatus.CANCELLED);
        }

        @ParameterizedTest
        @EnumSource(value = WorkOrderStatus.class, names = {"ASSIGNED", "COMPLETED", "APPROVED", "INVOICED", "PAID"})
        @DisplayName("ASSIGNED → other states throw")
        void toInvalid_shouldThrow(WorkOrderStatus to) {
            assertThatThrownBy(() -> stateMachine.validateTransition(WorkOrderStatus.ASSIGNED, to))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("Invalid state transition");
        }
    }

    // -----------------------------------------------------------------------
    // validateTransition — IN_PROGRESS
    // -----------------------------------------------------------------------

    @Nested
    @DisplayName("From IN_PROGRESS")
    class FromInProgress {

        @Test
        @DisplayName("IN_PROGRESS → COMPLETED is valid")
        void toCompleted() {
            stateMachine.validateTransition(WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.COMPLETED);
        }

        @Test
        @DisplayName("IN_PROGRESS → ASSIGNED is valid (reassign)")
        void toAssigned_reassign() {
            stateMachine.validateTransition(WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.ASSIGNED);
        }

        @Test
        @DisplayName("IN_PROGRESS → CANCELLED is valid")
        void toCancelled() {
            stateMachine.validateTransition(WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.CANCELLED);
        }

        @ParameterizedTest
        @EnumSource(value = WorkOrderStatus.class, names = {"OPEN", "IN_PROGRESS", "APPROVED", "INVOICED", "PAID"})
        @DisplayName("IN_PROGRESS → other states throw")
        void toInvalid_shouldThrow(WorkOrderStatus to) {
            assertThatThrownBy(() -> stateMachine.validateTransition(WorkOrderStatus.IN_PROGRESS, to))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("Invalid state transition");
        }
    }

    // -----------------------------------------------------------------------
    // validateTransition — terminal and billing states
    // -----------------------------------------------------------------------

    @Nested
    @DisplayName("Billing pipeline (COMPLETED → PAID)")
    class BillingPipeline {

        @Test
        @DisplayName("COMPLETED → APPROVED is valid")
        void completedToApproved() {
            stateMachine.validateTransition(WorkOrderStatus.COMPLETED, WorkOrderStatus.APPROVED);
        }

        @Test
        @DisplayName("APPROVED → INVOICED is valid")
        void approvedToInvoiced() {
            stateMachine.validateTransition(WorkOrderStatus.APPROVED, WorkOrderStatus.INVOICED);
        }

        @Test
        @DisplayName("INVOICED → PAID is valid")
        void invoicedToPaid() {
            stateMachine.validateTransition(WorkOrderStatus.INVOICED, WorkOrderStatus.PAID);
        }

        @Test
        @DisplayName("COMPLETED → CANCELLED throws")
        void completedToCancelled_shouldThrow() {
            assertThatThrownBy(() -> stateMachine.validateTransition(WorkOrderStatus.COMPLETED, WorkOrderStatus.CANCELLED))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("Invalid state transition");
        }
    }

    // -----------------------------------------------------------------------
    // validateTransition — terminal states (PAID, CANCELLED)
    // -----------------------------------------------------------------------

    @Nested
    @DisplayName("Terminal states — no outgoing transitions")
    class TerminalStates {

        @ParameterizedTest
        @EnumSource(WorkOrderStatus.class)
        @DisplayName("CANCELLED → any state throws")
        void cancelledToAny_shouldThrow(WorkOrderStatus to) {
            assertThatThrownBy(() -> stateMachine.validateTransition(WorkOrderStatus.CANCELLED, to))
                    .isInstanceOf(IllegalStateException.class);
        }

        @ParameterizedTest
        @EnumSource(WorkOrderStatus.class)
        @DisplayName("PAID → any state throws")
        void paidToAny_shouldThrow(WorkOrderStatus to) {
            assertThatThrownBy(() -> stateMachine.validateTransition(WorkOrderStatus.PAID, to))
                    .isInstanceOf(IllegalStateException.class);
        }
    }

    // -----------------------------------------------------------------------
    // canCancel
    // -----------------------------------------------------------------------

    @Nested
    @DisplayName("canCancel")
    class CanCancel {

        @ParameterizedTest
        @EnumSource(value = WorkOrderStatus.class, names = {"OPEN", "ASSIGNED", "IN_PROGRESS"})
        @DisplayName("returns true for cancellable states")
        void cancellableStates_returnTrue(WorkOrderStatus status) {
            assertThat(stateMachine.canCancel(status)).isTrue();
        }

        @ParameterizedTest
        @EnumSource(value = WorkOrderStatus.class, names = {"COMPLETED", "APPROVED", "INVOICED", "PAID", "CANCELLED"})
        @DisplayName("returns false for non-cancellable states")
        void nonCancellableStates_returnFalse(WorkOrderStatus status) {
            assertThat(stateMachine.canCancel(status)).isFalse();
        }
    }

    // -----------------------------------------------------------------------
    // Full lifecycle paths
    // -----------------------------------------------------------------------

    @Nested
    @DisplayName("Full lifecycle paths")
    class FullLifecycle {

        @Test
        @DisplayName("Happy path: OPEN → ASSIGNED → IN_PROGRESS → COMPLETED → APPROVED → INVOICED → PAID")
        void fullHappyPath() {
            var wo = new WorkOrder();
            wo.setStatus(WorkOrderStatus.OPEN);

            WorkOrderStatus[] path = {
                WorkOrderStatus.ASSIGNED, WorkOrderStatus.IN_PROGRESS,
                WorkOrderStatus.COMPLETED, WorkOrderStatus.APPROVED,
                WorkOrderStatus.INVOICED, WorkOrderStatus.PAID
            };

            for (WorkOrderStatus next : path) {
                stateMachine.validateTransition(wo.getStatus(), next);
                wo.setStatus(next);
            }

            assertThat(wo.getStatus()).isEqualTo(WorkOrderStatus.PAID);
        }

        @Test
        @DisplayName("Reassign path: OPEN → ASSIGNED → IN_PROGRESS → ASSIGNED → IN_PROGRESS → COMPLETED")
        void reassignPath() {
            var wo = new WorkOrder();
            wo.setStatus(WorkOrderStatus.OPEN);

            WorkOrderStatus[] path = {
                WorkOrderStatus.ASSIGNED, WorkOrderStatus.IN_PROGRESS,
                WorkOrderStatus.ASSIGNED, WorkOrderStatus.IN_PROGRESS,
                WorkOrderStatus.COMPLETED
            };

            for (WorkOrderStatus next : path) {
                stateMachine.validateTransition(wo.getStatus(), next);
                wo.setStatus(next);
            }

            assertThat(wo.getStatus()).isEqualTo(WorkOrderStatus.COMPLETED);
        }

        @Test
        @DisplayName("Unassign path: OPEN → ASSIGNED → OPEN → ASSIGNED → IN_PROGRESS")
        void unassignPath() {
            var wo = new WorkOrder();
            wo.setStatus(WorkOrderStatus.OPEN);

            WorkOrderStatus[] path = {
                WorkOrderStatus.ASSIGNED, WorkOrderStatus.OPEN,
                WorkOrderStatus.ASSIGNED, WorkOrderStatus.IN_PROGRESS
            };

            for (WorkOrderStatus next : path) {
                stateMachine.validateTransition(wo.getStatus(), next);
                wo.setStatus(next);
            }

            assertThat(wo.getStatus()).isEqualTo(WorkOrderStatus.IN_PROGRESS);
        }

        @Test
        @DisplayName("Cancel from IN_PROGRESS")
        void cancelFromInProgress() {
            var wo = new WorkOrder();
            wo.setStatus(WorkOrderStatus.IN_PROGRESS);

            stateMachine.validateTransition(wo.getStatus(), WorkOrderStatus.CANCELLED);
            wo.setStatus(WorkOrderStatus.CANCELLED);

            assertThat(wo.getStatus()).isEqualTo(WorkOrderStatus.CANCELLED);
        }
    }
}
