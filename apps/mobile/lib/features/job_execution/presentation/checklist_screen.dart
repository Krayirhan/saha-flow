import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:saha_flow_mobile/core/theme/app_colors.dart';
import 'package:saha_flow_mobile/features/job_execution/providers/job_execution_provider.dart';
import 'package:saha_flow_mobile/shared/widgets/loading_indicator.dart';

class ChecklistScreen extends ConsumerStatefulWidget {
  final String orderId;

  const ChecklistScreen({super.key, required this.orderId});

  @override
  ConsumerState<ChecklistScreen> createState() => _ChecklistScreenState();
}

class _ChecklistScreenState extends ConsumerState<ChecklistScreen> {
  @override
  Widget build(BuildContext context) {
    final state = ref.watch(jobExecutionProvider(widget.orderId));
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Kontrol Listesi'),
        actions: [
          Text(
            '${state.checklistItems.where((c) => c.isCompleted).length}/${state.checklistItems.length}',
            style: const TextStyle(fontSize: 16),
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: state.checklistItems.isEmpty
          ? const LoadingIndicator(message: 'Kontrol listesi yükleniyor...')
          : _buildChecklist(theme, state),
    );
  }

  Widget _buildChecklist(ThemeData theme, dynamic state) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                LinearProgressIndicator(
                  value: state.checklistItems.isEmpty
                      ? 0
                      : state.checklistItems
                              .where((c) => c.isCompleted)
                              .length /
                          state.checklistItems.length,
                  backgroundColor: AppColors.divider,
                  borderRadius: BorderRadius.circular(4),
                  minHeight: 8,
                ),
                const SizedBox(height: 16),
                Text(
                  'Tamamlanması gereken tüm adımları kontrol edin.',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: AppColors.onSurfaceSecondary,
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 8),
        ...List.generate(
          state.checklistItems.length,
          (index) {
            final item = state.checklistItems[index];
            return _buildChecklistItem(context, item, index);
          },
        ),
      ],
    );
  }

  Widget _buildChecklistItem(
    BuildContext context,
    ChecklistItem item,
    int index,
  ) {
    return Card(
      child: ListTile(
        leading: Checkbox(
          value: item.isCompleted,
          onChanged: (_) {
            ref
                .read(jobExecutionProvider(widget.orderId).notifier)
                .toggleChecklistItem(index);
          },
          activeColor: AppColors.success,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(4),
          ),
        ),
        title: Text(
          item.title,
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w500,
            decoration:
                item.isCompleted ? TextDecoration.lineThrough : null,
            color: item.isCompleted
                ? AppColors.disabled
                : AppColors.onSurface,
          ),
        ),
        subtitle: item.isRequired
            ? Text(
                'Zorunlu',
                style: TextStyle(
                  fontSize: 12,
                  color: AppColors.error.withOpacity(0.7),
                ),
              )
            : null,
        trailing: item.isCompleted
            ? const Icon(Icons.check_circle, color: AppColors.success)
            : const Icon(Icons.radio_button_unchecked,
                color: AppColors.divider),
      ),
    );
  }
}
