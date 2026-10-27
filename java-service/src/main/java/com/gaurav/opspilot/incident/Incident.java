package com.gaurav.opspilot.incident;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "incidents")
@Getter
@Setter
@NoArgsConstructor
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;
    private String serviceName;

    @jakarta.persistence.Column(length = 10000, nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    private Severity severity;

    @Enumerated(EnumType.STRING)
    private IncidentStatus status;

    @jakarta.persistence.Column(length = 10000)
    private String aiSummary;

    private Double aiConfidence;
    private String aiAnalysisId;
    private Instant createdAt;
    private Instant updatedAt;

    @Version
    private long version;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
        if (status == null) status = IncidentStatus.OPEN;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

}
