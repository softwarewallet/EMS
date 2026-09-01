import re

with open('src/modules/index.ts', 'r') as f:
    content = f.read()

if 'StakeholderGovernanceModule,' not in content:
    content = content.replace('PrivacyGovernanceModule,', 'PrivacyGovernanceModule,\n  StakeholderGovernanceModule,')

with open('src/modules/index.ts', 'w') as f:
    f.write(content)
