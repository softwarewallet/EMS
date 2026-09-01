import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

import_stmt = "import { DataGovernanceWorkspace } from './components/dataGovernance/DataGovernanceWorkspace';\n"
if 'DataGovernanceWorkspace' not in content:
    content = content.replace("import { RouteGuard }", import_stmt + "import { RouteGuard }")

route_stmt = """
            <Route 
              path="/data-governance" 
              element={
                <RouteGuard requiredPermissions={['data.view']}>
                  <DataGovernanceWorkspace />
                </RouteGuard>
              } 
            />
"""

if '/data-governance' not in content:
    content = content.replace("{/* Fallback */}", route_stmt + "\n            {/* Fallback */}")

with open('src/App.tsx', 'w') as f:
    f.write(content)
