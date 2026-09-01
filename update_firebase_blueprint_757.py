import json

with open('firebase-blueprint.json', 'r') as f:
    data = json.load(f)

new_collections = {
    "/knowledge_domains/{domainId}": {
        "description": "Governed knowledge domains"
    },
    "/knowledge_assets/{assetId}": {
        "description": "Governed knowledge assets"
    },
    "/knowledge_asset_versions/{versionId}": {
        "description": "Immutable knowledge asset versions"
    },
    "/knowledge_articles/{articleId}": {
        "description": "Governed institutional articles"
    },
    "/knowledge_resources/{resourceId}": {
        "description": "Governed knowledge resources"
    },
    "/knowledge_collections/{collectionId}": {
        "description": "Knowledge collections"
    },
    "/knowledge_taxonomies/{taxonomyId}": {
        "description": "Governed taxonomies"
    },
    "/knowledge_taxonomy_terms/{termId}": {
        "description": "Governed taxonomy terms"
    },
    "/knowledge_tags/{tagId}": {
        "description": "Knowledge tags"
    },
    "/knowledge_relationships/{relId}": {
        "description": "Governed relationships between knowledge items"
    },
    "/knowledge_references/{refId}": {
        "description": "Governed knowledge references"
    },
    "/knowledge_evidence/{evidenceId}": {
        "description": "Evidence records for knowledge"
    },
    "/institutional_practices/{practiceId}": {
        "description": "Governed institutional practices"
    },
    "/lessons_learned/{lessonId}": {
        "description": "Governed lessons learned"
    },
    "/organizational_memory/{memoryId}": {
        "description": "Organizational memory records"
    },
    "/expertise_profiles/{profileId}": {
        "description": "Staff/faculty expertise profiles"
    },
    "/expertise_domains/{domainId}": {
        "description": "Expertise domain definitions"
    },
    "/expertise_references/{refId}": {
        "description": "References to specific expertise"
    },
    "/research_knowledge/{knowledgeId}": {
        "description": "Research knowledge records"
    },
    "/research_output_references/{refId}": {
        "description": "References to research outputs"
    },
    "/research_evidence/{evidenceId}": {
        "description": "Evidence derived from research"
    },
    "/learning_resources/{resourceId}": {
        "description": "Institutional learning resources"
    },
    "/knowledge_questions/{questionId}": {
        "description": "Governed knowledge questions"
    },
    "/knowledge_answers/{answerId}": {
        "description": "Governed knowledge answers"
    },
    "/knowledge_reviews/{reviewId}": {
        "description": "Knowledge review records"
    },
    "/knowledge_certifications/{certId}": {
        "description": "Knowledge certifications"
    },
    "/knowledge_approvals/{approvalId}": {
        "description": "Knowledge approvals"
    },
    "/knowledge_gaps/{gapId}": {
        "description": "Identified knowledge gaps"
    },
    "/knowledge_risks/{riskId}": {
        "description": "Knowledge risks"
    },
    "/knowledge_exceptions/{exceptionId}": {
        "description": "Knowledge exceptions"
    },
    "/knowledge_lineage_nodes/{nodeId}": {
        "description": "Nodes for knowledge lineage graph"
    },
    "/knowledge_lineage_edges/{edgeId}": {
        "description": "Edges for knowledge lineage graph"
    },
    "/knowledge_audit_logs/{auditId}": {
        "description": "Immutable audit trail for organizational knowledge governance"
    }
}

if 'firestore' in data:
    data['firestore'].update(new_collections)
else:
    data.update(new_collections)

with open('firebase-blueprint.json', 'w') as f:
    json.dump(data, f, indent=2)
