import 'package:saha_flow_mobile/core/api/api_client.dart';
import 'package:saha_flow_mobile/core/api/api_endpoints.dart';
import 'package:saha_flow_mobile/core/constants/app_constants.dart';
import 'package:saha_flow_mobile/core/storage/local_database.dart';
import 'package:saha_flow_mobile/features/work_orders/data/models/work_order_model.dart';
import 'package:saha_flow_mobile/features/work_orders/domain/work_order.dart';

class WorkOrderRepository {
  final ApiClient _apiClient;
  final LocalDatabase _localDatabase;

  WorkOrderRepository({
    required ApiClient apiClient,
    required LocalDatabase localDatabase,
  })  : _apiClient = apiClient,
        _localDatabase = localDatabase;

  Future<List<WorkOrder>> getWorkOrders({
    String? status,
    int page = 1,
    int perPage = 20,
  }) async {
    final queryParams = <String, dynamic>{
      'page': page,
      'per_page': perPage,
    };
    if (status != null) {
      queryParams['status'] = status;
    }

    try {
      final response = await _apiClient.get(
        ApiEndpoints.workOrders,
        queryParameters: queryParams,
      );

      final data = response.data;
      final List<dynamic> items = data is List ? data : (data['data'] ?? []);

      final orders = items
          .map(
            (json) => WorkOrderModel.fromJson(json as Map<String, dynamic>),
          )
          .map((model) => model.toDomain())
          .toList();

      await _cacheWorkOrders(orders);

      return orders;
    } catch (_) {
      return _getCachedWorkOrders();
    }
  }

  Future<WorkOrder?> getWorkOrderDetail(String id) async {
    try {
      final response = await _apiClient.get(ApiEndpoints.workOrderDetail(id));
      final model = WorkOrderModel.fromJson(
        response.data as Map<String, dynamic>,
      );
      final workOrder = model.toDomain();
      await _cacheWorkOrder(workOrder);
      return workOrder;
    } catch (_) {
      return _getCachedWorkOrder(id);
    }
  }

  Future<void> startWorkOrder(String id, double lat, double lng) async {
    await _apiClient.post(
      ApiEndpoints.startWorkOrder(id),
      data: {
        'latitude': lat,
        'longitude': lng,
      },
    );
  }

  Future<void> completeWorkOrder(
    String id, {
    required String note,
    required List<String> photoUrls,
    String? signatureUrl,
  }) async {
    await _apiClient.post(
      ApiEndpoints.completeWorkOrder(id),
      data: {
        'technician_note': note,
        'photo_urls': photoUrls,
        if (signatureUrl != null) 'signature_url': signatureUrl,
      },
    );
  }

  Future<void> completeChecklistItem(
    String orderId,
    String itemId,
  ) async {
    await _apiClient.post(
      ApiEndpoints.checklistItemComplete(orderId, itemId),
      data: {'completed': true},
    );
  }

  Future<void> updateLocation(
    String orderId,
    double lat,
    double lng,
  ) async {
    await _apiClient.post(
      ApiEndpoints.updateLocation(orderId),
      data: {'latitude': lat, 'longitude': lng},
    );
  }

  Future<void> _cacheWorkOrders(List<WorkOrder> orders) async {
    for (final order in orders) {
      final model = WorkOrderModel.fromDomain(order);
      await _localDatabase.put(
        AppConstants.workOrdersStore,
        order.id,
        model.toJson(),
      );
    }
  }

  Future<void> _cacheWorkOrder(WorkOrder order) async {
    final model = WorkOrderModel.fromDomain(order);
    await _localDatabase.put(
      AppConstants.workOrdersStore,
      order.id,
      model.toJson(),
    );
  }

  Future<List<WorkOrder>> _getCachedWorkOrders() async {
    final items = await _localDatabase.getAll(AppConstants.workOrdersStore);
    return items
        .map(
          (e) =>
              WorkOrderModel.fromJson(Map<String, dynamic>.from(e.value))
                  .toDomain(),
        )
        .toList();
  }

  Future<WorkOrder?> _getCachedWorkOrder(String id) async {
    final data = await _localDatabase.get(AppConstants.workOrdersStore, id);
    if (data == null) return null;
    return WorkOrderModel.fromJson(data).toDomain();
  }
}
