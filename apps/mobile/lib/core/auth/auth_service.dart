import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:saha_flow_mobile/core/api/api_endpoints.dart';
import 'package:saha_flow_mobile/core/api/api_exceptions.dart';
import 'package:saha_flow_mobile/core/auth/auth_state.dart';
import 'package:saha_flow_mobile/core/auth/token_storage.dart';

class AuthService {
  final Dio _dio;
  final TokenStorage _tokenStorage;
  final Ref _ref;

  AuthService({
    required Dio dio,
    required TokenStorage tokenStorage,
    required Ref ref,
  })  : _dio = dio,
        _tokenStorage = tokenStorage,
        _ref = ref;

  Future<void> login({
    required String email,
    required String password,
  }) async {
    try {
      _ref.read(authStateProvider.notifier).setLoading(true);

      final response = await _dio.post(
        ApiEndpoints.login,
        data: jsonEncode({
          'email': email.trim(),
          'password': password,
        }),
      );

      final data = response.data as Map<String, dynamic>;
      final accessToken = data['access_token'] as String;
      final refreshToken = data['refresh_token'] as String;
      final user = data['user'] as Map<String, dynamic>;

      await _tokenStorage.saveTokens(
        accessToken: accessToken,
        refreshToken: refreshToken,
      );
      await _tokenStorage.saveUserId(user['id'].toString());
      await _tokenStorage.saveUserEmail(user['email'] as String);

      _ref.read(authStateProvider.notifier).authenticated(
            userId: user['id'].toString(),
            email: user['email'] as String,
            userName:
                '${user['first_name'] ?? ''} ${user['last_name'] ?? ''}'.trim(),
          );
    } on DioException catch (e) {
      final apiException = ApiException.fromDioError(e);
      _ref.read(authStateProvider.notifier).setError(apiException.message);
      rethrow;
    } catch (e) {
      _ref
          .read(authStateProvider.notifier)
          .setError('Giriş yapılırken bir hata oluştu.');
      rethrow;
    }
  }

  Future<bool> tryAutoLogin() async {
    try {
      final hasTokens = await _tokenStorage.hasTokens();
      if (!hasTokens) return false;

      final userId = await _tokenStorage.getUserId();
      final email = await _tokenStorage.getUserEmail();

      if (userId != null && email != null) {
        try {
          final response = await _dio.get(ApiEndpoints.me);
          final user = response.data as Map<String, dynamic>;
          _ref.read(authStateProvider.notifier).authenticated(
                userId: user['id'].toString(),
                email: user['email'] as String,
                userName:
                    '${user['first_name'] ?? ''} ${user['last_name'] ?? ''}'
                        .trim(),
              );
          return true;
        } catch (_) {
          await _tokenStorage.clearAll();
          _ref.read(authStateProvider.notifier).unauthenticated();
          return false;
        }
      }
      return false;
    } catch (_) {
      _ref.read(authStateProvider.notifier).unauthenticated();
      return false;
    }
  }

  Future<String?> refreshAccessToken() async {
    try {
      final refreshToken = await _tokenStorage.getRefreshToken();
      if (refreshToken == null) return null;

      final response = await _dio.post(
        ApiEndpoints.refreshToken,
        data: jsonEncode({'refresh_token': refreshToken}),
      );

      final data = response.data as Map<String, dynamic>;
      final newAccessToken = data['access_token'] as String;
      final newRefreshToken = data['refresh_token'] as String;

      await _tokenStorage.saveTokens(
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      );

      return newAccessToken;
    } catch (_) {
      await logout();
      return null;
    }
  }

  Future<void> logout() async {
    try {
      await _dio.post(ApiEndpoints.logout);
    } catch (_) {
      // Sunucuya logout isteği başarısız olsa da lokal temizlik yap
    } finally {
      await _tokenStorage.clearAll();
      _ref.read(authStateProvider.notifier).unauthenticated();
    }
  }
}
