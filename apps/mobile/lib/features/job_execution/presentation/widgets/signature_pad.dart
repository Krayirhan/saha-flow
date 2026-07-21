import 'dart:io';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:path_provider/path_provider.dart';
import 'package:saha_flow_mobile/core/theme/app_colors.dart';

class SignaturePad extends StatefulWidget {
  final void Function(String path) onSaved;
  final String? existingPath;

  const SignaturePad({
    super.key,
    required this.onSaved,
    this.existingPath,
  });

  @override
  State<SignaturePad> createState() => _SignaturePadState();
}

class _SignaturePadState extends State<SignaturePad> {
  final GlobalKey _repaintKey = GlobalKey();
  final List<Offset> _points = [];
  bool _hasDrawn = false;

  void _onPanStart(DragStartDetails details) {
    setState(() {
      _points.clear();
      _points.add(details.localPosition);
      _hasDrawn = true;
    });
  }

  void _onPanUpdate(DragUpdateDetails details) {
    setState(() {
      final position = details.localPosition;
      _points.add(position.clamp(
        Offset.zero & (context.size ?? const Size(400, 200)),
      ));
    });
  }

  void _onPanEnd(DragEndDetails details) async {
    if (!_hasDrawn) return;

    final boundary = _repaintKey.currentContext?.findRenderObject()
        as RenderRepaintBoundary?;
    if (boundary == null) return;

    final image = await boundary.toImage(pixelRatio: 3.0);
    final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
    if (byteData == null) return;

    final dir = await getTemporaryDirectory();
    final path =
        '${dir.path}/signature_${DateTime.now().millisecondsSinceEpoch}.png';
    await File(path).writeAsBytes(byteData.buffer.asUint8List());
    widget.onSaved(path);
  }

  void _clear() {
    setState(() {
      _points.clear();
      _hasDrawn = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Müşteri İmzası',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            if (_hasDrawn)
              TextButton.icon(
                onPressed: _clear,
                icon: const Icon(Icons.clear, size: 18),
                label: const Text('Temizle'),
              ),
          ],
        ),
        const SizedBox(height: 8),
        Container(
          height: 200,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: AppColors.divider),
            color: Colors.white,
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: GestureDetector(
              onPanStart: _onPanStart,
              onPanUpdate: _onPanUpdate,
              onPanEnd: _onPanEnd,
              child: RepaintBoundary(
                key: _repaintKey,
                child: CustomPaint(
                  painter: _SignaturePainter(
                    points: _points,
                    color: AppColors.onSurface,
                    strokeWidth: 2.5,
                  ),
                  size: Size.infinite,
                ),
              ),
            ),
          ),
        ),
        if (_hasDrawn)
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Text(
              'İmza kaydedildi.',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.success,
                  ),
            ),
          ),
      ],
    );
  }
}

class _SignaturePainter extends CustomPainter {
  final List<Offset> points;
  final Color color;
  final double strokeWidth;

  const _SignaturePainter({
    required this.points,
    required this.color,
    required this.strokeWidth,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (points.isEmpty) return;

    final paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    for (int i = 0; i < points.length - 1; i++) {
      canvas.drawLine(points[i], points[i + 1], paint);
    }
  }

  @override
  bool shouldRepaint(covariant _SignaturePainter oldDelegate) {
    return oldDelegate.points != points;
  }
}
