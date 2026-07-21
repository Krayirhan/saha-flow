import 'package:flutter/material.dart';
import 'package:saha_flow_mobile/core/theme/app_colors.dart';
import 'package:saha_flow_mobile/core/utils/date_formatter.dart';
import 'package:saha_flow_mobile/features/work_orders/domain/work_order.dart';
import 'package:saha_flow_mobile/features/work_orders/presentation/widgets/status_chip.dart';

class WorkOrderCard extends StatelessWidget {
  final WorkOrder workOrder;
  final VoidCallback? onTap;

  const WorkOrderCard({
    super.key,
    required this.workOrder,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.primaryLight.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      workOrder.orderNumber,
                      style: theme.textTheme.labelLarge?.copyWith(
                        color: AppColors.primary,
                      ),
                    ),
                  ),
                  const Spacer(),
                  StatusChip(status: workOrder.status),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  const Icon(Icons.person_outline,
                      size: 18, color: AppColors.onSurfaceSecondary),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      workOrder.customerName,
                      style: theme.textTheme.titleMedium,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.location_on_outlined,
                      size: 18, color: AppColors.onSurfaceSecondary),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      '${workOrder.address}, ${workOrder.district}/${workOrder.city}',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: AppColors.onSurfaceSecondary,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.build_outlined,
                      size: 18, color: AppColors.onSurfaceSecondary),
                  const SizedBox(width: 6),
                  Text(
                    '${workOrder.deviceType} - ${workOrder.deviceBrand} ${workOrder.deviceModel}',
                    style: theme.textTheme.bodySmall,
                  ),
                ],
              ),
              const Divider(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.access_time,
                          size: 16, color: AppColors.primary),
                      const SizedBox(width: 4),
                      Text(
                        workOrder.scheduledDate != null
                            ? DateFormatter.formatDateTime(
                                workOrder.scheduledDate!,
                              )
                            : '--',
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  if (workOrder.photoUrls.isNotEmpty)
                    Row(
                      children: [
                        const Icon(Icons.photo_library_outlined,
                            size: 16, color: AppColors.onSurfaceSecondary),
                        const SizedBox(width: 4),
                        Text(
                          '${workOrder.photoUrls.length}',
                          style: theme.textTheme.bodySmall,
                        ),
                      ],
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
