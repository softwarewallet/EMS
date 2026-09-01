import re

with open('src/services/institutionalPerformanceGovernanceService.ts', 'r') as f:
    content = f.read()

# Fix role in actor.role
content = re.sub(r'role: actor\.role \|\| \'Executive\'', r"role: 'Executive'", content)

# Fix actor.role in another place (line 1529)
content = re.sub(r'role: currentUser\.role \|\| \'Quality Officer\'', r"role: 'Quality Officer'", content)
content = re.sub(r'role: \'(.*?)\',', r"", content) # actually, maybe it's better to just delete `role: actor.role || 'Executive'` or change to a string if it's required by the interface.

# Let's check what the interface requires for `PerformanceAuditLog` and `ExecutiveDecisionSignoff`.
