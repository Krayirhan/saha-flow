import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Primary
  static const Color primary = Color(0xFF1565C0);
  static const Color primaryLight = Color(0xFF42A5F5);
  static const Color primaryDark = Color(0xFF0D47A1);

  // Accent
  static const Color accent = Color(0xFFFF6F00);
  static const Color accentLight = Color(0xFFFFA040);

  // Status
  static const Color success = Color(0xFF2E7D32);
  static const Color successLight = Color(0xFFC8E6C9);
  static const Color warning = Color(0xFFF57F17);
  static const Color warningLight = Color(0xFFFFF9C4);
  static const Color error = Color(0xFFC62828);
  static const Color errorLight = Color(0xFFFFCDD2);
  static const Color info = Color(0xFF0277BD);
  static const Color infoLight = Color(0xFFB3E5FC);

  // Work order status
  static const Color statusPending = Color(0xFFF57F17);
  static const Color statusInProgress = Color(0xFF0277BD);
  static const Color statusCompleted = Color(0xFF2E7D32);
  static const Color statusCancelled = Color(0xFF757575);

  // Neutral
  static const Color background = Color(0xFFF5F5F5);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color onSurface = Color(0xFF212121);
  static const Color onSurfaceSecondary = Color(0xFF757575);
  static const Color divider = Color(0xFFBDBDBD);
  static const Color disabled = Color(0xFF9E9E9E);

  // Offline banner
  static const Color offlineBanner = Color(0xFFFF6F00);
  static const Color syncIndicator = Color(0xFF0277BD);
}
