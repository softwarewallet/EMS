with open('src/modules/index.ts', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "  try {}" in line:
        new_lines.append("  } catch (err) {}\n}\n")
    else:
        new_lines.append(line)

with open('src/modules/index.ts', 'w') as f:
    f.writelines(new_lines)
