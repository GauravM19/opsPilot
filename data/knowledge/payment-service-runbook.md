# Payment Service Runbook

When payment latency increases after a deployment, first compare p95 latency, database connection usage, error rate, and the deployment timestamp. Do not roll back automatically. The incident commander must approve a rollback after checking whether the new version changed query volume or connection-pool settings.

If database connections are exhausted, inspect active sessions and pool wait time. Capture evidence before changing limits. If the service cannot recover and the rollback is approved, record the change in the incident timeline and monitor error rate and latency for at least fifteen minutes.
