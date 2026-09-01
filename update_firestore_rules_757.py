import re

with open('firestore.rules', 'r') as f:
    content = f.read()

new_rules = """
    // =========================================================================
    // PHASE 7.57: ORGANIZATIONAL KNOWLEDGE GOVERNANCE ENGINE
    // =========================================================================
    
    match /knowledge_domains/{document} {
      allow read: if isTenantScoped() && hasPermission('knowledge.view');
      allow create: if isTenantScoped() && hasPermission('knowledge.domain.manage');
      allow update: if isTenantScoped() && hasPermission('knowledge.domain.manage') && request.resource.data.tenantId == resource.data.tenantId;
      allow delete: if false; 
    }

    match /knowledge_assets/{document} {
      allow read: if isTenantScoped() && hasPermission('knowledge.view') &&
        (resource.data.classification != 'RESTRICTED' || hasPermission('knowledge.restricted_view')) &&
        (resource.data.campusScope == 'GLOBAL' || hasCampusAccess(resource.data.campusScope));
      allow create, update: if isTenantScoped() && hasPermission('knowledge.asset.manage') && request.resource.data.tenantId == resource.data.tenantId;
      allow delete: if false; 
    }

    match /knowledge_asset_versions/{document} {
      allow read: if isTenantScoped() && hasPermission('knowledge.view');
      allow create: if isTenantScoped() && hasPermission('knowledge.asset.manage');
      allow update, delete: if false; // Immutable
    }

    match /lessons_learned/{document} {
      allow read: if isTenantScoped() && hasPermission('knowledge.view');
      allow create: if isTenantScoped() && hasPermission('knowledge.lesson.manage');
      allow update: if isTenantScoped() && hasPermission('knowledge.lesson.manage') &&
        (resource.data.status != 'VALIDATED' || hasPermission('knowledge.lesson.validate'));
      allow delete: if false;
    }

    match /knowledge_certifications/{document} {
      allow read: if isTenantScoped() && hasPermission('knowledge.view');
      allow create: if isTenantScoped() && hasPermission('knowledge.certification.manage') &&
        request.resource.data.certifierId == request.auth.uid;
      allow update, delete: if false; // Immutable
    }

    match /knowledge_audit_logs/{document} {
      allow read: if isTenantScoped() && hasPermission('knowledge.audit.view');
      allow create: if isTenantScoped();
      allow update, delete: if false; // append-only
    }
"""

last_brace = content.rfind('}')
if last_brace != -1:
    content = content[:last_brace] + new_rules + content[last_brace:]
    with open('firestore.rules', 'w') as f:
        f.write(content)
