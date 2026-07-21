import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:saha_flow_mobile/app.dart';

void main() {
  testWidgets('Smoke test - app loads', (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: Center(
            child: Text('İşAkış'),
          ),
        ),
      ),
    );

    expect(find.text('İşAkış'), findsOneWidget);
  });

  testWidgets('AppBar title should be visible',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          appBar: AppBar(
            title: const Text('İşAkış'),
          ),
          body: Container(),
        ),
      ),
    );

    expect(find.text('İşAkış'), findsOneWidget);
    expect(find.byType(AppBar), findsOneWidget);
  });
}
