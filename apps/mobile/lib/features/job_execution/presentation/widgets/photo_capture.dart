import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:saha_flow_mobile/core/theme/app_colors.dart';

class PhotoCapture extends StatelessWidget {
  final List<String> photoPaths;
  final ValueChanged<String> onPhotoAdded;
  final ValueChanged<int> onPhotoRemoved;

  const PhotoCapture({
    super.key,
    required this.photoPaths,
    required this.onPhotoAdded,
    required this.onPhotoRemoved,
  });

  Future<void> _capturePhoto(BuildContext context) async {
    final picker = ImagePicker();

    final source = await showDialog<ImageSource>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Fotoğraf Ekle'),
        content: const Text('Fotoğraf kaynağını seçin'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, ImageSource.gallery),
            child: const Text('Galeri'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, ImageSource.camera),
            child: const Text('Kamera'),
          ),
        ],
      ),
    );

    if (source == null) return;

    try {
      final xFile = await picker.pickImage(
        source: source,
        imageQuality: 80,
        maxWidth: 1920,
        maxHeight: 1080,
      );

      if (xFile != null) {
        onPhotoAdded(xFile.path);
      }
    } catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Fotoğraf alınamadı: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Fotoğraflar (${photoPaths.length})',
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 110,
          child: ListView(
            scrollDirection: Axis.horizontal,
            children: [
              ...photoPaths.asMap().entries.map((entry) {
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: Stack(
                    children: [
                      Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: AppColors.divider),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.network(
                            entry.value,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => const Icon(
                              Icons.image,
                              size: 40,
                              color: AppColors.disabled,
                            ),
                          ),
                        ),
                      ),
                      Positioned(
                        top: 2,
                        right: 2,
                        child: GestureDetector(
                          onTap: () => onPhotoRemoved(entry.key),
                          child: Container(
                            padding: const EdgeInsets.all(4),
                            decoration: const BoxDecoration(
                              color: Colors.black54,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.close,
                              size: 16,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              }),
              GestureDetector(
                onTap: () => _capturePhoto(context),
                child: Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: AppColors.primary,
                      style: BorderStyle.solid,
                      width: 2,
                    ),
                  ),
                  child: const Icon(
                    Icons.add_a_photo,
                    size: 32,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
