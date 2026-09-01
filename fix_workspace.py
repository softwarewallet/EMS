import re

with open('src/components/institutionalPerformance/InstitutionalPerformanceWorkspace.tsx', 'r') as f:
    content = f.read()

# Add selectedPlanId
content = content.replace("const [plans, setPlans] = useState<StrategicPlan[]>([]);", 
                          "const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);\n  const [plans, setPlans] = useState<StrategicPlan[]>([]);")

# Fix Object.values(activeScorecard.perspectives)
content = content.replace("Object.values(activeScorecard.perspectives).map((p) => {", 
                          "Object.values(activeScorecard.perspectives).map((p: any) => {")

with open('src/components/institutionalPerformance/InstitutionalPerformanceWorkspace.tsx', 'w') as f:
    f.write(content)
