import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:saha_flow_mobile/features/work_orders/data/repositories/work_order_repository.dart';
import 'package:saha_flow_mobile/features/work_orders/domain/work_order.dart';
import 'package:saha_flow_mobile/features/work_orders/providers/work_order_list_provider.dart';

class WorkOrderDetailState {
  final bool isLoading;
  final String? error;
  final WorkOrder? workOrder;
  final bool isActionLoading;
  final String? actionError;

  const WorkOrderDetailState({
    this.isLoading = false,
    this.error,
    this.workOrder,
    this.isActionLoading = false,
    this.actionError,
  });

  WorkOrderDetailState copyWith({
    bool? isLoading,
    String? error,
    WorkOrder? workOrder,
    bool? isActionLoading,
    String? actionError,
    bool clearError = false,
    bool clearActionError = false,
  }) {
    return WorkOrderDetailState(
      isLoading: isLoading ?? this.isLoading,
      error: clearError ? null : (error ?? this.error),
      workOrder: workOrder ?? this.workOrder,
      isActionLoading: isActionLoading ?? this.isActionLoading,
      actionError: clearActionError
          ? null
          : (actionError ?? this.actionError),
    );
  }
}

class WorkOrderDetailNotifier extends StateNotifier<WorkOrderDetailState> {
  final WorkOrderRepository _repository;
  final String _orderId;

  WorkOrderDetailNotifier(this._repository, this._orderId)
      : super(const WorkOrderDetailState());

  Future<void> loadDetail() async {
    state = state.copyWith(isLoading: true, clearError: true);

    try {
      final order = await _repository.getWorkOrderDetail(_orderId);
      state = state.copyWith(
        isLoading: false,
        workOrder: order,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'İş emri detayı yüklenirken bir hata oluştu.',
      );
    }
  }

  Future<bool> startWorkOrder(double lat, double lng) async {
    if (state.workOrder == null || !state.workOrder!.canStart) return false;

    state = state.copyWith(
      isActionLoading: true,
      clearActionError: true,
    );

    try {
      await _repository.startWorkOrder(_orderId, lat, lng);
      state = state.copyWith(
        isActionLoading: false,
        workOrder: state.workOrder!.copyWith(
          status: 'in_progress',
          startTime: DateTime.now(),
        ),
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isActionLoading: false,
        actionError: 'İş başlatılırken bir hata oluştu.',
      );
      return false;
    }
  }

  Future<bool> completeWorkOrder({
    required String note,
    required List<String> photoUrls,
    String? signatureUrl,
  }) async {
    if (state.workOrder == null || !state.workOrder!.canComplete) return false;

    state = state.copyWith(
      isActionLoading: true,
      clearActionError: true,
    );

    try {
      await _repository.completeWorkOrder(
        _orderId,
        note: note,
        photoUrls: photoUrls,
        signatureUrl: signatureUrl,
      );
      state = state.copyWith(
        isActionLoading: false,
        workOrder: state.workOrder!.copyWith(
          status: 'completed',
          endTime: DateTime.now(),
        ),
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isActionLoading: false,
        actionError: 'İş tamamlanırken bir hata oluştu.',
      );
      return false;
    }
  }
}

final workOrderDetailProvider = StateNotifierProvider.family.autoDispose<
    WorkOrderDetailNotifier, WorkOrderDetailState, String>(
  (ref, orderId) {
    final repository = ref.read(workOrderRepositoryProvider);
    return WorkOrderDetailNotifier(repository, orderId);
  },
);
