import json

with open('firebase-blueprint.json', 'r') as f:
    blueprint = json.load(f)

new_collections = {
    "stakeholders": {"indexes": [{"fields": ["tenantId", "status"]}]},
    "stakeholder_groups": {"indexes": [{"fields": ["tenantId"]}]},
    "stakeholder_segments": {"indexes": [{"fields": ["tenantId"]}]},
    "stakeholder_relationships": {"indexes": [{"fields": ["tenantId"]}]},
    "engagement_plans": {"indexes": [{"fields": ["tenantId", "status"]}]},
    "engagement_activities": {"indexes": [{"fields": ["tenantId", "planId"]}]},
    "institutional_communications": {"indexes": [{"fields": ["tenantId", "status"]}]},
    "communication_versions": {"indexes": [{"fields": ["tenantId", "communicationId"]}]},
    "communication_approvals": {"indexes": [{"fields": ["tenantId", "communicationId"]}]},
    "communication_publications": {"indexes": [{"fields": ["tenantId", "communicationId"]}]},
    "institutional_announcements": {"indexes": [{"fields": ["tenantId", "status"]}]},
    "consultations": {"indexes": [{"fields": ["tenantId", "status"]}]},
    "stakeholder_complaints": {"indexes": [{"fields": ["tenantId", "status"]}]},
    "stakeholder_issues": {"indexes": [{"fields": ["tenantId", "status"]}]},
    "stakeholder_escalations": {"indexes": [{"fields": ["tenantId", "status"]}]},
    "reputation_observations": {"indexes": [{"fields": ["tenantId", "direction"]}]},
    "reputation_snapshots": {"indexes": [{"fields": ["tenantId", "period"]}]},
    "stakeholder_risks": {"indexes": [{"fields": ["tenantId", "status"]}]},
    "executive_communication_decisions": {"indexes": [{"fields": ["tenantId", "status"]}]},
    "stakeholder_data_quality_issues": {"indexes": [{"fields": ["tenantId", "status"]}]},
    "stakeholder_audit_logs": {"indexes": [{"fields": ["tenantId", "entityId"]}]}
}

blueprint['collections'].update(new_collections)

with open('firebase-blueprint.json', 'w') as f:
    json.dump(blueprint, f, indent=2)
