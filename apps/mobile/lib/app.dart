import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:saha_flow_mobile/core/auth/auth_service.dart';
import 'package:saha_flow_mobile/core/auth/auth_state.dart';
import 'package:saha_flow_mobile/core/theme/app_theme.dart';
import 'package:saha_flow_mobile/features/login/presentation/login_screen.dart';
import 'package:saha_flow_mobile/features/login/providers/auth_provider.dart';
import 'package:saha_flow_mobile/features/dashboard/presentation/dashboard_screen.dart';
import 'package:saha_flow_mobile/features/work_orders/presentation/work_order_list_screen.dart';
import 'package:saha_flow_mobile/features/work_orders/presentation/work_order_detail_screen.dart';
import 'package:saha_flow_mobile/features/job_execution/presentation/start_job_screen.dart';
import 'package:saha_flow_mobile/features/job_execution/presentation/checklist_screen.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/dashboard',
    redirect: (context, state) {
      final isLoggedIn = authState.status == AuthStatus.authenticated;
      final isLoginPage = state.matchedLocation == '/login';

      if (!isLoggedIn && !isLoginPage) return '/login';
      if (isLoggedIn && isLoginPage) return '/dashboard';
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        builder: (context, state, child) => ScaffoldWithNavBar(child: child),
        routes: [
          GoRoute(
            path: '/dashboard',
            builder: (context, state) => const DashboardScreen(),
          ),
          GoRoute(
            path: '/work-orders',
            builder: (context, state) => const WorkOrderListScreen(),
            routes: [
              GoRoute(
                path: ':orderId',
                builder: (context, state) {
                  final orderId = state.pathParameters['orderId']!;
                  return WorkOrderDetailScreen(orderId: orderId);
                },
                routes: [
                  GoRoute(
                    path: 'start',
                    builder: (context, state) {
                      final orderId = state.pathParameters['orderId']!;
                      return StartJobScreen(orderId: orderId);
                    },
                  ),
                  GoRoute(
                    path: 'checklist',
                    builder: (context, state) {
                      final orderId = state.pathParameters['orderId']!;
                      return ChecklistScreen(orderId: orderId);
                    },
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
});

class ScaffoldWithNavBar extends StatelessWidget {
  final Widget child;

  const ScaffoldWithNavBar({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    final location = GoRouter.of(context).routerDelegate.currentConfiguration
        .matchedLocation;

    return Scaffold(
      body: child,
      bottomNavigationBar: NavigationBar(
        selectedIndex: _calculateSelectedIndex(location),
        onDestinationSelected: (index) {
          switch (index) {
            case 0:
              context.go('/dashboard');
              break;
            case 1:
              context.go('/work-orders');
              break;
          }
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          NavigationDestination(
            icon: Icon(Icons.work_outline),
            selectedIcon: Icon(Icons.work),
            label: 'İş Emirleri',
          ),
        ],
      ),
    );
  }

  int _calculateSelectedIndex(String location) {
    if (location.startsWith('/dashboard')) return 0;
    if (location.startsWith('/work-orders')) return 1;
    return 0;
  }
}

class SahaFlowApp extends ConsumerStatefulWidget {
  const SahaFlowApp({super.key});

  @override
  ConsumerState<SahaFlowApp> createState() => _SahaFlowAppState();
}

class _SahaFlowAppState extends ConsumerState<SahaFlowApp> {
  @override
  void initState() {
    super.initState();
    _tryAutoLogin();
  }

  Future<void> _tryAutoLogin() async {
    final tokenStorage = ref.read(tokenStorageProvider);
    final apiClient = ref.read(apiClientProvider);
    final authService = AuthService(
      dio: apiClient.dio,
      tokenStorage: tokenStorage,
      ref: ref,
    );

    await authService.tryAutoLogin();
  }

  @override
  Widget build(BuildContext context) {
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'Saha Flow',
      theme: AppTheme.lightTheme,
      debugShowCheckedModeBanner: false,
      routerConfig: router,
    );
  }
}
