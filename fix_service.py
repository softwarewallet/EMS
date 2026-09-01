import re

with open('src/services/institutionalPerformanceGovernanceService.ts', 'r') as f:
    content = f.read()

# Fix let newStatus = decision.status;
content = content.replace("let newStatus = decision.status;", "let newStatus: import('../types/institutionalPerformanceGovernance').ExecutiveDecisionStatus = decision.status;")

# Fix role: actor.role || 'Executive'
content = content.replace("role: actor.role || 'Executive',", "role: 'Executive',")

# Fix role: 'provost'
content = content.replace("role: 'provost'", "")

with open('src/services/institutionalPerformanceGovernanceService.ts', 'w') as f:
    f.write(content)
