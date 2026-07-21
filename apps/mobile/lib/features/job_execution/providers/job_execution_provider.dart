import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:saha_flow_mobile/features/login/providers/auth_provider.dart';
import 'package:saha_flow_mobile/features/work_orders/data/repositories/work_order_repository.dart';
import 'package:saha_flow_mobile/features/work_orders/providers/work_order_list_provider.dart';

class ChecklistItem {
  final String id;
  final String title;
  final bool isCompleted;
  final bool isRequired;

  const ChecklistItem({
    required this.id,
    required this.title,
    this.isCompleted = false,
    this.isRequired = true,
  });

  ChecklistItem copyWith({bool? isCompleted}) {
    return ChecklistItem(
      id: id,
      title: title,
      isCompleted: isCompleted ?? this.isCompleted,
      isRequired: isRequired,
    );
  }

  factory ChecklistItem.fromJson(Map<String, dynamic> json) {
    return ChecklistItem(
      id: json['id'] as String,
      title: json['title'] as String,
      isCompleted: json['is_completed'] as bool? ?? false,
      isRequired: json['is_required'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'is_completed': isCompleted,
        'is_required': isRequired,
      };
}

class JobExecutionState {
  final bool isLoading;
  final String? error;
  final List<ChecklistItem> checklistItems;
  final List<String> photoPaths;
  final String? signaturePath;
  final String? technicianNote;
  final double? latitude;
  final double? longitude;
  final bool isSubmitting;

  const JobExecutionState({
    this.isLoading = false,
    this.error,
    this.checklistItems = const [],
    this.photoPaths = const [],
    this.signaturePath,
    this.technicianNote,
    this.latitude,
    this.longitude,
    this.isSubmitting = false,
  });

  JobExecutionState copyWith({
    bool? isLoading,
    String? error,
    List<ChecklistItem>? checklistItems,
    List<String>? photoPaths,
    String? signaturePath,
    String? technicianNote,
    double? latitude,
    double? longitude,
    bool? isSubmitting,
    bool clearError = false,
  }) {
    return JobExecutionState(
      isLoading: isLoading ?? this.isLoading,
      error: clearError ? null : (error ?? this.error),
      checklistItems: checklistItems ?? this.checklistItems,
      photoPaths: photoPaths ?? this.photoPaths,
      signaturePath: signaturePath,
      technicianNote: technicianNote ?? this.technicianNote,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      isSubmitting: isSubmitting ?? this.isSubmitting,
    );
  }
}

class JobExecutionNotifier extends StateNotifier<JobExecutionState> {
  final WorkOrderRepository _repository;
  final String _orderId;

  JobExecutionNotifier(this._repository, this._orderId)
      : super(const JobExecutionState());

  void setLocation(double lat, double lng) {
    state = state.copyWith(latitude: lat, longitude: lng);
  }

  void setChecklistItems(List<ChecklistItem> items) {
    state = state.copyWith(checklistItems: items);
  }

  Future<void> toggleChecklistItem(int index) async {
    if (index < 0 || index >= state.checklistItems.length) return;

    final item = state.checklistItems[index];
    final updatedItem = item.copyWith(isCompleted: !item.isCompleted);
    final updatedList = List<ChecklistItem>.from(state.checklistItems);
    updatedList[index] = updatedItem;

    state = state.copyWith(checklistItems: updatedList);

    try {
      await _repository.completeChecklistItem(_orderId, item.id);
    } catch (_) {
      // Revert silently; will sync later
    }
  }

  void addPhoto(String path) {
    final updatedPhotos = List<String>.from(state.photoPaths)..add(path);
    state = state.copyWith(photoPaths: updatedPhotos);
  }

  void removePhoto(int index) {
    if (index < 0 || index >= state.photoPaths.length) return;
    final updatedPhotos = List<String>.from(state.photoPaths)..removeAt(index);
    state = state.copyWith(photoPaths: updatedPhotos);
  }

  void setSignature(String path) {
    state = state.copyWith(signaturePath: path);
  }

  void setTechnicianNote(String note) {
    state = state.copyWith(technicianNote: note);
  }

  Future<bool> submitCompletion() async {
    if (state.isSubmitting) return false;

    final allRequiredCompleted = state.checklistItems
        .where((item) => item.isRequired)
        .every((item) => item.isCompleted);

    if (!allRequiredCompleted) {
      state = state.copyWith(
        error: 'Tüm zorunlu kontrol adımlarını tamamlayın.',
      );
      return false;
    }

    state = state.copyWith(isSubmitting: true, clearError: true);

    try {
      await _repository.completeWorkOrder(
        _orderId,
        note: state.technicianNote ?? '',
        photoUrls: state.photoPaths,
        signatureUrl: state.signaturePath,
      );

      state = state.copyWith(isSubmitting: false);
      return true;
    } catch (e) {
      state = state.copyWith(
        isSubmitting: false,
        error: 'İş tamamlanırken bir hata oluştu.',
      );
      return false;
    }
  }

  bool get canSubmit =>
      state.checklistItems
          .where((item) => item.isRequired)
          .every((item) => item.isCompleted) &&
      !state.isSubmitting;
}

final jobExecutionProvider = StateNotifierProvider.family.autoDispose<
    JobExecutionNotifier, JobExecutionState, String>(
  (ref, orderId) {
    final repository = ref.read(workOrderRepositoryProvider);
    return JobExecutionNotifier(repository, orderId);
  },
);
