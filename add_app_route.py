import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

import_stmt = "import { KnowledgeGovernanceWorkspace } from './components/knowledgeGovernance/KnowledgeGovernanceWorkspace';\n"
if 'KnowledgeGovernanceWorkspace' not in content:
    content = content.replace("import { RouteGuard }", import_stmt + "import { RouteGuard }")

route_stmt = """
            <Route 
              path="/knowledge-governance" 
              element={
                <RouteGuard requiredPermissions={['knowledge.view']}>
                  <KnowledgeGovernanceWorkspace />
                </RouteGuard>
              } 
            />
"""

if '/knowledge-governance' not in content:
    content = content.replace("{/* Fallback */}", route_stmt + "\n            {/* Fallback */}")

with open('src/App.tsx', 'w') as f:
    f.write(content)
