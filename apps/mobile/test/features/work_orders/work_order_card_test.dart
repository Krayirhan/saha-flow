import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:saha_flow_mobile/features/work_orders/domain/work_order.dart';
import 'package:saha_flow_mobile/features/work_orders/presentation/widgets/work_order_card.dart';

WorkOrder _createMockWorkOrder({
  String status = 'pending',
  String customerName = 'Ahmet Yılmaz',
  String address = 'Bağdat Caddesi No:123',
  String orderNumber = 'WO-2024-001',
}) {
  return WorkOrder(
    id: '1',
    orderNumber: orderNumber,
    customerName: customerName,
    customerPhone: '05551234567',
    address: address,
    city: 'İstanbul',
    district: 'Kadıköy',
    deviceType: 'Klima',
    deviceBrand: 'Arçelik',
    deviceModel: 'Pro 5000',
    issueDescription: 'Cihaz soğutmuyor, fan çalışmıyor.',
    status: status,
    scheduledDate: DateTime(2024, 6, 15, 10, 30),
    createdAt: DateTime(2024, 6, 14),
  );
}

void main() {
  group('WorkOrderCard', () {
    testWidgets('displays customer name and address',
        (WidgetTester tester) async {
      final order = _createMockWorkOrder();

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: WorkOrderCard(workOrder: order),
          ),
        ),
      );

      expect(find.text('Ahmet Yılmaz'), findsOneWidget);
      expect(find.textContaining('Bağdat Caddesi'), findsOneWidget);
      expect(find.textContaining('Kadıköy'), findsOneWidget);
      expect(find.text('WO-2024-001'), findsOneWidget);
    });

    testWidgets('displays correct status chip for pending',
        (WidgetTester tester) async {
      final order = _createMockWorkOrder(status: 'pending');

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: WorkOrderCard(workOrder: order),
          ),
        ),
      );

      expect(find.text('Bekliyor'), findsOneWidget);
    });

    testWidgets('displays correct status chip for in_progress',
        (WidgetTester tester) async {
      final order = _createMockWorkOrder(status: 'in_progress');

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: WorkOrderCard(workOrder: order),
          ),
        ),
      );

      expect(find.text('İşlemde'), findsOneWidget);
    });

    testWidgets('displays correct status chip for completed',
        (WidgetTester tester) async {
      final order = _createMockWorkOrder(status: 'completed');

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: WorkOrderCard(workOrder: order),
          ),
        ),
      );

      expect(find.text('Tamamlandı'), findsOneWidget);
    });

    testWidgets('displays device information',
        (WidgetTester tester) async {
      final order = _createMockWorkOrder();

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: WorkOrderCard(workOrder: order),
          ),
        ),
      );

      expect(find.textContaining('Klima'), findsOneWidget);
      expect(find.textContaining('Arçelik'), findsOneWidget);
    });

    testWidgets('onTap callback is triggered',
        (WidgetTester tester) async {
      bool tapped = false;
      final order = _createMockWorkOrder();

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: WorkOrderCard(
              workOrder: order,
              onTap: () => tapped = true,
            ),
          ),
        ),
      );

      await tester.tap(find.byType(WorkOrderCard));
      await tester.pumpAndSettle();

      expect(tapped, true);
    });
  });
}
