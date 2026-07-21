import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:saha_flow_mobile/core/theme/app_colors.dart';
import 'package:saha_flow_mobile/shared/widgets/loading_indicator.dart';
import 'package:saha_flow_mobile/shared/widgets/error_view.dart';
import 'package:saha_flow_mobile/shared/widgets/empty_state.dart';
import 'package:saha_flow_mobile/features/work_orders/providers/work_order_list_provider.dart';
import 'package:saha_flow_mobile/features/work_orders/presentation/widgets/work_order_card.dart';

class WorkOrderListScreen extends ConsumerStatefulWidget {
  const WorkOrderListScreen({super.key});

  @override
  ConsumerState<WorkOrderListScreen> createState() =>
      _WorkOrderListScreenState();
}

class _WorkOrderListScreenState extends ConsumerState<WorkOrderListScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(workOrderListProvider.notifier).loadWorkOrders();
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(workOrderListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('İş Emirleri'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () =>
                ref.read(workOrderListProvider.notifier).refresh(),
          ),
        ],
      ),
      body: Column(
        children: [
          _buildStatusFilter(),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () =>
                  ref.read(workOrderListProvider.notifier).refresh(),
              child: _buildList(state),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusFilter() {
    final state = ref.watch(workOrderListProvider);
    final items = [
      (null, 'Tümü'),
      ('pending', 'Bekleyen'),
      ('in_progress', 'Devam Eden'),
      ('completed', 'Tamamlanan'),
    ];

    return Container(
      height: 48,
      color: Colors.white,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        itemCount: items.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final (status, label) = items[index];
          final isSelected = state.statusFilter == status;

          return FilterChip(
            label: Text(label),
            selected: isSelected,
            selectedColor: AppColors.primaryLight.withOpacity(0.2),
            checkmarkColor: AppColors.primary,
            labelStyle: TextStyle(
              color: isSelected ? AppColors.primary : AppColors.onSurface,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
            ),
            onSelected: (_) {
              ref
                  .read(workOrderListProvider.notifier)
                  .setStatusFilter(status);
            },
          );
        },
      ),
    );
  }

  Widget _buildList(WorkOrderListState state) {
    if (state.isLoading && state.workOrders.isEmpty) {
      return const LoadingIndicator(message: 'İş emirleri yükleniyor...');
    }

    if (state.error != null && state.workOrders.isEmpty) {
      return ErrorView(
        message: state.error!,
        onRetry: () =>
            ref.read(workOrderListProvider.notifier).loadWorkOrders(),
      );
    }

    if (state.workOrders.isEmpty) {
      return const EmptyState(
        message: 'İş emri bulunamadı',
        subtitle: 'Henüz size atanmış bir iş emri yok.',
        icon: Icons.work_off_outlined,
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(vertical: 8),
      itemCount: state.workOrders.length,
      itemBuilder: (context, index) {
        final order = state.workOrders[index];
        return WorkOrderCard(
          workOrder: order,
          onTap: () {
            // Navigate to detail screen
            // context.go('/work-orders/${order.id}');
          },
        );
      },
    );
  }
}
