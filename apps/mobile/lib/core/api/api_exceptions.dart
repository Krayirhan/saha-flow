class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final dynamic data;

  const ApiException({
    required this.message,
    this.statusCode,
    this.data,
  });

  @override
  String toString() => 'ApiException: $message (status: $statusCode)';

  factory ApiException.fromDioError(dynamic error) {
    if (error.response != null) {
      final statusCode = error.response!.statusCode as int?;
      final data = error.response!.data;
      String message;

      switch (statusCode) {
        case 400:
          message = _extractMessage(data) ?? 'Geçersiz istek';
          break;
        case 401:
          message = 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.';
          break;
        case 403:
          message = 'Bu işlem için yetkiniz yok.';
          break;
        case 404:
          message = 'Kayıt bulunamadı.';
          break;
        case 409:
          message = _extractMessage(data) ?? 'Çakışma oluştu.';
          break;
        case 422:
          message = _extractMessage(data) ?? 'Doğrulama hatası.';
          break;
        case 500:
          message = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
          break;
        default:
          message = _extractMessage(data) ?? 'Beklenmeyen bir hata oluştu.';
      }

      return ApiException(
        message: message,
        statusCode: statusCode,
        data: data,
      );
    }

    switch (error.type.name) {
      case 'connectionTimeout':
        return const ApiException(
          message: 'Bağlantı zaman aşımına uğradı. Lütfen tekrar deneyin.',
        );
      case 'sendTimeout':
        return const ApiException(
          message: 'İstek gönderme zaman aşımına uğradı.',
        );
      case 'receiveTimeout':
        return const ApiException(
          message: 'Sunucu yanıt vermedi. Lütfen tekrar deneyin.',
        );
      case 'connectionError':
        return const ApiException(
          message: 'İnternet bağlantısı yok. Çevrimdışı modda çalışılıyor.',
        );
      case 'cancel':
        return const ApiException(message: 'İstek iptal edildi.');
      default:
        return ApiException(
          message: error.message?.toString() ?? 'Bilinmeyen bir hata oluştu.',
        );
    }
  }

  static String? _extractMessage(dynamic data) {
    if (data == null) return null;
    if (data is Map) {
      return (data['message'] ?? data['error'] ?? data['detail']) as String?;
    }
    return null;
  }

  bool get isUnauthorized => statusCode == 401;
  bool get isConflict => statusCode == 409;
  bool get isConnectionError =>
      message.contains('bağlantısı yok') || message.contains('connection');
}
