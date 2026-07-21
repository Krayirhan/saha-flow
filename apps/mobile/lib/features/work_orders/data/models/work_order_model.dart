import 'package:json_annotation/json_annotation.dart';
import 'package:saha_flow_mobile/features/work_orders/domain/work_order.dart';

part 'work_order_model.g.dart';

@JsonSerializable()
class WorkOrderModel {
  final String id;
  @JsonKey(name: 'order_number')
  final String orderNumber;
  @JsonKey(name: 'customer_name')
  final String customerName;
  @JsonKey(name: 'customer_phone')
  final String customerPhone;
  final String address;
  final String city;
  final String district;
  final double? latitude;
  final double? longitude;
  @JsonKey(name: 'device_type')
  final String deviceType;
  @JsonKey(name: 'device_brand')
  final String deviceBrand;
  @JsonKey(name: 'device_model')
  final String deviceModel;
  @JsonKey(name: 'issue_description')
  final String issueDescription;
  final String status;
  @JsonKey(name: 'scheduled_date')
  final String? scheduledDate;
  @JsonKey(name: 'start_time')
  final String? startTime;
  @JsonKey(name: 'end_time')
  final String? endTime;
  @JsonKey(name: 'technician_note')
  final String? technicianNote;
  @JsonKey(name: 'photo_urls')
  final List<String> photoUrls;
  @JsonKey(name: 'created_at')
  final String createdAt;

  const WorkOrderModel({
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

  factory WorkOrderModel.fromJson(Map<String, dynamic> json) =>
      _$WorkOrderModelFromJson(json);

  Map<String, dynamic> toJson() => _$WorkOrderModelToJson(this);

  WorkOrder toDomain() {
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
      status: status,
      scheduledDate:
          scheduledDate != null ? DateTime.tryParse(scheduledDate!) : null,
      startTime: startTime != null ? DateTime.tryParse(startTime!) : null,
      endTime: endTime != null ? DateTime.tryParse(endTime!) : null,
      technicianNote: technicianNote,
      photoUrls: photoUrls,
      createdAt: DateTime.parse(createdAt),
    );
  }

  factory WorkOrderModel.fromDomain(WorkOrder domain) {
    return WorkOrderModel(
      id: domain.id,
      orderNumber: domain.orderNumber,
      customerName: domain.customerName,
      customerPhone: domain.customerPhone,
      address: domain.address,
      city: domain.city,
      district: domain.district,
      latitude: domain.latitude,
      longitude: domain.longitude,
      deviceType: domain.deviceType,
      deviceBrand: domain.deviceBrand,
      deviceModel: domain.deviceModel,
      issueDescription: domain.issueDescription,
      status: domain.status,
      scheduledDate: domain.scheduledDate?.toIso8601String(),
      startTime: domain.startTime?.toIso8601String(),
      endTime: domain.endTime?.toIso8601String(),
      technicianNote: domain.technicianNote,
      photoUrls: domain.photoUrls,
      createdAt: domain.createdAt.toIso8601String(),
    );
  }
}
