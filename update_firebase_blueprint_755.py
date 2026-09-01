import json

with open('firebase-blueprint.json', 'r') as f:
    data = json.load(f)

new_collections = {
    "/data_domains/{domainId}": {
        "description": "Governed institutional data domains"
    },
    "/data_assets/{assetId}": {
        "description": "Enterprise governed data assets"
    },
    "/data_dictionary/{entryId}": {
        "description": "Governed enterprise data dictionary entries"
    },
    "/business_glossary/{termId}": {
        "description": "Governed business vocabulary and terms"
    },
    "/data_lineage_nodes/{nodeId}": {
        "description": "Nodes representing assets in data lineage"
    },
    "/data_lineage_edges/{edgeId}": {
        "description": "Edges connecting assets in data lineage"
    },
    "/master_data_records/{recordId}": {
        "description": "Governed master data entity records"
    },
    "/reference_data_sets/{setId}": {
        "description": "Governed reference data collections"
    },
    "/data_quality_rules/{ruleId}": {
        "description": "Deterministic data quality rules"
    },
    "/data_quality_issues/{issueId}": {
        "description": "Data quality issues discovered"
    },
    "/data_certifications/{certId}": {
        "description": "Data governance certifications"
    },
    "/data_contracts/{contractId}": {
        "description": "Agreements between data providers and consumers"
    },
    "/data_sharing_agreements/{agreementId}": {
        "description": "Governed data sharing access rules"
    },
    "/data_governance_decisions/{decisionId}": {
        "description": "Immutable data governance decisions"
    },
    "/data_governance_audit_logs/{auditId}": {
        "description": "Immutable append-only audit trail for data governance"
    }
}

if 'firestore' in data:
    data['firestore'].update(new_collections)
else:
    data.update(new_collections) # Fallback

with open('firebase-blueprint.json', 'w') as f:
    json.dump(data, f, indent=2)
