-- V2__customer.sql
-- CUSTOMER AND ADDRESSES

CREATE TABLE customer (
    id          VARCHAR(36)  PRIMARY KEY,
    tenant_id   VARCHAR(36)  NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    name        VARCHAR(200) NOT NULL,
    email       VARCHAR(255),
    phone       VARCHAR(20),
    tax_id      VARCHAR(20),
    tax_office  VARCHAR(100),
    notes       VARCHAR(2000),
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by  VARCHAR(36)  REFERENCES user_account(id)
);

CREATE INDEX idx_customer_tenant ON customer(tenant_id);
CREATE INDEX idx_customer_email ON customer(tenant_id, LOWER(email));
CREATE INDEX idx_customer_name ON customer(tenant_id, name);
CREATE INDEX idx_customer_active ON customer(tenant_id, active);

CREATE TABLE customer_address (
    id            VARCHAR(36)  PRIMARY KEY,
    customer_id   VARCHAR(36)  NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
    label         VARCHAR(100) NOT NULL,
    address_line1 VARCHAR(500) NOT NULL,
    address_line2 VARCHAR(500),
    city          VARCHAR(100) NOT NULL,
    district      VARCHAR(100),
    postal_code   VARCHAR(20),
    country       VARCHAR(3)   NOT NULL DEFAULT 'TR',
    latitude      DOUBLE PRECISION,
    longitude     DOUBLE PRECISION,
    is_default    BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_address_customer ON customer_address(customer_id);
