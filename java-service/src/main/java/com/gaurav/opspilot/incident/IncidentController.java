package com.gaurav.opspilot.incident;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

import static com.gaurav.opspilot.incident.IncidentDtos.*;

@RestController
@RequestMapping("/api/v1/incidents")
public class IncidentController {
    private final IncidentService service;

    public IncidentController(IncidentService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IncidentResponse create(@Valid @RequestBody CreateIncidentRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<IncidentResponse> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public IncidentResponse get(@PathVariable UUID id) {
        return service.get(id);
    }

    @PatchMapping("/{id}/status")
    public IncidentResponse updateStatus(@PathVariable UUID id, @Valid @RequestBody StatusRequest request) {
        return service.updateStatus(id, request);
    }

    @PostMapping("/{id}/analysis")
    public IncidentResponse attachAnalysis(@PathVariable UUID id, @Valid @RequestBody AnalysisRequest request) {
        return service.attachAnalysis(id, request);
    }
}
