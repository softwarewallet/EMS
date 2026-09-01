import re

with open('firestore.rules', 'r') as f:
    content = f.read()

new_rules = """
    // =========================================================================
    // PHASE 7.54: KNOWLEDGE GOVERNANCE ENGINE
    // =========================================================================
    
    match /knowledge_assets/{document} {
      allow read: if isTenantScoped() && hasPermission('knowledge.view') &&
        (resource.data.classification != 'RESTRICTED' || hasPermission('knowledge.restricted_view')) &&
        (resource.data.campusScope == 'GLOBAL' || hasCampusAccess(resource.data.campusScope));
      allow create: if isTenantScoped() && hasPermission('knowledge.create') &&
        request.resource.data.status == 'DRAFT';
      allow update: if isTenantScoped() && hasPermission('knowledge.edit') &&
        request.resource.data.tenantId == resource.data.tenantId &&
        // Cannot mutate PUBLISHED directly unless via system versioning or status change
        (resource.data.status != 'PUBLISHED' || hasPermission('knowledge.publish'));
      allow delete: if false; // Soft-delete or archive only
    }

    match /knowledge_versions/{document} {
      allow read: if isTenantScoped() && hasPermission('knowledge.view');
      allow create: if isTenantScoped() && hasPermission('knowledge.edit');
      allow update, delete: if false; // Immutable
    }

    match /knowledge_approvals/{document} {
      allow read: if isTenantScoped() && hasPermission('knowledge.view');
      allow create: if isTenantScoped() && hasPermission('knowledge.approve') &&
        request.resource.data.approverId == request.auth.uid &&
        // No self-approval if we can verify creator in context (enforced in service layer)
        true;
      allow update, delete: if false; // Immutable
    }

    match /institutional_decisions/{document} {
      allow read: if isTenantScoped() && hasPermission('decision.view');
      allow create: if isTenantScoped() && hasPermission('decision.manage');
      allow update: if isTenantScoped() && hasPermission('decision.manage') && request.resource.data.tenantId == resource.data.tenantId;
      allow delete: if false;
    }

    match /institutional_memory/{document} {
      allow read: if isTenantScoped() && hasPermission('institutional_memory.view');
      allow create, update: if isTenantScoped() && hasPermission('institutional_memory.manage');
      allow delete: if false;
    }

    match /knowledge_distributions/{document} {
      allow read: if isTenantScoped() && hasPermission('distribution.view');
      allow create: if isTenantScoped() && hasPermission('distribution.manage');
      allow update, delete: if false;
    }

    match /knowledge_data_quality_issues/{document} {
      allow read: if isTenantScoped() && hasPermission('knowledge_quality.view');
      allow create: if isTenantScoped() && hasPermission('knowledge_quality.manage');
      allow update: if isTenantScoped() && hasPermission('knowledge_quality.manage');
      allow delete: if false;
    }

    match /knowledge_audit_logs/{document} {
      allow read: if isTenantScoped() && hasPermission('knowledge_audit.view');
      allow create: if isTenantScoped();
      allow update, delete: if false;
    }
"""

# Insert before the last closing brace
last_brace = content.rfind('}')
content = content[:last_brace] + new_rules + content[last_brace:]

with open('firestore.rules', 'w') as f:
    f.write(content)
