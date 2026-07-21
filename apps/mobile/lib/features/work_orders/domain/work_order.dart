import 'package:equatable/equatable.dart';

class WorkOrder extends Equatable {
  final String id;
  final String orderNumber;
  final String customerName;
  final String customerPhone;
  final String address;
  final String city;
  final String district;
  final double? latitude;
  final double? longitude;
  final String deviceType;
  final String deviceBrand;
  final String deviceModel;
  final String issueDescription;
  final String status;
  final DateTime? scheduledDate;
  final DateTime? startTime;
  final DateTime? endTime;
  final String? technicianNote;
  final List<String> photoUrls;
  final DateTime createdAt;

  const WorkOrder({
    required this.id,
    required this.orderNumber,
    required this.customerName,
    this.customerPhone = '',
    required this.address,
    this.city = '',
    this.district = '',
    this.latitude,
    this.longitude,
    required this.deviceType,
    this.deviceBrand = '',
    this.deviceModel = '',
    required this.issueDescription,
    required this.status,
    this.scheduledDate,
    this.startTime,
    this.endTime,
    this.technicianNote,
    this.photoUrls = const [],
    required this.createdAt,
  });

  @override
  List<Object?> get props => [
        id,
        orderNumber,
        customerName,
        status,
        createdAt,
      ];

  WorkOrder copyWith({
    String? status,
    DateTime? startTime,
    DateTime? endTime,
    String? technicianNote,
    List<String>? photoUrls,
  }) {
    return WorkOrder(
      id: id,
      orderNumber: orderNumber,
      customerName: customerName,
      customerPhone: customerPhone,
      address: address,
      city: city,
      district: district,
      latitude: latitude,
      longitude: longitude,
      deviceType: deviceType,
      deviceBrand: deviceBrand,
      deviceModel: deviceModel,
      issueDescription: issueDescription,
      status: status ?? this.status,
      scheduledDate: scheduledDate,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      technicianNote: technicianNote,
      photoUrls: photoUrls ?? this.photoUrls,
      createdAt: createdAt,
    );
  }

  String get statusLabel {
    switch (status) {
      case 'pending':
        return 'Bekliyor';
      case 'in_progress':
        return 'İşlemde';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal';
      default:
        return status;
    }
  }

  bool get canStart => status == 'pending';
  bool get canComplete => status == 'in_progress';
}
