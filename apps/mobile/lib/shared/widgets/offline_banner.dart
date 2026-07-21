import 'dart:async';

import 'package:flutter/material.dart';
import 'package:saha_flow_mobile/core/network/connectivity_service.dart';
import 'package:saha_flow_mobile/core/theme/app_colors.dart';

class OfflineBanner extends StatefulWidget {
  final ConnectivityService connectivityService;

  const OfflineBanner({
    super.key,
    required this.connectivityService,
  });

  @override
  State<OfflineBanner> createState() => _OfflineBannerState();
}

class _OfflineBannerState extends State<OfflineBanner>
    with SingleTickerProviderStateMixin {
  bool _isOffline = false;
  late AnimationController _animationController;
  StreamSubscription<bool>? _connectivitySub;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );

    _connectivitySub =
        widget.connectivityService.connectivityStream.listen((connected) {
      if (!mounted) return;
      setState(() {
        _isOffline = !connected;
      });
      if (!connected) {
        _animationController.forward();
      } else {
        _animationController.reverse();
      }
    });

    widget.connectivityService.isConnected().then((connected) {
      if (!mounted) return;
      setState(() {
        _isOffline = !connected;
      });
    });
  }

  @override
  void dispose() {
    _connectivitySub?.cancel();
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animationController,
      builder: (context, child) {
        return SizeTransition(
          sizeFactor: _animationController,
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: AppColors.offlineBanner,
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.wifi_off,
                  color: Colors.white,
                  size: 18,
                ),
                SizedBox(width: 8),
                Text(
                  'Çevrimdışı moddasınız',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class AnimatedBuilder extends AnimatedWidget {
  final Widget Function(BuildContext context, Widget? child) builder;

  const AnimatedBuilder({
    super.key,
    required super.listenable,
    required this.builder,
  });

  @override
  Widget build(BuildContext context) {
    return builder(context, null);
  }
}
