package com.gaurav.opspilot.incident;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;
import static com.gaurav.opspilot.incident.IncidentDtos.*;

@SpringBootTest
@ActiveProfiles("test")
class IncidentServiceTest {
    @Autowired
    private IncidentService service;

    @Test
    void createsIncidentAndAttachesGroundedAnalysis() {
        IncidentResponse created = service.create(new CreateIncidentRequest(
                "Payment latency", "payment-service", "p95 latency increased after deployment", Severity.P2));

        assertThat(created.status()).isEqualTo(IncidentStatus.OPEN);
        IncidentResponse analysed = service.attachAnalysis(created.id(), new AnalysisRequest(
                "Latency increased after the deployment. [runbook: payment-latency]", 0.84, "analysis-1"));

        assertThat(analysed.status()).isEqualTo(IncidentStatus.INVESTIGATING);
        assertThat(analysed.aiConfidence()).isEqualTo(0.84);
    }
}
