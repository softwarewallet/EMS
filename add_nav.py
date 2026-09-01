import re

with open('src/config/navigationRegistry.ts', 'r') as f:
    content = f.read()

nav_item = """
  {
    id: 'nav_stakeholder_governance',
    label: 'Stakeholder Governance',
    icon: 'Globe',
    route: '/stakeholder-governance',
    moduleContext: 'mod_stakeholder_governance',
    requiredRoles: ['admin', 'executive', 'communications_officer', 'pr_officer', 'governance_officer'],
    requiredPermissions: ['stakeholder.view'],
    category: 'Governance'
  },
"""

if 'nav_stakeholder_governance' not in content:
    content = content.replace("category: 'Governance'\n  },", "category: 'Governance'\n  }," + nav_item)

with open('src/config/navigationRegistry.ts', 'w') as f:
    f.write(content)
