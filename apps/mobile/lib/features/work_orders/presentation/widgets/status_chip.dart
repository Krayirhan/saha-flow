import 'package:flutter/material.dart';
import 'package:saha_flow_mobile/core/theme/app_colors.dart';

class StatusChip extends StatelessWidget {
  final String status;
  final double fontSize;
  final EdgeInsets padding;

  const StatusChip({
    super.key,
    required this.status,
    this.fontSize = 12,
    this.padding = const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: _getBackgroundColor().withOpacity(0.15),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: _getBackgroundColor().withOpacity(0.5),
          width: 1,
        ),
      ),
      child: Text(
        _getLabel(),
        style: TextStyle(
          color: _getBackgroundColor(),
          fontSize: fontSize,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Color _getBackgroundColor() {
    switch (status) {
      case 'pending':
        return AppColors.statusPending;
      case 'in_progress':
        return AppColors.statusInProgress;
      case 'completed':
        return AppColors.statusCompleted;
      case 'cancelled':
        return AppColors.statusCancelled;
      default:
        return AppColors.disabled;
    }
  }

  String _getLabel() {
    switch (status) {
      case 'pending':
        return 'Bekliyor';
      case 'in_progress':
        return 'İşlemde';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal';
      default:
        return status;
    }
  }
}
