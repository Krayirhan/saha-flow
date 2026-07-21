import 'package:flutter/foundation.dart';

class AppConstants {
  AppConstants._();

  // App
  static const String appName = 'Saha Flow';
  static const String appVersion = '1.0.0';
  static const String appBuildNumber = '1';
  static const String companyName = 'Saha Flow Teknoloji';

  // API
  static const String baseUrlDev = 'http://10.0.2.2:8080/api';
  static const String baseUrlProd = 'https://api.sahaflow.com/api';
  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 15);
  static const int maxRetryAttempts = 3;
  static const Duration retryDelayBase = Duration(seconds: 1);
  static const int maxPageSize = 50;

  // Auth
  static const String accessTokenKey = 'access_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userIdKey = 'user_id';
  static const String userEmailKey = 'user_email';
  static const String userNameKey = 'user_name';
  static const int tokenExpiryThresholdMinutes = 5;

  // Local DB
  static const String localDbName = 'saha_flow_local.db';
  static const String syncQueueStore = 'sync_queue';
  static const String workOrdersStore = 'work_orders';
  static const String customersStore = 'customers';
  static const String settingsStore = 'settings';
  static const int localDBSizeLimitMb = 50;

  // Date format
  static const String dateFormatDisplay = 'dd.MM.yyyy';
  static const String timeFormatDisplay = 'HH:mm';
  static const String dateTimeFormatDisplay = 'dd.MM.yyyy HH:mm';
  static const String apiDateFormat = 'yyyy-MM-dd';
  static const String localeTR = 'tr_TR';

  // Work order statuses
  static const String statusPending = 'pending';
  static const String statusInProgress = 'in_progress';
  static const String statusCompleted = 'completed';
  static const String statusCancelled = 'cancelled';

  // Geolocation
  static const double locationAccuracyMeters = 10.0;
  static const int locationTimeoutSeconds = 15;
  static const double defaultLatitude = 41.0082;
  static const double defaultLongitude = 28.9784;

  // File limits
  static const int maxPhotoCount = 10;
  static const int maxPhotoWidth = 1920;
  static const int maxPhotoHeight = 1080;
  static const int photoQuality = 80;
  static const int maxUploadSizeMb = 10;

  // Sync
  static const int syncIntervalMinutes = 5;
  static const int maxSyncQueueSize = 100;
  static const int syncBatchSize = 10;
}
