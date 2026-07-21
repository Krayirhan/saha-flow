import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:saha_flow_mobile/core/auth/auth_state.dart';
import 'package:saha_flow_mobile/core/theme/app_colors.dart';
import 'package:saha_flow_mobile/features/dashboard/providers/dashboard_provider.dart';
import 'package:saha_flow_mobile/features/login/providers/auth_provider.dart';
import 'package:saha_flow_mobile/shared/widgets/loading_indicator.dart';
import 'package:saha_flow_mobile/shared/widgets/error_view.dart';
import 'package:saha_flow_mobile/shared/widgets/offline_banner.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(dashboardProvider.notifier).loadDashboard();
    });
  }

  @override
  Widget build(BuildContext context) {
    final dashboardState = ref.watch(dashboardProvider);
    final authState = ref.watch(authStateProvider);
    final connectivityService = ref.read(connectivityServiceProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Bugünkü İşlerim'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () =>
                ref.read(dashboardProvider.notifier).refresh(),
          ),
        ],
      ),
      body: Column(
        children: [
          OfflineBanner(connectivityService: connectivityService),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () =>
                  ref.read(dashboardProvider.notifier).loadDashboard(),
              child: _buildBody(context, dashboardState, authState),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBody(
    BuildContext context,
    DashboardState state,
    AuthState authState,
  ) {
    if (state.isLoading) {
      return const LoadingIndicator(message: 'Dashboard yükleniyor...');
    }

    if (state.error != null) {
      return ErrorView(
        message: state.error!,
        onRetry: () => ref.read(dashboardProvider.notifier).loadDashboard(),
      );
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildWelcomeCard(context, authState),
        const SizedBox(height: 16),
        _buildStatsGrid(context, state),
        const SizedBox(height: 24),
        if (state.summary.pendingJobs > 0) ...[
          _buildPendingAlert(context, state.summary.pendingJobs),
          const SizedBox(height: 16),
        ],
        _buildQuickActions(context),
      ],
    );
  }

  Widget _buildWelcomeCard(BuildContext context, AuthState authState) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            CircleAvatar(
              radius: 28,
              backgroundColor: AppColors.primaryLight,
              child: Text(
                (authState.userName ?? 'T')[0].toUpperCase(),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Merhaba,',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  Text(
                    authState.userName ?? 'Teknisyen',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsGrid(BuildContext context, DashboardState state) {
    final theme = Theme.of(context);
    final summary = state.summary;

    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 1.4,
      children: [
        _buildStatCard(
          context,
          title: 'Toplam İş',
          value: '${summary.totalJobs}',
          icon: Icons.work_outline,
          color: AppColors.primary,
        ),
        _buildStatCard(
          context,
          title: 'Tamamlanan',
          value: '${summary.completedJobs}',
          icon: Icons.check_circle_outline,
          color: AppColors.success,
        ),
        _buildStatCard(
          context,
          title: 'Devam Eden',
          value: '${summary.inProgressJobs}',
          icon: Icons.play_circle_outline,
          color: AppColors.info,
        ),
        _buildStatCard(
          context,
          title: 'Bekleyen',
          value: '${summary.pendingJobs}',
          icon: Icons.schedule,
          color: AppColors.warning,
        ),
      ],
    );
  }

  Widget _buildStatCard(
    BuildContext context, {
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 32),
            const SizedBox(height: 8),
            Text(
              value,
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    color: color,
                    fontWeight: FontWeight.bold,
                  ),
            ),
            Text(
              title,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPendingAlert(BuildContext context, int count) {
    return Card(
      color: AppColors.warningLight,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            const Icon(Icons.warning_amber, color: AppColors.warning),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                '$count iş emri bekliyor. Lütfen iş emirlerini kontrol edin.',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Hızlı İşlemler',
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 12),
        Card(
          child: Column(
            children: [
              ListTile(
                leading: const Icon(Icons.list_alt),
                title: const Text('İş Emirleri'),
                subtitle: const Text('Tüm iş emirlerini görüntüle'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {
                  // go_router navigasyonu
                },
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.sync),
                title: const Text('Senkronizasyon'),
                subtitle: const Text('Verileri manuel senkronize et'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {},
              ),
            ],
          ),
        ),
      ],
    );
  }
}
