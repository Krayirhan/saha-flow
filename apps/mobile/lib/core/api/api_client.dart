import 'dart:async';
import 'dart:math';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:saha_flow_mobile/core/api/api_exceptions.dart';
import 'package:saha_flow_mobile/core/auth/auth_service.dart';
import 'package:saha_flow_mobile/core/auth/auth_state.dart';
import 'package:saha_flow_mobile/core/auth/token_storage.dart';
import 'package:saha_flow_mobile/core/constants/app_constants.dart';
import 'package:saha_flow_mobile/core/network/connectivity_service.dart';
import 'package:saha_flow_mobile/core/network/sync_queue.dart';
import 'package:uuid/uuid.dart';

class ApiClient {
  late final Dio dio;
  final TokenStorage _tokenStorage;
  final ConnectivityService _connectivityService;
  final SyncQueue _syncQueue;
  final Ref _ref;
  final Uuid _uuid = const Uuid();

  static String? _refreshTokenCallback();

  ApiClient({
    required TokenStorage tokenStorage,
    required ConnectivityService connectivityService,
    required SyncQueue syncQueue,
    required Ref ref,
    String? baseUrl,
  })  : _tokenStorage = tokenStorage,
        _connectivityService = connectivityService,
        _syncQueue = syncQueue,
        _ref = ref {
    dio = Dio(BaseOptions(
      baseUrl: baseUrl ?? AppConstants.baseUrlDev,
      connectTimeout: AppConstants.connectTimeout,
      receiveTimeout: AppConstants.receiveTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      validateStatus: (status) =>
          status != null && status < 500,
    ));

    dio.interceptors.addAll([
      _createCorrelationIdInterceptor(),
      _createAuthInterceptor(),
      _createConnectivityInterceptor(),
      _createRetryInterceptor(),
      _createErrorInterceptor(),
    ]);
  }

  InterceptorsWrapper _createCorrelationIdInterceptor() {
    return InterceptorsWrapper(
      onRequest: (options, handler) {
        final correlationId = _uuid.v4();
        options.headers['X-Correlation-ID'] = correlationId;
        handler.next(options);
      },
    );
  }

  InterceptorsWrapper _createAuthInterceptor() {
    return InterceptorsWrapper(
      onRequest: (options, handler) async {
        final accessToken = await _tokenStorage.getAccessToken();
        if (accessToken != null) {
          options.headers['Authorization'] = 'Bearer $accessToken';
        }
        handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          final authService = AuthService(
            dio: dio,
            tokenStorage: _tokenStorage,
            ref: _ref,
          );
          final newToken = await authService.refreshAccessToken();
          if (newToken != null) {
            error.requestOptions
                .headers['Authorization'] = 'Bearer $newToken';
            try {
              final clonedRequest = await dio.fetch(error.requestOptions);
              return handler.resolve(clonedRequest);
            } on DioException catch (e) {
              return handler.next(e);
            }
          } else {
            _ref.read(authStateProvider.notifier).unauthenticated();
            return handler.next(error);
          }
        }
        handler.next(error);
      },
    );
  }

  InterceptorsWrapper _createConnectivityInterceptor() {
    return InterceptorsWrapper(
      onRequest: (options, handler) async {
        final isConnected = await _connectivityService.isConnected();
        if (!isConnected && options.method.toUpperCase() != 'GET') {
          await _syncQueue.enqueue(
            method: options.method,
            path: options.path,
            data: options.data,
            queryParameters: options.queryParameters,
          );
          handler.reject(
            DioException(
              requestOptions: options,
              type: DioExceptionType.connectionError,
              message: 'Çevrimdışı mod: İşlem senkronizasyon kuyruğuna eklendi',
            ),
          );
          return;
        }
        handler.next(options);
      },
    );
  }

  InterceptorsWrapper _createRetryInterceptor() {
    return InterceptorsWrapper(
      onError: (error, handler) async {
        final retryCount = error.requestOptions
                .extra['retry_count'] as int? ??
            0;

        if (retryCount >= AppConstants.maxRetryAttempts) {
          return handler.next(error);
        }

        final shouldRetry = _shouldRetry(error);
        if (!shouldRetry) {
          return handler.next(error);
        }

        await Future.delayed(
          Duration(milliseconds: _calculateBackoff(retryCount)),
        );

        error.requestOptions.extra['retry_count'] = retryCount + 1;
        try {
          final response = await dio.fetch(error.requestOptions);
          handler.resolve(response);
        } on DioException catch (e) {
          handler.next(e);
        }
      },
    );
  }

  InterceptorsWrapper _createErrorInterceptor() {
    return InterceptorsWrapper(
      onError: (error, handler) {
        handler.next(error);
      },
    );
  }

  bool _shouldRetry(DioException error) {
    return error.type == DioExceptionType.connectionTimeout ||
        error.type == DioExceptionType.receiveTimeout ||
        error.type == DioExceptionType.connectionError ||
        (error.response != null && error.response!.statusCode! >= 500);
  }

  int _calculateBackoff(int attempt) {
    return AppConstants.retryDelayBase.inMilliseconds *
        pow(2, attempt).toInt() +
        Random().nextInt(1000);
  }

  Future<Response> get(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    return dio.get(
      path,
      queryParameters: queryParameters,
      options: options,
      cancelToken: cancelToken,
    );
  }

  Future<Response> post(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    return dio.post(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
      cancelToken: cancelToken,
    );
  }

  Future<Response> put(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    return dio.put(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
      cancelToken: cancelToken,
    );
  }

  Future<Response> delete(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    return dio.delete(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
      cancelToken: cancelToken,
    );
  }
}
