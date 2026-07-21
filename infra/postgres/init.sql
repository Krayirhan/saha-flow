-- ============================================================
-- Saha Flow - Database Initialization Script
-- ============================================================
-- This script runs automatically on first container startup
-- for development environments ONLY.
-- Production databases should be managed via Flyway migrations.
-- ============================================================

-- Enable UUID generation (for primary keys across the system)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for geospatial queries (field/court locations)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Set default timezone for the session to Europe/Istanbul
SET timezone = 'Europe/Istanbul';

-- ============================================================
-- NOTE: Table creation is handled by Flyway migrations.
-- Do not add CREATE TABLE statements here.
-- See: services/api/src/main/resources/db/migration/
-- ============================================================
