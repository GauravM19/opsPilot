package com.gaurav.opspilot.incident;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

import static com.gaurav.opspilot.incident.IncidentDtos.*;

@Service
public class IncidentService {
    private final IncidentRepository repository;

    public IncidentService(IncidentRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public IncidentResponse create(CreateIncidentRequest request) {
        Incident incident = new Incident();
        incident.setTitle(request.title());
        incident.setServiceName(request.serviceName());
        incident.setDescription(request.description());
        incident.setSeverity(request.severity());
        incident.setStatus(IncidentStatus.OPEN);
        return IncidentResponse.from(repository.save(incident));
    }

    @Transactional(readOnly = true)
    public List<IncidentResponse> list() {
        return repository.findAll().stream().map(IncidentResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public IncidentResponse get(UUID id) {
        return IncidentResponse.from(find(id));
    }

    @Transactional
    public IncidentResponse updateStatus(UUID id, StatusRequest request) {
        Incident incident = find(id);
        incident.setStatus(request.status());
        return IncidentResponse.from(repository.save(incident));
    }

    @Transactional
    public IncidentResponse attachAnalysis(UUID id, AnalysisRequest request) {
        if (request.confidence() < 0 || request.confidence() > 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "confidence must be between 0 and 1");
        }
        Incident incident = find(id);
        incident.setAiSummary(request.summary());
        incident.setAiConfidence(request.confidence());
        incident.setAiAnalysisId(request.analysisId());
        if (incident.getStatus() == IncidentStatus.OPEN) incident.setStatus(IncidentStatus.INVESTIGATING);
        return IncidentResponse.from(repository.save(incident));
    }

    private Incident find(UUID id) {
        return repository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Incident not found: " + id));
    }
}
