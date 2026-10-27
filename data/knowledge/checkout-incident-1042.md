# Historical Incident INC-1042

The checkout service experienced elevated latency after a configuration deployment changed the database connection-pool maximum. The strongest signals were high pool wait time, stable CPU, and a rise in request timeout errors. The team rolled back the configuration after the incident commander approved the action.

The follow-up action was to add a deployment guardrail for connection-pool changes and a dashboard panel for pool wait time. Similar incidents should link the current deployment, metrics screenshot, and rollback decision in the timeline.
