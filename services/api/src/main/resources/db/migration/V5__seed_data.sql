-- V5__seed_data.sql
-- SEED DEFAULT ROLES, PERMISSIONS, AND ADMIN USER

-- PERMISSIONS
INSERT INTO permission (id, name, display_name, resource_type, action) VALUES
    ('perm-001', 'customer:read',   'Musteri Goruntuleme',  'CUSTOMER',  'READ'),
    ('perm-002', 'customer:write',  'Musteri Duzenleme',    'CUSTOMER',  'WRITE'),
    ('perm-003', 'customer:delete', 'Musteri Silme',        'CUSTOMER',  'DELETE'),
    ('perm-004', 'workorder:read',  'Is Emri Goruntuleme',  'WORK_ORDER','READ'),
    ('perm-005', 'workorder:write', 'Is Emri Duzenleme',    'WORK_ORDER','WRITE'),
    ('perm-006', 'workorder:delete','Is Emri Silme',        'WORK_ORDER','DELETE'),
    ('perm-007', 'workorder:assign','Is Emri Atama',        'WORK_ORDER','ASSIGN'),
    ('perm-008', 'workorder:complete','Is Emri Tamamlama',  'WORK_ORDER','COMPLETE'),
    ('perm-009', 'workorder:approve','Is Emri Onaylama',    'WORK_ORDER','APPROVE'),
    ('perm-010', 'workorder:invoice','Is Emri Fatura Kesme', 'WORK_ORDER','INVOICE'),
    ('perm-011', 'tenant:manage',   'Tenant Yonetimi',       'TENANT',    'MANAGE'),
    ('perm-012', 'user:manage',     'Kullanici Yonetimi',    'USER',      'MANAGE'),
    ('perm-013', 'file:upload',     'Dosya Yukleme',         'FILE',      'UPLOAD'),
    ('perm-014', 'file:download',   'Dosya Indirme',         'FILE',      'DOWNLOAD'),
    ('perm-015', 'report:view',     'Rapor Goruntuleme',     'REPORT',    'VIEW'),
    ('perm-016', 'settings:manage', 'Ayarlar Yonetimi',      'SETTINGS',  'MANAGE')
ON CONFLICT (name) DO NOTHING;

-- ROLES
INSERT INTO role (id, name, display_name, description, is_system) VALUES
    ('role-admin',    'ADMIN',          'Platform Yoneticisi',    'Full system access',              TRUE),
    ('role-manager',  'MANAGER',        'Saha Yoneticisi',         'Manages field operations',        TRUE),
    ('role-tech',     'TECHNICIAN',     'Saha Teknisyeni',         'Field service technician',        TRUE),
    ('role-viewer',   'VIEWER',         'Goruntuleyici',           'Read-only access',                TRUE)
ON CONFLICT (name) DO NOTHING;

-- ROLE-PERMISSION MAP (ADMIN: ALL)
INSERT INTO role_permission (role_id, permission_id)
SELECT 'role-admin', id FROM permission
ON CONFLICT DO NOTHING;

-- MANAGER PERMISSIONS
INSERT INTO role_permission (role_id, permission_id) VALUES
    ('role-manager', 'perm-001'), ('role-manager', 'perm-002'),
    ('role-manager', 'perm-004'), ('role-manager', 'perm-005'),
    ('role-manager', 'perm-007'), ('role-manager', 'perm-008'),
    ('role-manager', 'perm-010'), ('role-manager', 'perm-013'),
    ('role-manager', 'perm-014'), ('role-manager', 'perm-015'),
    ('role-manager', 'perm-016')
ON CONFLICT DO NOTHING;

-- TECHNICIAN PERMISSIONS
INSERT INTO role_permission (role_id, permission_id) VALUES
    ('role-tech', 'perm-001'), ('role-tech', 'perm-004'),
    ('role-tech', 'perm-008'), ('role-tech', 'perm-013'),
    ('role-tech', 'perm-014')
ON CONFLICT DO NOTHING;

-- VIEWER PERMISSIONS
INSERT INTO role_permission (role_id, permission_id) VALUES
    ('role-viewer', 'perm-001'), ('role-viewer', 'perm-004'),
    ('role-viewer', 'perm-014'), ('role-viewer', 'perm-015')
ON CONFLICT DO NOTHING;

-- DEFAULT TENANT (only if not exists)
INSERT INTO tenant (id, name, slug, plan, active)
VALUES ('tenant-default', 'İşAkış Demo', 'demo', 'FREE', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- DEFAULT ADMIN USER
-- password: Admin123! (BCrypt hash)
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- Generate with: BCryptPasswordEncoder().encode("Admin123!")

INSERT INTO user_account (id, tenant_id, email, password_hash, first_name, last_name, enabled, email_verified)
VALUES (
    'user-admin-001',
    'tenant-default',
    'admin@sahaflow.local',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'System',
    'Admin',
    TRUE,
    TRUE
)
ON CONFLICT (tenant_id, LOWER(email)) DO NOTHING;

-- ASSIGN ADMIN ROLE
INSERT INTO membership (id, user_id, role_id, tenant_id)
VALUES ('mem-admin-001', 'user-admin-001', 'role-admin', 'tenant-default')
ON CONFLICT (user_id, role_id, tenant_id) DO NOTHING;
