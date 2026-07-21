import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:saha_flow_mobile/core/theme/app_colors.dart';
import 'package:saha_flow_mobile/core/utils/date_formatter.dart';
import 'package:saha_flow_mobile/shared/widgets/loading_indicator.dart';
import 'package:saha_flow_mobile/shared/widgets/error_view.dart';
import 'package:saha_flow_mobile/features/work_orders/providers/work_order_detail_provider.dart';
import 'package:saha_flow_mobile/features/work_orders/presentation/widgets/status_chip.dart';

class WorkOrderDetailScreen extends ConsumerStatefulWidget {
  final String orderId;

  const WorkOrderDetailScreen({super.key, required this.orderId});

  @override
  ConsumerState<WorkOrderDetailScreen> createState() =>
      _WorkOrderDetailScreenState();
}

class _WorkOrderDetailScreenState
    extends ConsumerState<WorkOrderDetailScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref
          .read(workOrderDetailProvider(widget.orderId).notifier)
          .loadDetail();
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(workOrderDetailProvider(widget.orderId));
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          state.workOrder != null
              ? 'İş Emri #${state.workOrder!.orderNumber}'
              : 'İş Emri Detayı',
        ),
      ),
      body: state.isLoading
          ? const LoadingIndicator(message: 'İş emri yükleniyor...')
          : state.error != null
              ? ErrorView(
                  message: state.error!,
                  onRetry: () => ref
                      .read(workOrderDetailProvider(widget.orderId).notifier)
                      .loadDetail(),
                )
              : state.workOrder == null
                  ? const ErrorView(message: 'İş emri bulunamadı.')
                  : _buildDetail(theme, state),
    );
  }

  Widget _buildDetail(ThemeData theme, dynamic state) {
    final order = state.workOrder!;

    return RefreshIndicator(
      onRefresh: () => ref
          .read(workOrderDetailProvider(widget.orderId).notifier)
          .loadDetail(),
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildStatusSection(theme, order),
          const SizedBox(height: 16),
          _buildCustomerSection(theme, order),
          const SizedBox(height: 12),
          _buildDeviceSection(theme, order),
          const SizedBox(height: 12),
          _buildDatesSection(theme, order),
          const SizedBox(height: 12),
          if (order.photoUrls.isNotEmpty) _buildPhotosSection(theme, order),
          const SizedBox(height: 24),
          _buildActionButtons(theme, state),
        ],
      ),
    );
  }

  Widget _buildStatusSection(ThemeData theme, dynamic order) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Durum',
                  style: theme.textTheme.bodySmall,
                ),
                const SizedBox(height: 4),
                StatusChip(status: order.status, fontSize: 14),
              ],
            ),
            const Spacer(),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  'İş No',
                  style: theme.textTheme.bodySmall,
                ),
                const SizedBox(height: 4),
                Text(
                  order.orderNumber,
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCustomerSection(ThemeData theme, dynamic order) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Müşteri Bilgisi',
                style: theme.textTheme.titleMedium),
            const SizedBox(height: 12),
            _infoRow(Icons.person, order.customerName),
            const SizedBox(height: 8),
            _infoRow(Icons.phone, order.customerPhone),
            const SizedBox(height: 8),
            _infoRow(Icons.location_on,
                '${order.address}, ${order.district}/${order.city}'),
            if (order.latitude != null && order.longitude != null) ...[
              const SizedBox(height: 8),
              TextButton.icon(
                onPressed: () {
                  // Open maps: launchUrl
                },
                icon: const Icon(Icons.map, size: 18),
                label: const Text('Haritada Görüntüle'),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildDeviceSection(ThemeData theme, dynamic order) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Cihaz Bilgisi',
                style: theme.textTheme.titleMedium),
            const SizedBox(height: 12),
            _infoRow(
                Icons.devices, '${order.deviceBrand} ${order.deviceModel}'),
            const SizedBox(height: 8),
            _infoRow(Icons.category, order.deviceType),
            const SizedBox(height: 12),
            Text('Arıza Açıklaması',
                style: theme.textTheme.labelLarge),
            const SizedBox(height: 4),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.warningLight.withOpacity(0.4),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                order.issueDescription,
                style: theme.textTheme.bodyMedium,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDatesSection(ThemeData theme, dynamic order) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Zaman Bilgisi',
                style: theme.textTheme.titleMedium),
            const SizedBox(height: 12),
            if (order.scheduledDate != null)
              _infoRow(Icons.event,
                  'Planlanan: ${DateFormatter.formatDateTime(order.scheduledDate!)}'),
            if (order.startTime != null) ...[
              const SizedBox(height: 8),
              _infoRow(Icons.play_arrow,
                  'Başlangıç: ${DateFormatter.formatDateTime(order.startTime!)}'),
            ],
            if (order.endTime != null) ...[
              const SizedBox(height: 8),
              _infoRow(Icons.stop,
                  'Bitiş: ${DateFormatter.formatDateTime(order.endTime!)}'),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildPhotosSection(ThemeData theme, dynamic order) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text('Fotoğraflar',
                    style: theme.textTheme.titleMedium),
                const SizedBox(width: 8),
                Text(
                  '(${order.photoUrls.length})',
                  style: theme.textTheme.bodySmall,
                ),
              ],
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 80,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: order.photoUrls.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  return Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(8),
                      color: AppColors.divider.withOpacity(0.3),
                    ),
                    child: const Icon(Icons.image,
                        color: AppColors.disabled),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButtons(ThemeData theme, dynamic state) {
    final order = state.workOrder!;

    return Column(
      children: [
        if (state.isActionLoading)
          const Padding(
            padding: EdgeInsets.only(bottom: 16),
            child: LoadingIndicator(size: 24),
          ),
        if (state.actionError != null)
          Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: Text(
              state.actionError!,
              style: const TextStyle(color: AppColors.error),
              textAlign: TextAlign.center,
            ),
          ),
        if (order.canStart)
          ElevatedButton.icon(
            onPressed: state.isActionLoading
                ? null
                : () async {
                    // Will navigate to job execution flow
                    // context.go('/work-orders/${order.id}/start');
                  },
            icon: const Icon(Icons.play_arrow),
            label: const Text('İşe Başla'),
          ),
        if (order.canComplete)
          ElevatedButton.icon(
            onPressed: state.isActionLoading
                ? null
                : () async {
                    // Will navigate to job completion
                  },
            icon: const Icon(Icons.check),
            label: const Text('İşi Tamamla'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.success,
            ),
          ),
      ],
    );
  }

  Widget _infoRow(IconData icon, String text) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 18, color: AppColors.onSurfaceSecondary),
        const SizedBox(width: 8),
        Expanded(
          child: Text(text, style: const TextStyle(fontSize: 14)),
        ),
      ],
    );
  }
}
