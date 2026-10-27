CREATE TABLE incidents (
    id UUID PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    service_name VARCHAR(120) NOT NULL,
    description VARCHAR(10000) NOT NULL,
    severity VARCHAR(2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    ai_summary VARCHAR(10000),
    ai_confidence DOUBLE PRECISION,
    ai_analysis_id VARCHAR(120),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_service_name ON incidents(service_name);
