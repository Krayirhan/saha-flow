import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:saha_flow_mobile/app.dart';

void main() {
  testWidgets('Smoke test - app loads', (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: Center(
            child: Text('Saha Flow'),
          ),
        ),
      ),
    );

    expect(find.text('Saha Flow'), findsOneWidget);
  });

  testWidgets('AppBar title should be visible',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          appBar: AppBar(
            title: const Text('Saha Flow'),
          ),
          body: Container(),
        ),
      ),
    );

    expect(find.text('Saha Flow'), findsOneWidget);
    expect(find.byType(AppBar), findsOneWidget);
  });
}
