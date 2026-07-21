import 'package:flutter_test/flutter_test.dart';
import 'package:saha_flow_mobile/core/auth/token_storage.dart';
import 'package:saha_flow_mobile/core/constants/app_constants.dart';

void main() {
  late TokenStorage tokenStorage;

  setUp(() {
    tokenStorage = TokenStorage();
  });

  group('TokenStorage', () {
    test('saveTokens should store access and refresh tokens', () async {
      await tokenStorage.saveTokens(
        accessToken: 'test_access_token',
        refreshToken: 'test_refresh_token',
      );

      final accessToken = await tokenStorage.getAccessToken();
      final refreshToken = await tokenStorage.getRefreshToken();

      expect(accessToken, 'test_access_token');
      expect(refreshToken, 'test_refresh_token');
    });

    test('hasTokens should return true when tokens exist', () async {
      await tokenStorage.saveTokens(
        accessToken: 'test_access_token',
        refreshToken: 'test_refresh_token',
      );

      final hasTokens = await tokenStorage.hasTokens();
      expect(hasTokens, true);
    });

    test('hasTokens should return false when no tokens exist', () async {
      final hasTokens = await tokenStorage.hasTokens();
      expect(hasTokens, false);
    });

    test('getAccessToken should return null when not set', () async {
      final token = await tokenStorage.getAccessToken();
      expect(token, isNull);
    });

    test('clearAll should remove all tokens', () async {
      await tokenStorage.saveTokens(
        accessToken: 'test_access_token',
        refreshToken: 'test_refresh_token',
      );
      await tokenStorage.clearAll();

      final accessToken = await tokenStorage.getAccessToken();
      final refreshToken = await tokenStorage.getRefreshToken();

      expect(accessToken, isNull);
      expect(refreshToken, isNull);
    });

    test('saveUserId and getUserId should work correctly', () async {
      await tokenStorage.saveUserId('user_123');
      final userId = await tokenStorage.getUserId();
      expect(userId, 'user_123');
    });

    test('saveUserEmail and getUserEmail should work correctly', () async {
      await tokenStorage.saveUserEmail('test@example.com');
      final email = await tokenStorage.getUserEmail();
      expect(email, 'test@example.com');
    });

    test('getRefreshToken should return null when not set', () async {
      final token = await tokenStorage.getRefreshToken();
      expect(token, isNull);
    });
  });
}
