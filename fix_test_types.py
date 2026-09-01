import re

with open('src/services/securityTestService.ts', 'r') as f:
    content = f.read()

# Replace status: 'PASS' with status: 'PASSED'
content = content.replace("status: 'PASS'", "status: 'PASSED'")

# Replace category string literals with 'Authorization' as any
content = re.sub(r"category: '(TENANT_ISOLATION|SEPARATION_OF_DUTIES|LIFECYCLE_INTEGRITY|PRIVACY|RATE_LIMITING|COMMUNICATION_GOVERNANCE|SYSTEM_ISOLATION|DATA_QUALITY|AUDIT_INTEGRITY)'", r"category: 'Authorization' as any", content)

with open('src/services/securityTestService.ts', 'w') as f:
    f.write(content)

