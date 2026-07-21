class ApiEndpoints {
  ApiEndpoints._();

  // Base
  static const String basePath = '/api/v1';

  // Auth
  static const String login = '$basePath/auth/login';
  static const String refreshToken = '$basePath/auth/refresh';
  static const String logout = '$basePath/auth/logout';
  static const String me = '$basePath/auth/me';
  static const String changePassword = '$basePath/auth/change-password';
  static const String forgotPassword = '$basePath/auth/forgot-password';

  // Dashboard
  static const String dashboard = '$basePath/dashboard';
  static const String dashboardSummary = '$basePath/dashboard/summary';

  // Work Orders
  static const String workOrders = '$basePath/work-orders';
  static String workOrderDetail(String id) => '$basePath/work-orders/$id';
  static String startWorkOrder(String id) =>
      '$basePath/work-orders/$id/start';
  static String completeWorkOrder(String id) =>
      '$basePath/work-orders/$id/complete';
  static String workOrderChecklist(String id) =>
      '$basePath/work-orders/$id/checklist';
  static String workOrderPhotos(String id) =>
      '$basePath/work-orders/$id/photos';
  static String workOrderSignature(String id) =>
      '$basePath/work-orders/$id/signature';
  static String workOrderHistory(String id) =>
      '$basePath/work-orders/$id/history';

  // Checklist items
  static String checklistItemComplete(String orderId, String itemId) =>
      '$basePath/work-orders/$orderId/checklist/$itemId/complete';

  // Files / Upload
  static const String uploadPhoto = '$basePath/files/upload/photo';
  static const String uploadSignature = '$basePath/files/upload/signature';

  // Location
  static String updateLocation(String orderId) =>
      '$basePath/work-orders/$orderId/location';

  // Technician
  static const String technicianProfile = '$basePath/technician/profile';
  static const String technicianSchedule = '$basePath/technician/schedule';

  // Sync
  static const String syncStatus = '$basePath/sync/status';
  static const String syncPush = '$basePath/sync/push';
  static const String syncPull = '$basePath/sync/pull';

  // Customer
  static String customerDetail(String id) => '$basePath/customers/$id';
  static String customerHistory(String id) =>
      '$basePath/customers/$id/work-orders';
}
