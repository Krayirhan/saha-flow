import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:saha_flow_mobile/core/api/api_client.dart';
import 'package:saha_flow_mobile/core/api/api_endpoints.dart';
import 'package:saha_flow_mobile/features/login/providers/auth_provider.dart';

class DashboardSummary {
  final int totalJobs;
  final int completedJobs;
  final int pendingJobs;
  final int inProgressJobs;

  const DashboardSummary({
    this.totalJobs = 0,
    this.completedJobs = 0,
    this.pendingJobs = 0,
    this.inProgressJobs = 0,
  });

  DashboardSummary copyWith({
    int? totalJobs,
    int? completedJobs,
    int? pendingJobs,
    int? inProgressJobs,
  }) {
    return DashboardSummary(
      totalJobs: totalJobs ?? this.totalJobs,
      completedJobs: completedJobs ?? this.completedJobs,
      pendingJobs: pendingJobs ?? this.pendingJobs,
      inProgressJobs: inProgressJobs ?? this.inProgressJobs,
    );
  }

  factory DashboardSummary.fromJson(Map<String, dynamic> json) {
    return DashboardSummary(
      totalJobs: json['total_jobs'] as int? ?? 0,
      completedJobs: json['completed_jobs'] as int? ?? 0,
      pendingJobs: json['pending_jobs'] as int? ?? 0,
      inProgressJobs: json['in_progress_jobs'] as int? ?? 0,
    );
  }
}

class DashboardState {
  final bool isLoading;
  final String? error;
  final DashboardSummary summary;

  const DashboardState({
    this.isLoading = false,
    this.error,
    this.summary = const DashboardSummary(),
  });

  DashboardState copyWith({
    bool? isLoading,
    String? error,
    DashboardSummary? summary,
    bool clearError = false,
  }) {
    return DashboardState(
      isLoading: isLoading ?? this.isLoading,
      error: clearError ? null : (error ?? this.error),
      summary: summary ?? this.summary,
    );
  }
}

class DashboardNotifier extends StateNotifier<DashboardState> {
  final ApiClient _apiClient;

  DashboardNotifier(this._apiClient) : super(const DashboardState());

  Future<void> loadDashboard() async {
    state = state.copyWith(isLoading: true, clearError: true);

    try {
      final response = await _apiClient.get(ApiEndpoints.dashboard);
      final data = response.data as Map<String, dynamic>;
      final summary = DashboardSummary.fromJson(data);

      state = state.copyWith(
        isLoading: false,
        summary: summary,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'Dashboard yüklenirken bir hata oluştu.',
      );
    }
  }

  void refresh() {
    loadDashboard();
  }
}

final dashboardProvider =
    StateNotifierProvider.autoDispose<DashboardNotifier, DashboardState>(
  (ref) {
    final apiClient = ref.read(apiClientProvider);
    return DashboardNotifier(apiClient);
  },
);
