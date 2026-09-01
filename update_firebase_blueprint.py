import json

with open('firebase-blueprint.json', 'r') as f:
    data = json.load(f)

new_collections = {
    "/knowledge_assets/{assetId}": {
        "description": "Governed institutional knowledge assets (policies, procedures, SOPs, guidelines, etc.)"
    },
    "/knowledge_versions/{versionId}": {
        "description": "Immutable version histories for knowledge assets"
    },
    "/knowledge_approvals/{approvalId}": {
        "description": "Four-eyes knowledge governance approvals"
    },
    "/institutional_decisions/{decisionId}": {
        "description": "Institutional decision records"
    },
    "/institutional_memory/{memoryId}": {
        "description": "Historical institutional memory and context"
    },
    "/knowledge_distributions/{distributionId}": {
        "description": "Controlled knowledge dissemination records"
    },
    "/knowledge_data_quality_issues/{issueId}": {
        "description": "Data quality issues detected in the knowledge registry"
    },
    "/knowledge_audit_logs/{auditId}": {
        "description": "Immutable append-only audit logs for knowledge governance"
    }
}

data['firestore'].update(new_collections)

with open('firebase-blueprint.json', 'w') as f:
    json.dump(data, f, indent=2)
