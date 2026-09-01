import re

with open('firestore.rules', 'r') as f:
    rules = f.read()

new_rules = """
    // Phase 7.53 Institutional Stakeholder, Communications, Engagement & Reputation Governance Engine
    match /stakeholders/{id} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null;
      allow delete: if request.auth != null;
    }
    match /stakeholder_groups/{id} {
      allow read, write: if request.auth != null;
    }
    match /stakeholder_segments/{id} {
      allow read, write: if request.auth != null;
    }
    match /stakeholder_relationships/{id} {
      allow read, write: if request.auth != null;
    }
    match /engagement_plans/{id} {
      allow read, write: if request.auth != null;
    }
    match /engagement_activities/{id} {
      allow read, write: if request.auth != null;
    }
    match /institutional_communications/{id} {
      allow read, write: if request.auth != null;
    }
    match /communication_versions/{id} {
      allow read, write: if request.auth != null;
    }
    match /communication_approvals/{id} {
      allow read, write: if request.auth != null;
    }
    match /communication_publications/{id} {
      allow read, write: if request.auth != null;
    }
    match /institutional_announcements/{id} {
      allow read, write: if request.auth != null;
    }
    match /consultations/{id} {
      allow read, write: if request.auth != null;
    }
    match /stakeholder_complaints/{id} {
      allow read, write: if request.auth != null;
    }
    match /stakeholder_issues/{id} {
      allow read, write: if request.auth != null;
    }
    match /stakeholder_escalations/{id} {
      allow read, write: if request.auth != null;
    }
    match /reputation_observations/{id} {
      allow read, write: if request.auth != null;
    }
    match /reputation_snapshots/{id} {
      allow read, write: if request.auth != null;
    }
    match /stakeholder_risks/{id} {
      allow read, write: if request.auth != null;
    }
    match /executive_communication_decisions/{id} {
      allow read, write: if request.auth != null;
    }
    match /stakeholder_data_quality_issues/{id} {
      allow read, write: if request.auth != null;
    }
    match /stakeholder_audit_logs/{id} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if false; // Append-only
    }
"""

# Insert before the last closing brace
last_brace = rules.rfind('}')
rules = rules[:last_brace] + new_rules + rules[last_brace:]

with open('firestore.rules', 'w') as f:
    f.write(rules)
