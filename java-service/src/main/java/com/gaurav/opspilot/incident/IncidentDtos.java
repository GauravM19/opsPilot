package com.gaurav.opspilot.incident;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.UUID;

public final class IncidentDtos {
    private IncidentDtos() { }

    public record CreateIncidentRequest(
            @NotBlank @Size(max = 180) String title,
            @NotBlank @Size(max = 120) String serviceName,
            @NotBlank @Size(max = 10000) String description,
            @NotNull Severity severity) { }

    public record StatusRequest(@NotNull IncidentStatus status) { }

    public record AnalysisRequest(
            @NotBlank @Size(max = 10000) String summary,
            @NotNull Double confidence,
            @NotBlank String analysisId) { }

    public record IncidentResponse(
            UUID id,
            String title,
            String serviceName,
            String description,
            Severity severity,
            IncidentStatus status,
            String aiSummary,
            Double aiConfidence,
            String aiAnalysisId,
            Instant createdAt,
            Instant updatedAt,
            long version) {
        static IncidentResponse from(Incident incident) {
            return new IncidentResponse(
                    incident.getId(), incident.getTitle(), incident.getServiceName(), incident.getDescription(),
                    incident.getSeverity(), incident.getStatus(), incident.getAiSummary(), incident.getAiConfidence(),
                    incident.getAiAnalysisId(), incident.getCreatedAt(), incident.getUpdatedAt(), incident.getVersion());
        }
    }
}
