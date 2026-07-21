import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:saha_flow_mobile/features/login/presentation/widgets/login_form.dart';

void main() {
  testWidgets('LoginForm renders email and password fields',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: LoginForm(),
          ),
        ),
      ),
    );

    expect(find.text('E-posta'), findsOneWidget);
    expect(find.text('Şifre'), findsOneWidget);
    expect(find.text('Giriş Yap'), findsOneWidget);
  });

  testWidgets('LoginForm validates empty email',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: LoginForm(),
          ),
        ),
      ),
    );

    await tester.tap(find.text('Giriş Yap'));
    await tester.pumpAndSettle();

    expect(find.text('E-posta adresi zorunludur.'), findsOneWidget);
  });

  testWidgets('LoginForm validates invalid email format',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: LoginForm(),
          ),
        ),
      ),
    );

    await tester.enterText(find.byType(TextFormField).first, 'invalid-email');
    await tester.tap(find.text('Giriş Yap'));
    await tester.pumpAndSettle();

    expect(find.text('Geçerli bir e-posta adresi giriniz.'), findsOneWidget);
  });

  testWidgets('LoginForm validates short password',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: LoginForm(),
          ),
        ),
      ),
    );

    await tester.enterText(
        find.byType(TextFormField).first, 'test@example.com');
    await tester.enterText(find.byType(TextFormField).last, '123');
    await tester.tap(find.text('Giriş Yap'));
    await tester.pumpAndSettle();

    expect(find.text('Şifre en az 6 karakter olmalıdır.'), findsOneWidget);
  });

  testWidgets('Password visibility toggle works',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: LoginForm(),
          ),
        ),
      ),
    );

    final visibilityButton =
        find.byIcon(Icons.visibility_off);
    expect(visibilityButton, findsOneWidget);

    await tester.tap(visibilityButton);
    await tester.pumpAndSettle();

    expect(find.byIcon(Icons.visibility), findsOneWidget);
  });
}
