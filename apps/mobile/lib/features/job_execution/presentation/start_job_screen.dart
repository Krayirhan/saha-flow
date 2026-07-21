import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:saha_flow_mobile/core/utils/permissions.dart';
import 'package:saha_flow_mobile/features/job_execution/providers/job_execution_provider.dart';
import 'package:saha_flow_mobile/features/work_orders/providers/work_order_detail_provider.dart';
import 'package:saha_flow_mobile/shared/widgets/loading_indicator.dart';

class StartJobScreen extends ConsumerStatefulWidget {
  final String orderId;

  const StartJobScreen({super.key, required this.orderId});

  @override
  ConsumerState<StartJobScreen> createState() => _StartJobScreenState();
}

class _StartJobScreenState extends ConsumerState<StartJobScreen> {
  bool _isLoading = false;

  Future<void> _startJob() async {
    setState(() => _isLoading = true);

    try {
      final position = await PermissionService.getCurrentPosition();

      if (position == null) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Konum alınamadı. Lütfen konum iznini kontrol edin.'),
            backgroundColor: Colors.red,
          ),
        );
        setState(() => _isLoading = false);
        return;
      }

      final notifier = ref.read(jobExecutionProvider(widget.orderId).notifier);
      notifier.setLocation(position.latitude, position.longitude);

      final detailNotifier = ref
          .read(workOrderDetailProvider(widget.orderId).notifier);
      final success = await detailNotifier.startWorkOrder(
        position.latitude,
        position.longitude,
      );

      if (success) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('İş başlatıldı.'),
            backgroundColor: Colors.green,
          ),
        );
        // Navigate to checklist
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Hata: $e'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('İşe Başla'),
      ),
      body: _isLoading
          ? const LoadingIndicator(message: 'Konum alınıyor...')
          : Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.play_circle_outline,
                    size: 80,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'İşe Başlamak İçin Hazır mısınız?',
                    style: theme.textTheme.headlineMedium,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'İşe başladığınızda konumunuz kaydedilecek ve iş emri durumu güncellenecektir.',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.onSurface.withOpacity(0.6),
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 48),
                  ElevatedButton.icon(
                    onPressed: _startJob,
                    icon: const Icon(Icons.play_arrow),
                    label: const Text('İşe Başla'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      textStyle: const TextStyle(fontSize: 18),
                    ),
                  ),
                ],
              ),
            ),
    );
  }

}
