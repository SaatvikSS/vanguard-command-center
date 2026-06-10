import re

with open('../frontend/src/app/data/staticData.ts', 'r') as f:
    data = f.read()

# Just extract the node IDs to see what we have
nodes = re.findall(r"\['([a-zA-Z0-9_]+)'", data)
print(nodes)
