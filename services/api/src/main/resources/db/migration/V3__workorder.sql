-- V3__workorder.sql
-- WORK ORDER MANAGEMENT

CREATE TABLE work_order (
    id                        VARCHAR(36)   PRIMARY KEY,
    tenant_id                 VARCHAR(36)   NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    title                     VARCHAR(200)  NOT NULL,
    description               VARCHAR(4000),
    status                    VARCHAR(20)   NOT NULL DEFAULT 'OPEN',
    priority                  VARCHAR(10)   NOT NULL DEFAULT 'MEDIUM',
    scheduled_at              TIMESTAMPTZ,
    started_at                TIMESTAMPTZ,
    completed_at              TIMESTAMPTZ,
    customer_id               VARCHAR(36)   NOT NULL,
    customer_name             VARCHAR(200),
    address_text              VARCHAR(500),
    latitude                  DOUBLE PRECISION,
    longitude                 DOUBLE PRECISION,
    estimated_duration_minutes INTEGER,
    actual_duration_minutes   INTEGER,
    estimated_cost            DECIMAL(15,2),
    actual_cost               DECIMAL(15,2),
    assigned_user_id          VARCHAR(36),
    created_by                VARCHAR(36)   NOT NULL,
    created_at                TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at                TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    cancellation_reason       VARCHAR(1000)
);

CREATE INDEX idx_wo_tenant ON work_order(tenant_id);
CREATE INDEX idx_wo_status ON work_order(tenant_id, status);
CREATE INDEX idx_wo_customer ON work_order(tenant_id, customer_id);
CREATE INDEX idx_wo_assigned ON work_order(tenant_id, assigned_user_id);
CREATE INDEX idx_wo_created_at ON work_order(tenant_id, created_at DESC);
CREATE INDEX idx_wo_scheduled ON work_order(tenant_id, scheduled_at);

CREATE TABLE work_order_assignment (
    id              VARCHAR(36) PRIMARY KEY,
    work_order_id   VARCHAR(36) NOT NULL REFERENCES work_order(id) ON DELETE CASCADE,
    user_id         VARCHAR(36) NOT NULL,
    assigned_by     VARCHAR(36) NOT NULL,
    assigned_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    unassigned_at   TIMESTAMPTZ,
    active          BOOLEAN     NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_woa_wo ON work_order_assignment(work_order_id);
CREATE INDEX idx_woa_user ON work_order_assignment(user_id);

CREATE TABLE work_order_status_history (
    id              VARCHAR(36)  PRIMARY KEY,
    work_order_id   VARCHAR(36)  NOT NULL REFERENCES work_order(id) ON DELETE CASCADE,
    from_status     VARCHAR(20),
    to_status       VARCHAR(20)  NOT NULL,
    changed_by      VARCHAR(36)  NOT NULL,
    note            VARCHAR(1000),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wosh_wo ON work_order_status_history(work_order_id);
CREATE INDEX idx_wosh_created ON work_order_status_history(work_order_id, created_at);

CREATE TABLE location_event (
    id              VARCHAR(36)  PRIMARY KEY,
    work_order_id   VARCHAR(36)  NOT NULL REFERENCES work_order(id) ON DELETE CASCADE,
    user_id         VARCHAR(36)  NOT NULL,
    latitude        DOUBLE PRECISION NOT NULL,
    longitude       DOUBLE PRECISION NOT NULL,
    accuracy        DOUBLE PRECISION,
    recorded_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_locevt_wo ON location_event(work_order_id);
