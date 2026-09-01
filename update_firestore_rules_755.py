import re

with open('firestore.rules', 'r') as f:
    content = f.read()

new_rules = """
    // =========================================================================
    // PHASE 7.55: DATA GOVERNANCE ENGINE
    // =========================================================================
    
    match /data_domains/{document} {
      allow read: if isTenantScoped() && hasPermission('data.view');
      allow create: if isTenantScoped() && hasPermission('data.domain.manage');
      allow update: if isTenantScoped() && hasPermission('data.domain.manage') && request.resource.data.tenantId == resource.data.tenantId;
      allow delete: if false; 
    }

    match /data_assets/{document} {
      allow read: if isTenantScoped() && hasPermission('data.view') &&
        (resource.data.classification != 'RESTRICTED' || hasPermission('data.restricted_view')) &&
        (resource.data.campusScope == 'GLOBAL' || hasCampusAccess(resource.data.campusScope));
      allow create, update: if isTenantScoped() && hasPermission('data.asset.manage') && request.resource.data.tenantId == resource.data.tenantId;
      allow delete: if false; 
    }

    match /data_lineage_nodes/{document} {
      allow read: if isTenantScoped() && hasPermission('data.lineage.view');
      allow create, update: if isTenantScoped() && hasPermission('data.lineage.manage');
      allow delete: if false;
    }

    match /master_data_records/{document} {
      allow read: if isTenantScoped() && hasPermission('data.view');
      allow create, update: if isTenantScoped() && hasPermission('data.master.manage');
      allow delete: if false;
    }

    match /data_quality_issues/{document} {
      allow read: if isTenantScoped() && hasPermission('data.quality.view');
      allow create, update: if isTenantScoped() && hasPermission('data.quality.manage');
      allow delete: if false;
    }

    match /data_certifications/{document} {
      allow read: if isTenantScoped() && hasPermission('data.view');
      allow create: if isTenantScoped() && hasPermission('data.certification.manage');
      allow update, delete: if false; // Immutable after creation
    }

    match /data_sharing_agreements/{document} {
      allow read: if isTenantScoped() && hasPermission('data.view');
      allow create, update: if isTenantScoped() && hasPermission('data.sharing.manage');
      allow delete: if false;
    }

    match /data_governance_audit_logs/{document} {
      allow read: if isTenantScoped() && hasPermission('data.audit.view');
      allow create: if isTenantScoped();
      allow update, delete: if false; // append-only
    }
"""

# Insert before the last closing brace
last_brace = content.rfind('}')
if last_brace != -1:
    content = content[:last_brace] + new_rules + content[last_brace:]
    with open('firestore.rules', 'w') as f:
        f.write(content)
