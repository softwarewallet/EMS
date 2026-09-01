import re

with open('src/config/navigationRegistry.ts', 'r') as f:
    content = f.read()

nav_item = """
  {
    id: 'nav_data_governance',
    label: 'Data Governance',
    icon: 'DatabaseZap',
    route: '/data-governance',
    moduleCode: 'mod_data_governance',
    requiredPermissions: ['data.view']
  },
"""

content = content.replace("export const globalNavigation: NavigationItem[] = [", "export const globalNavigation: NavigationItem[] = [\n" + nav_item)

with open('src/config/navigationRegistry.ts', 'w') as f:
    f.write(content)
