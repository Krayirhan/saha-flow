-- V1__init_tenant_identity.sql
-- INITIAL SCHEMA: Tenant, Identity, RBAC

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE tenant (
    id          VARCHAR(36)  PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    slug        VARCHAR(30)  NOT NULL UNIQUE,
    plan        VARCHAR(20)  NOT NULL DEFAULT 'FREE',
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tenant_slug ON tenant(slug);
CREATE INDEX idx_tenant_active ON tenant(active);

CREATE TABLE user_account (
    id              VARCHAR(36)  PRIMARY KEY,
    tenant_id       VARCHAR(36)  NOT NULL REFERENCES tenant(id),
    email           VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    phone           VARCHAR(20),
    enabled         BOOLEAN      NOT NULL DEFAULT TRUE,
    email_verified  BOOLEAN      NOT NULL DEFAULT FALSE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_user_tenant_email ON user_account(tenant_id, LOWER(email));
CREATE INDEX idx_user_tenant_id ON user_account(tenant_id);
CREATE INDEX idx_user_email ON user_account(LOWER(email));

CREATE TABLE role (
    id           VARCHAR(36)  PRIMARY KEY,
    name         VARCHAR(50)  NOT NULL UNIQUE,
    display_name VARCHAR(100),
    description  TEXT,
    is_system    BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE permission (
    id           VARCHAR(36)  PRIMARY KEY,
    name         VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100),
    resource_type VARCHAR(50),
    action       VARCHAR(50)
);

CREATE TABLE role_permission (
    role_id       VARCHAR(36) NOT NULL REFERENCES role(id) ON DELETE CASCADE,
    permission_id VARCHAR(36) NOT NULL REFERENCES permission(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE membership (
    id        VARCHAR(36) PRIMARY KEY,
    user_id   VARCHAR(36) NOT NULL REFERENCES user_account(id) ON DELETE CASCADE,
    role_id   VARCHAR(36) NOT NULL REFERENCES role(id) ON DELETE RESTRICT,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    UNIQUE (user_id, role_id, tenant_id)
);

CREATE INDEX idx_membership_user ON membership(user_id);
CREATE INDEX idx_membership_tenant ON membership(tenant_id);
CREATE INDEX idx_membership_role ON membership(role_id);
