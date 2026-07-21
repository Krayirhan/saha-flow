import 'dart:async';

import 'package:path_provider/path_provider.dart';
import 'package:sembast/sembast.dart';
import 'package:sembast/sembast_io.dart';
import 'package:saha_flow_mobile/core/constants/app_constants.dart';

class LocalDatabase {
  Database? _database;
  final Map<String, StoreRef<String, Map<String, dynamic>>> _stores = {};

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _openDatabase();
    return _database!;
  }

  Future<Database> _openDatabase() async {
    final appDir = await getApplicationDocumentsDirectory();
    final dbPath =
        '${appDir.path}${appDir.path.endsWith('/') ? '' : '/'}${AppConstants.localDbName}';
    final db = await databaseFactoryIo.openDatabase(dbPath);
    return db;
  }

  StoreRef<String, Map<String, dynamic>> _getStore(String storeName) {
    if (!_stores.containsKey(storeName)) {
      _stores[storeName] = StoreRef<String, Map<String, dynamic>>(storeName);
    }
    return _stores[storeName]!;
  }

  Future<void> put(
    String storeName,
    String key,
    Map<String, dynamic> value,
  ) async {
    final db = await database;
    final store = _getStore(storeName);
    await store.record(key).put(db, value);
  }

  Future<Map<String, dynamic>?> get(
    String storeName,
    String key,
  ) async {
    final db = await database;
    final store = _getStore(storeName);
    return store.record(key).get(db);
  }

  Future<List<RecordSnapshot<String, Map<String, dynamic>>>> getAll(
    String storeName, {
    int? limit,
    int? offset,
    List<Filter>? filters,
  }) async {
    final db = await database;
    final store = _getStore(storeName);

    var finder = Finder(
      sortOrders: [SortOrder('createdAt', false)],
      offset: offset ?? 0,
    );

    if (limit != null) {
      finder = Finder(
        sortOrders: [SortOrder('createdAt', false)],
        offset: offset ?? 0,
        limit: limit,
      );
    }

    if (filters != null && filters.isNotEmpty) {
      final filter = filters.reduce((a, b) => Filter.and([a, b]));
      finder = Finder(filter: filter, sortOrders: finder.sortOrders);
    }

    return store.find(db, finder: finder);
  }

  Future<void> delete(String storeName, String key) async {
    final db = await database;
    final store = _getStore(storeName);
    await store.record(key).delete(db);
  }

  Future<void> deleteAll(String storeName) async {
    final db = await database;
    final store = _getStore(storeName);
    await store.delete(db);
  }

  Future<int> count(String storeName) async {
    final db = await database;
    final store = _getStore(storeName);
    return store.count(db);
  }

  Future<void> clearAll() async {
    final db = await database;
    for (final store in _stores.values) {
      await store.delete(db);
    }
  }

  Future<void> close() async {
    if (_database != null) {
      await _database!.close();
      _database = null;
      _stores.clear();
    }
  }
}
