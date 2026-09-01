import re

with open("src/services/securityTestService.ts", "r") as f:
    content = f.read()

# find the last occurrence of runPhase1119VerificationSuite and keep until its closing brace
idx = content.rfind("static async runPhase1119VerificationSuite")

# find the closing brace of the class which should be right after runPhase1119VerificationSuite
end_of_1119 = content.find("    }));\n  }\n}", idx)

if end_of_1119 != -1:
    clean_content = content[:end_of_1119 + 14]
else:
    # Just cut it off before any 1120
    idx_1120 = content.find("static async runPhase1120VerificationSuite")
    if idx_1120 != -1:
        clean_content = content[:idx_1120]
        # try to find the closing brace for 1119
        last_brace = clean_content.rfind("}")
        if last_brace != -1:
            clean_content = clean_content[:last_brace]
            clean_content += "}\n"

with open("src/services/securityTestService.ts", "w") as f:
    f.write(clean_content)

