import 'package:intl/intl.dart';
import 'package:saha_flow_mobile/core/constants/app_constants.dart';

class DateFormatter {
  DateFormatter._();

  static final _dateFormat = DateFormat(AppConstants.dateFormatDisplay, 'tr');
  static final _timeFormat = DateFormat(AppConstants.timeFormatDisplay, 'tr');
  static final _dateTimeFormat =
      DateFormat(AppConstants.dateTimeFormatDisplay, 'tr');
  static final _apiDateFormat = DateFormat('yyyy-MM-dd');
  static final _apiDateTimeFormat =
      DateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");

  static String formatDate(DateTime date) {
    return _dateFormat.format(date);
  }

  static String formatTime(DateTime date) {
    return _timeFormat.format(date);
  }

  static String formatDateTime(DateTime date) {
    return _dateTimeFormat.format(date);
  }

  static String formatRelative(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);

    if (diff.inMinutes < 1) return 'Az önce';
    if (diff.inMinutes < 60) return '${diff.inMinutes} dk önce';
    if (diff.inHours < 24) return '${diff.inHours} saat önce';
    if (diff.inDays < 7) return '${diff.inDays} gün önce';
    return formatDate(date);
  }

  static String formatTimeRange(DateTime start, DateTime end) {
    return '${formatTime(start)} - ${formatTime(end)}';
  }

  static String toApiDate(DateTime date) {
    return _apiDateFormat.format(date);
  }

  static String toApiDateTime(DateTime date) {
    return _apiDateTimeFormat.format(date);
  }

  static DateTime? parseApiDateTime(String? dateTimeStr) {
    if (dateTimeStr == null) return null;
    try {
      return DateTime.parse(dateTimeStr);
    } catch (_) {
      return null;
    }
  }

  static DateTime dateOnly(DateTime date) {
    return DateTime(date.year, date.month, date.day);
  }

  static bool isToday(DateTime date) {
    final today = dateOnly(DateTime.now());
    final compareDate = dateOnly(date);
    return today == compareDate;
  }

  static bool isTomorrow(DateTime date) {
    final tomorrow = dateOnly(DateTime.now().add(const Duration(days: 1)));
    final compareDate = dateOnly(date);
    return tomorrow == compareDate;
  }
}
