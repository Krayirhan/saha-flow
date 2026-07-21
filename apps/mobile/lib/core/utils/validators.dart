class Validators {
  Validators._();

  static String? required(String? value, [String fieldName = 'Bu alan']) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName zorunludur.';
    }
    return null;
  }

  static String? email(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'E-posta adresi zorunludur.';
    }
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );
    if (!emailRegex.hasMatch(value.trim())) {
      return 'Geçerli bir e-posta adresi giriniz.';
    }
    return null;
  }

  static String? password(String? value) {
    if (value == null || value.isEmpty) {
      return 'Şifre zorunludur.';
    }
    if (value.length < 6) {
      return 'Şifre en az 6 karakter olmalıdır.';
    }
    return null;
  }

  static String? phone(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Telefon numarası zorunludur.';
    }
    final phoneRegex = RegExp(r'^[0-9]{10,15}$');
    final cleaned = value.replaceAll(RegExp(r'\D'), '');
    if (!phoneRegex.hasMatch(cleaned)) {
      return 'Geçerli bir telefon numarası giriniz.';
    }
    return null;
  }

  static String? minLength(
    String? value,
    int min, [
    String fieldName = 'Bu alan',
  ]) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName zorunludur.';
    }
    if (value.trim().length < min) {
      return '$fieldName en az $min karakter olmalıdır.';
    }
    return null;
  }

  static String? maxLength(
    String? value,
    int max, [
    String fieldName = 'Bu alan',
  ]) {
    if (value == null || value.trim().isEmpty) return null;
    if (value.trim().length > max) {
      return '$fieldName en fazla $max karakter olmalıdır.';
    }
    return null;
  }

  static String? combine(
    String? value,
    List<String? Function(String?)> validators,
  ) {
    for (final validator in validators) {
      final result = validator(value);
      if (result != null) return result;
    }
    return null;
  }
}
