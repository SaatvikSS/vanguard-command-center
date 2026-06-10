import json
from graph_db import NODES

port_data = []
chokepoints = []
waypoints = []

for node_id, data in NODES.items():
    lat, lon, country, region, teu, score = data
    
    # Capitalize node_id for name just as a fallback
    name = node_id.replace("_", " ").title()
    
    if region == "Chokepoint":
        chokepoints.append([node_id, name, lat, lon, 100, "HIGH"])
    elif region == "Transit":
        waypoints.append([node_id, name, lat, lon])
    else:
        # Ports
        port_data.append([node_id, name, country, lat, lon, teu, 50, 100, 10])

# We will read staticData.ts and replace the 3 arrays using regex or simple string finding
import re

with open("../frontend/src/app/data/staticData.ts", "r") as f:
    content = f.read()

# Replace PORT_DATA
port_str = "export const PORT_DATA: [string,string,string,number,number,number,number,number,number][] = " + json.dumps(port_data, indent=2) + ";"
content = re.sub(r"export const PORT_DATA: \[.*?\]\[\] = \[.*?\];", port_str, content, flags=re.DOTALL)

# Replace CHOKEPOINTS
cp_str = "export const CHOKEPOINTS: [string,string,number,number,number,string][] = " + json.dumps(chokepoints, indent=2) + ";"
content = re.sub(r"export const CHOKEPOINTS: \[.*?\]\[\] = \[.*?\];", cp_str, content, flags=re.DOTALL)

# Replace WAYPOINTS
wp_str = "export const WAYPOINTS: [string,string,number,number][] = " + json.dumps(waypoints, indent=2) + ";"
content = re.sub(r"export const WAYPOINTS: \[.*?\]\[\] = \[.*?\];", wp_str, content, flags=re.DOTALL)

with open("../frontend/src/app/data/staticData.ts", "w") as f:
    f.write(content)

print("Exported to staticData.ts")
