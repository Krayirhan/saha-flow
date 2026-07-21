import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:saha_flow_mobile/core/constants/app_constants.dart';

class TokenStorage {
  final FlutterSecureStorage _storage;

  TokenStorage({FlutterSecureStorage? storage})
      : _storage = storage ??
            const FlutterSecureStorage(
              aOptions: AndroidOptions(encryptedSharedPreferences: true),
              iOptions: IOSOptions(
                accessibility: KeychainAccessibility.first_unlock_this_device,
              ),
            );

  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    try {
      await Future.wait([
        _storage.write(key: AppConstants.accessTokenKey, value: accessToken),
        _storage.write(key: AppConstants.refreshTokenKey, value: refreshToken),
      ]);
    } catch (e) {
      throw Exception('Token kaydedilemedi: $e');
    }
  }

  Future<String?> getAccessToken() async {
    try {
      return await _storage.read(key: AppConstants.accessTokenKey);
    } catch (e) {
      return null;
    }
  }

  Future<String?> getRefreshToken() async {
    try {
      return await _storage.read(key: AppConstants.refreshTokenKey);
    } catch (e) {
      return null;
    }
  }

  Future<void> saveUserId(String userId) async {
    await _storage.write(key: AppConstants.userIdKey, value: userId);
  }

  Future<String?> getUserId() async {
    return await _storage.read(key: AppConstants.userIdKey);
  }

  Future<void> saveUserEmail(String email) async {
    await _storage.write(key: AppConstants.userEmailKey, value: email);
  }

  Future<String?> getUserEmail() async {
    return await _storage.read(key: AppConstants.userEmailKey);
  }

  Future<bool> hasTokens() async {
    final accessToken = await getAccessToken();
    return accessToken != null && accessToken.isNotEmpty;
  }

  Future<void> clearAll() async {
    try {
      await _storage.deleteAll();
    } catch (e) {
      throw Exception('Depolama temizlenemedi: $e');
    }
  }
}
