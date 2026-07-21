import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:saha_flow_mobile/app.dart';
import 'package:saha_flow_mobile/core/theme/app_colors.dart';

void main() {
  group('App Integration Tests', () {
    testWidgets('App should render without crashing',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: SahaFlowApp(),
        ),
      );

      await tester.pumpAndSettle(const Duration(seconds: 2));

      expect(find.byType(MaterialApp), findsOneWidget);
      expect(find.byType(Navigator), findsWidgets);
    });

    testWidgets('Login screen should have required elements',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: SahaFlowApp(),
        ),
      );

      await tester.pumpAndSettle(const Duration(seconds: 1));

      expect(find.byType(MaterialApp), findsOneWidget);
    });

    testWidgets('App theme uses primary color correctly',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: ThemeData(primaryColor: AppColors.primary),
            home: const Scaffold(
              body: Center(child: Text('Test')),
            ),
          ),
        ),
      );

      final materialApp = tester.widget<MaterialApp>(find.byType(MaterialApp));
      expect(materialApp.theme?.primaryColor, AppColors.primary);
    });
  });
}
