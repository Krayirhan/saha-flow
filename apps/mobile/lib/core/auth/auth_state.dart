import 'package:riverpod/riverpod.dart';

enum AuthStatus { initial, authenticated, unauthenticated, loading }

class AuthState {
  final AuthStatus status;
  final bool isLoading;
  final String? userId;
  final String? userEmail;
  final String? userName;
  final String? error;

  const AuthState({
    this.status = AuthStatus.initial,
    this.isLoading = false,
    this.userId,
    this.userEmail,
    this.userName,
    this.error,
  });

  AuthState copyWith({
    AuthStatus? status,
    bool? isLoading,
    String? userId,
    String? userEmail,
    String? userName,
    String? error,
    bool clearError = false,
  }) {
    return AuthState(
      status: status ?? this.status,
      isLoading: isLoading ?? this.isLoading,
      userId: userId ?? this.userId,
      userEmail: userEmail ?? this.userEmail,
      userName: userName ?? this.userName,
      error: clearError ? null : (error ?? this.error),
    );
  }

  bool get isAuthenticated => status == AuthStatus.authenticated;
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(const AuthState());

  void setLoading(bool value) {
    state = state.copyWith(isLoading: value);
  }

  void authenticated({
    required String userId,
    required String email,
    String? userName,
  }) {
    state = AuthState(
      status: AuthStatus.authenticated,
      isLoading: false,
      userId: userId,
      userEmail: email,
      userName: userName ?? email,
      error: null,
    );
  }

  void unauthenticated() {
    state = const AuthState(status: AuthStatus.unauthenticated);
  }

  void setError(String message) {
    state = state.copyWith(
      status: AuthStatus.unauthenticated,
      error: message,
      isLoading: false,
    );
  }

  void clearError() {
    state = state.copyWith(clearError: true);
  }
}

final authStateProvider =
    StateNotifierProvider.autoDispose<AuthNotifier, AuthState>(
  (ref) => AuthNotifier(),
);
