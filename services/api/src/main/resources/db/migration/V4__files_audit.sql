-- V4__files_audit.sql
-- MEDIA, APPROVALS, REPORTS, OUTBOX, AUDIT, IDEMPOTENCY

CREATE TABLE media_object (
    id               VARCHAR(36)   PRIMARY KEY,
    tenant_id        VARCHAR(36)   NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    object_type      VARCHAR(50)   NOT NULL,
    object_file_name VARCHAR(500)  NOT NULL,
    content_type     VARCHAR(255),
    file_size        BIGINT,
    resource_type    VARCHAR(50),
    resource_id      VARCHAR(36),
    storage_path     VARCHAR(1000) NOT NULL,
    uploaded_by      VARCHAR(36)   NOT NULL,
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mo_tenant ON media_object(tenant_id);
CREATE INDEX idx_mo_resource ON media_object(tenant_id, resource_type, resource_id);

CREATE TABLE customer_approval (
    id             VARCHAR(36)  PRIMARY KEY,
    tenant_id      VARCHAR(36)  NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    work_order_id  VARCHAR(36)  NOT NULL REFERENCES work_order(id) ON DELETE CASCADE,
    approved_by    VARCHAR(36)  NOT NULL,
    approved_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    signature_data TEXT,
    comment        VARCHAR(1000)
);

CREATE TABLE service_report (
    id             VARCHAR(36)   PRIMARY KEY,
    tenant_id      VARCHAR(36)   NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    work_order_id  VARCHAR(36)   NOT NULL REFERENCES work_order(id) ON DELETE CASCADE,
    report_type    VARCHAR(50)   NOT NULL,
    content        TEXT,
    created_by     VARCHAR(36)   NOT NULL,
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE outbox_event (
    id             VARCHAR(36)   PRIMARY KEY,
    tenant_id      VARCHAR(36)   NOT NULL,
    aggregate_type VARCHAR(100)  NOT NULL,
    aggregate_id   VARCHAR(36)   NOT NULL,
    event_type     VARCHAR(100)  NOT NULL,
    payload        JSONB         NOT NULL,
    status         VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    processed_at   TIMESTAMPTZ
);

CREATE INDEX idx_outbox_status ON outbox_event(status, created_at);

CREATE TABLE audit_event (
    id             BIGSERIAL     PRIMARY KEY,
    tenant_id      VARCHAR(36)   NOT NULL,
    user_id        VARCHAR(36)   NOT NULL,
    action         VARCHAR(50)   NOT NULL,
    resource_type  VARCHAR(50)   NOT NULL,
    resource_id    VARCHAR(36),
    old_values     JSONB,
    new_values     JSONB,
    ip_address     VARCHAR(45),
    correlation_id VARCHAR(36),
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_tenant ON audit_event(tenant_id, created_at DESC);
CREATE INDEX idx_audit_resource ON audit_event(tenant_id, resource_type, resource_id);
CREATE INDEX idx_audit_user ON audit_event(tenant_id, user_id);

CREATE TABLE idempotency_keys (
    key             VARCHAR(128) PRIMARY KEY,
    tenant_id       VARCHAR(36),
    request_payload JSONB        NOT NULL,
    response_body   JSONB,
    status          VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ
);

CREATE INDEX idx_idempotency_status ON idempotency_keys(status);
