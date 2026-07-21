import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:saha_flow_mobile/features/login/providers/auth_provider.dart';
import 'package:saha_flow_mobile/features/work_orders/data/repositories/work_order_repository.dart';
import 'package:saha_flow_mobile/features/work_orders/domain/work_order.dart';

class WorkOrderListState {
  final bool isLoading;
  final String? error;
  final List<WorkOrder> workOrders;
  final String? statusFilter;

  const WorkOrderListState({
    this.isLoading = false,
    this.error,
    this.workOrders = const [],
    this.statusFilter,
  });

  WorkOrderListState copyWith({
    bool? isLoading,
    String? error,
    List<WorkOrder>? workOrders,
    String? statusFilter,
    bool clearError = false,
  }) {
    return WorkOrderListState(
      isLoading: isLoading ?? this.isLoading,
      error: clearError ? null : (error ?? this.error),
      workOrders: workOrders ?? this.workOrders,
      statusFilter: statusFilter ?? this.statusFilter,
    );
  }
}

class WorkOrderListNotifier extends StateNotifier<WorkOrderListState> {
  final WorkOrderRepository _repository;
  bool _initialLoaded = false;

  WorkOrderListNotifier(this._repository) : super(const WorkOrderListState());

  Future<void> loadWorkOrders() async {
    state = state.copyWith(isLoading: true, clearError: true);

    try {
      final orders = await _repository.getWorkOrders(
        status: state.statusFilter,
      );

      state = state.copyWith(
        isLoading: false,
        workOrders: orders,
      );
      _initialLoaded = true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'İş emirleri yüklenirken bir hata oluştu.',
      );
    }
  }

  void setStatusFilter(String? status) {
    state = state.copyWith(statusFilter: status);
    loadWorkOrders();
  }

  Future<void> refresh() async {
    state = state.copyWith(workOrders: []);
    await loadWorkOrders();
  }
}

final workOrderRepositoryProvider = Provider<WorkOrderRepository>((ref) {
  final apiClient = ref.read(apiClientProvider);
  final localDb = ref.read(localDatabaseProvider);
  return WorkOrderRepository(apiClient: apiClient, localDatabase: localDb);
});

final workOrderListProvider = StateNotifierProvider.autoDispose<
    WorkOrderListNotifier, WorkOrderListState>(
  (ref) {
    final repository = ref.read(workOrderRepositoryProvider);
    return WorkOrderListNotifier(repository);
  },
);
