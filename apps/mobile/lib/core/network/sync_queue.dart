import 'dart:async';
import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:saha_flow_mobile/core/constants/app_constants.dart';
import 'package:saha_flow_mobile/core/network/connectivity_service.dart';
import 'package:saha_flow_mobile/core/storage/local_database.dart';
import 'package:uuid/uuid.dart';

class QueuedRequest {
  final String id;
  final String idempotencyKey;
  final String method;
  final String path;
  final Map<String, dynamic>? data;
  final Map<String, dynamic>? queryParameters;
  final DateTime createdAt;
  final int retryCount;
  final String status;

  const QueuedRequest({
    required this.id,
    required this.idempotencyKey,
    required this.method,
    required this.path,
    this.data,
    this.queryParameters,
    required this.createdAt,
    this.retryCount = 0,
    this.status = 'pending',
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'idempotencyKey': idempotencyKey,
        'method': method,
        'path': path,
        'data': data,
        'queryParameters': queryParameters,
        'createdAt': createdAt.toIso8601String(),
        'retryCount': retryCount,
        'status': status,
      };

  factory QueuedRequest.fromJson(Map<String, dynamic> json) {
    return QueuedRequest(
      id: json['id'] as String,
      idempotencyKey: json['idempotencyKey'] as String,
      method: json['method'] as String,
      path: json['path'] as String,
      data: json['data'] as Map<String, dynamic>?,
      queryParameters: json['queryParameters'] as Map<String, dynamic>?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      retryCount: json['retryCount'] as int? ?? 0,
      status: json['status'] as String? ?? 'pending',
    );
  }

  QueuedRequest copyWith({
    int? retryCount,
    String? status,
  }) {
    return QueuedRequest(
      id: id,
      idempotencyKey: idempotencyKey,
      method: method,
      path: path,
      data: data,
      queryParameters: queryParameters,
      createdAt: createdAt,
      retryCount: retryCount ?? this.retryCount,
      status: status ?? this.status,
    );
  }
}

class SyncQueue {
  final LocalDatabase _localDatabase;
  final ConnectivityService _connectivityService;
  final Dio _dio;
  final Uuid _uuid = const Uuid();

  final StreamController<List<QueuedRequest>> _queueController =
      StreamController<List<QueuedRequest>>.broadcast();

  Stream<List<QueuedRequest>> get queueStream => _queueController.stream;
  int _pendingCount = 0;

  SyncQueue({
    required LocalDatabase localDatabase,
    required ConnectivityService connectivityService,
    required Dio dio,
  })  : _localDatabase = localDatabase,
        _connectivityService = connectivityService,
        _dio = dio {
    _listenConnectivity();
  }

  void _listenConnectivity() {
    _connectivityService.connectivityStream.listen((connected) {
      if (connected && _pendingCount > 0) {
        processQueue();
      }
    });
  }

  Future<void> enqueue({
    required String method,
    required String path,
    Map<String, dynamic>? data,
    Map<String, dynamic>? queryParameters,
  }) async {
    final request = QueuedRequest(
      id: _uuid.v4(),
      idempotencyKey: _uuid.v4(),
      method: method,
      path: path,
      data: data,
      queryParameters: queryParameters,
      createdAt: DateTime.now(),
    );

    await _localDatabase.put(
      AppConstants.syncQueueStore,
      request.id,
      request.toJson(),
    );

    _pendingCount++;
    _notifyQueueChange();
  }

  Future<void> processQueue() async {
    final allItems = await _localDatabase
        .getAll(AppConstants.syncQueueStore, limit: 50);

    final pendingItems = allItems
        .map(
          (e) => QueuedRequest.fromJson(Map<String, dynamic>.from(e.value)),
        )
        .where((e) => e.status == 'pending')
        .toList()
      ..sort((a, b) => a.createdAt.compareTo(b.createdAt));

    for (final item in pendingItems) {
      try {
        final options = Options(
          headers: {
            'X-Idempotency-Key': item.idempotencyKey,
          },
        );

        Response response;
        switch (item.method.toUpperCase()) {
          case 'POST':
            response = await _dio.post(
              item.path,
              data: item.data,
              queryParameters: item.queryParameters,
              options: options,
            );
            break;
          case 'PUT':
            response = await _dio.put(
              item.path,
              data: item.data,
              queryParameters: item.queryParameters,
              options: options,
            );
            break;
          case 'DELETE':
            response = await _dio.delete(
              item.path,
              data: item.data,
              queryParameters: item.queryParameters,
              options: options,
            );
            break;
          default:
            response = await _dio.get(
              item.path,
              queryParameters: item.queryParameters,
              options: options,
            );
        }

        if (response.statusCode != null &&
            response.statusCode! >= 200 &&
            response.statusCode! < 300) {
          await _localDatabase.delete(
            AppConstants.syncQueueStore,
            item.id,
          );
          _pendingCount--;
        } else if (response.statusCode == 409) {
          await _localDatabase.delete(
            AppConstants.syncQueueStore,
            item.id,
          );
          _pendingCount--;
        }
      } catch (e) {
        final updated = item.copyWith(retryCount: item.retryCount + 1);

        if (updated.retryCount >= AppConstants.maxRetryAttempts) {
          await _localDatabase.put(
            AppConstants.syncQueueStore,
            item.id,
            item.copyWith(status: 'failed').toJson(),
          );
        } else {
          await _localDatabase.put(
            AppConstants.syncQueueStore,
            item.id,
            updated.toJson(),
          );
        }
      }
    }

    _notifyQueueChange();
  }

  Future<int> pendingCount() async {
    final allItems = await _localDatabase
        .getAll(AppConstants.syncQueueStore);
    return allItems
        .where(
          (e) => e.value['status'] == 'pending',
        )
        .length;
  }

  Future<List<QueuedRequest>> getPendingRequests() async {
    final allItems = await _localDatabase
        .getAll(AppConstants.syncQueueStore);
    return allItems
        .map(
          (e) => QueuedRequest.fromJson(Map<String, dynamic>.from(e.value)),
        )
        .where((e) => e.status == 'pending')
        .toList()
      ..sort((a, b) => a.createdAt.compareTo(b.createdAt));
  }

  void _notifyQueueChange() async {
    final items = await getPendingRequests();
    _queueController.add(items);
  }

  void dispose() {
    _queueController.close();
  }
}
