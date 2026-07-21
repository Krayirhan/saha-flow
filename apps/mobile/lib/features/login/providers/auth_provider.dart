import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:saha_flow_mobile/core/api/api_client.dart';
import 'package:saha_flow_mobile/core/auth/auth_service.dart';
import 'package:saha_flow_mobile/core/auth/auth_state.dart';
import 'package:saha_flow_mobile/core/auth/token_storage.dart';
import 'package:saha_flow_mobile/core/network/connectivity_service.dart';
import 'package:saha_flow_mobile/core/network/sync_queue.dart';
import 'package:saha_flow_mobile/core/storage/local_database.dart';

class LoginState {
  final bool isLoading;
  final String? error;

  const LoginState({this.isLoading = false, this.error});

  LoginState copyWith({bool? isLoading, String? error, bool clearError = false}) {
    return LoginState(
      isLoading: isLoading ?? this.isLoading,
      error: clearError ? null : (error ?? this.error),
    );
  }
}

class LoginNotifier extends StateNotifier<LoginState> {
  final Ref _ref;

  LoginNotifier(this._ref) : super(const LoginState());

  Future<void> login({
    required String email,
    required String password,
  }) async {
    state = state.copyWith(isLoading: true, clearError: true);

    try {
      final apiClient = _ref.read(apiClientProvider);
      final tokenStorage = _ref.read(tokenStorageProvider);
      final authService = AuthService(
        dio: apiClient.dio,
        tokenStorage: tokenStorage,
        ref: _ref,
      );

      await authService.login(email: email, password: password);
      state = state.copyWith(isLoading: false);
    } on DioException catch (e) {
      final message = _getErrorMessage(e);
      state = state.copyWith(isLoading: false, error: message);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.',
      );
    }
  }

  String _getErrorMessage(DioException e) {
    switch (e.response?.statusCode) {
      case 401:
        return 'E-posta veya şifre hatalı.';
      case 403:
        return 'Hesabınız devre dışı bırakılmış.';
      case 429:
        return 'Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.';
      default:
        if (e.type == DioExceptionType.connectionTimeout ||
            e.type == DioExceptionType.connectionError) {
          return 'İnternet bağlantısı kurulamadı.';
        }
        return 'Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.';
    }
  }

  void clearError() {
    state = state.copyWith(clearError: true);
  }
}

// --- Providers ---

final tokenStorageProvider = Provider<TokenStorage>((ref) {
  return TokenStorage();
});

final connectivityServiceProvider = Provider<ConnectivityService>((ref) {
  final service = ConnectivityService();
  ref.onDispose(() => service.dispose());
  return service;
});

final localDatabaseProvider = Provider<LocalDatabase>((ref) {
  return LocalDatabase();
});

final syncQueueProvider = Provider<SyncQueue>((ref) {
  final db = ref.read(localDatabaseProvider);
  final connectivity = ref.read(connectivityServiceProvider);
  final apiClient = ref.read(apiClientProvider);
  final queue = SyncQueue(
    localDatabase: db,
    connectivityService: connectivity,
    dio: apiClient.dio,
  );
  ref.onDispose(() => queue.dispose());
  return queue;
});

final apiClientProvider = Provider<ApiClient>((ref) {
  final tokenStorage = ref.read(tokenStorageProvider);
  final connectivityService = ref.read(connectivityServiceProvider);
  final syncQueue = ref.read(syncQueueProvider);

  final client = ApiClient(
    tokenStorage: tokenStorage,
    connectivityService: connectivityService,
    syncQueue: syncQueue,
    ref: ref,
  );

  return client;
});

final loginProvider =
    StateNotifierProvider.autoDispose<LoginNotifier, LoginState>(
  (ref) => LoginNotifier(ref),
);
