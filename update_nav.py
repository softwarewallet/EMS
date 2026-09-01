import re

with open('src/config/navigationRegistry.ts', 'r') as f:
    content = f.read()

nav_item = """
  {
    id: 'nav_knowledge_governance',
    label: 'Knowledge Governance',
    icon: 'Library',
    route: '/knowledge-governance',
    moduleCode: 'mod_knowledge_governance',
    requiredPermissions: ['knowledge.view']
  },
"""

content = content.replace("export const globalNavigation: NavigationItem[] = [", "export const globalNavigation: NavigationItem[] = [\n" + nav_item)

with open('src/config/navigationRegistry.ts', 'w') as f:
    f.write(content)
