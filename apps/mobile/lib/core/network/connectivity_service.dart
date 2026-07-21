import 'dart:async';

import 'package:connectivity_plus/connectivity_plus.dart';

class ConnectivityService {
  final Connectivity _connectivity;
  final StreamController<bool> _connectivityController =
      StreamController<bool>.broadcast();

  Stream<bool> get connectivityStream => _connectivityController.stream;
  bool _isConnected = true;

  ConnectivityService({Connectivity? connectivity})
      : _connectivity = connectivity ?? Connectivity() {
    _init();
  }

  void _init() {
    _connectivity.onConnectivityChanged.listen((results) {
      final connected = results.any(
        (r) =>
            r == ConnectivityResult.mobile ||
            r == ConnectivityResult.wifi ||
            r == ConnectivityResult.ethernet,
      );
      _isConnected = connected;
      _connectivityController.add(connected);
    });
  }

  Future<bool> isConnected() async {
    try {
      final results = await _connectivity.checkConnectivity();
      _isConnected = results.any(
        (r) =>
            r == ConnectivityResult.mobile ||
            r == ConnectivityResult.wifi ||
            r == ConnectivityResult.ethernet,
      );
      return _isConnected;
    } catch (_) {
      return _isConnected;
    }
  }

  void dispose() {
    _connectivityController.close();
  }
}
