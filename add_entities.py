import json

with open('firebase-blueprint.json', 'r') as f:
    blueprint = json.load(f)

new_entities = {
    "stakeholders": {"type": "object", "properties": {}},
    "stakeholder_groups": {"type": "object", "properties": {}},
    "stakeholder_segments": {"type": "object", "properties": {}},
    "stakeholder_relationships": {"type": "object", "properties": {}},
    "engagement_plans": {"type": "object", "properties": {}},
    "engagement_activities": {"type": "object", "properties": {}},
    "institutional_communications": {"type": "object", "properties": {}},
    "communication_versions": {"type": "object", "properties": {}},
    "communication_approvals": {"type": "object", "properties": {}},
    "communication_publications": {"type": "object", "properties": {}},
    "institutional_announcements": {"type": "object", "properties": {}},
    "consultations": {"type": "object", "properties": {}},
    "stakeholder_complaints": {"type": "object", "properties": {}},
    "stakeholder_issues": {"type": "object", "properties": {}},
    "stakeholder_escalations": {"type": "object", "properties": {}},
    "reputation_observations": {"type": "object", "properties": {}},
    "reputation_snapshots": {"type": "object", "properties": {}},
    "stakeholder_risks": {"type": "object", "properties": {}},
    "executive_communication_decisions": {"type": "object", "properties": {}},
    "stakeholder_data_quality_issues": {"type": "object", "properties": {}},
    "stakeholder_audit_logs": {"type": "object", "properties": {}}
}

if 'entities' in blueprint:
    blueprint['entities'].update(new_entities)
else:
    blueprint['entities'] = new_entities

with open('firebase-blueprint.json', 'w') as f:
    json.dump(blueprint, f, indent=2)
