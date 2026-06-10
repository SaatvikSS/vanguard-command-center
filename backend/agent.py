import os
from typing import TypedDict, Annotated, Sequence
import operator
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langgraph.graph import StateGraph, END
# We are using Option A: Local LLM (Llama 3 via Ollama)
from langchain_ollama import ChatOllama

# Define the State for our Agentic Workflow
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    threat_event: str
    impacted_nodes: list[str]
    new_route: dict
    briefing: str
    status: str

# Initialize the local LLM (Ensures government data stays private)
# Requires Ollama running locally: `ollama run llama3`
llm = ChatOllama(model="llama3", temperature=0)

def threat_analyzer_node(state: AgentState):
    """Parses geopolitical news and identifies impacted supply chain nodes."""
    threat = state["threat_event"]
    
    prompt = (
        f"You are a sovereign supply chain intelligence agent.\n"
        f"Analyze this global event: '{threat}'.\n"
        f"Extract the specific geographical location (e.g., 'Suez Canal', 'Strait of Malacca', 'Panama Canal') that is compromised. "
        f"Respond ONLY with the exact name of the impacted node, or 'None'."
    )
    
    try:
        response = llm.invoke(prompt)
        impacted = response.content.strip()
    except Exception as e:
        print("[WARN] Ollama not responding. Entering Mock AI Mode.")
        import time
        time.sleep(1.5)
        # Match ALL chokepoints from the threat description
        keyword_map = {
            "suez": "Suez Canal",
            "malacca": "Strait of Malacca",
            "panama": "Panama Canal",
            "hormuz": "Strait of Hormuz",
            "bab": "Bab el-Mandeb", "mandeb": "Bab el-Mandeb",
            "gibraltar": "Strait of Gibraltar",
            "dover": "Strait of Dover",
            "taiwan": "Taiwan Strait",
            "cape of good hope": "Cape of Good Hope", "cape": "Cape of Good Hope",
            "sunda": "Sunda Strait",
            "lombok": "Lombok Strait",
            "tsugaru": "Tsugaru Strait",
            "mozambique": "Mozambique Channel",
            "danish": "Danish Straits",
        }
        impacted = "Unknown"
        tl = threat.lower()
        for keyword, name in keyword_map.items():
            if keyword in tl:
                impacted = name
                break
    
    return {
        "messages": [AIMessage(content=f"Threat Analyst identified impact at: {impacted}")],
        "impacted_nodes": [impacted] if impacted != "None" else [],
        "status": "threat_analyzed"
    }



def routing_orchestrator_node(state: AgentState):
    """Interfaces with Neo4j to severe the compromised node and recalculate route."""
    impacted = state.get("impacted_nodes", [])
    
    if not impacted:
        return {
            "messages": [AIMessage(content="No route recalculation needed. Network stable.")],
            "status": "stable"
        }
    
    node_name = impacted[0]
    # Normalize the node name to a standard ID matching staticData.ts
    node_id_map = {
        "suez": "suez", "panama": "panama", "malacca": "malacca",
        "hormuz": "hormuz", "bab": "babel", "mandeb": "babel",
        "gibraltar": "gibraltar", "dover": "dover", "taiwan": "taiwan_strait",
        "cape": "cape", "good hope": "cape", "sunda": "sunda",
        "lombok": "lombok", "tsugaru": "tsugaru",
        "mozambique": "mozambique", "danish": "danish",
    }
    node_id = None
    nl = node_name.lower()
    for keyword, nid in node_id_map.items():
        if keyword in nl:
            node_id = nid
            break
    if not node_id:
        node_id = nl.replace(" ", "_")

    import graph_db
    
    # 2. Determine which major route to reroute based on the SPECIFIC threat location
    detour_table = {
        "suez": {"origin": "shanghai", "dest": "rotterdam"},
        "panama": {"origin": "busan", "dest": "newyork"},
        "malacca": {"origin": "singapore", "dest": "felixstowe"},
        "hormuz": {"origin": "jebelali", "dest": "rotterdam"},
        "babel": {"origin": "jeddah", "dest": "genoa"},
        "gibraltar": {"origin": "santos", "dest": "rotterdam"},
        "dover": {"origin": "lehavre", "dest": "genoa"},
        "taiwan_strait": {"origin": "shanghai", "dest": "la"},
        "sunda": {"origin": "jakarta", "dest": "santos"},
        "lombok": {"origin": "melbourne", "dest": "piraeus"},
        "tsugaru": {"origin": "busan", "dest": "rotterdam"},
        "cape": {"origin": "jakarta", "dest": "rotterdam"},
        "mozambique": {"origin": "durban", "dest": "genoa"},
        "danish": {"origin": "hamburg", "dest": "genoa"},
    }
    
    scenario = detour_table.get(node_id, detour_table["suez"])
    origin = scenario["origin"]
    dest = scenario["dest"]
        
    original_route, original_dist = graph_db.calculate_shortest_path_dijkstra(origin, dest, None)
    detour_route, detour_dist = graph_db.calculate_shortest_path_dijkstra(origin, dest, node_id)
    
    extra_nm = detour_dist - original_dist
    if extra_nm < 0: extra_nm = 0
    extra_days = extra_nm / (14 * 24)
    
    # 3. Calculate Financial Impact
    cargo_value = 1_500_000_000
    extra_fuel = extra_days * 120 * 600
    extra_charter = extra_days * 45000
    
    high_risk_zones = {"babel", "hormuz", "black_sea"}
    insurance_surge_rate = 0.05
    for node in detour_route:
        if node in high_risk_zones:
            insurance_surge_rate = 0.15
            break
            
    insurance_surge = cargo_value * (insurance_surge_rate / 100)
    delay_penalty = cargo_value * (0.05 / 100) * extra_days
    
    diff_cost = extra_fuel + extra_charter + insurance_surge + delay_penalty
    financial_impact = f"${diff_cost / 1000000:.1f}M"
    
    optimal_dict = {
        "route": detour_route,
        "cost": detour_dist,
        "financial_impact": financial_impact,
        "blocked_node": node_id,
        "is_detour": True # Flag to change color on frontend
    }
    
    return {
        "messages": [AIMessage(content=f"Routing Agent executed Haversine Dijkstra. Re-routed via {optimal_dict['route'][2] if len(optimal_dict['route'])>2 else 'Alternate'}. Financial Impact: {financial_impact}")],
        "new_route": optimal_dict,
        "status": "route_healed"
    }

# Build the LangGraph
workflow = StateGraph(AgentState)

workflow.add_node("ThreatAnalyst", threat_analyzer_node)
workflow.add_node("RoutingOrchestrator", routing_orchestrator_node)

def intelligence_briefing_node(state: AgentState):
    """Generates a TOP SECRET intelligence briefing based on the routing results."""
    threat = state.get("threat_event", "Unknown threat")
    route_data = state.get("new_route", {})
    impacted = route_data.get("blocked_node", "Unknown")
    financial_impact = route_data.get("financial_impact", "$0")
    
    briefing = f"""# ⚠️ TOP SECRET: VANGUARD INTELLIGENCE BRIEFING

## SITUATION ASSESSMENT
**THREAT VECTOR:** {threat}
**CRITICAL INFRASTRUCTURE COMPROMISED:** {str(impacted).upper()}

## STRATEGIC IMPACT
The blockade at {str(impacted).upper()} has severed primary maritime transit corridors. Global supply chain continuity is at immediate risk.

## AUTONOMOUS REROUTING PROTOCOL INITIATED
**NEW DETOUR ROUTE:** { ' → '.join([str(n).upper() for n in route_data.get('route', [])]) if route_data.get('route') else 'N/A' }
**FINANCIAL DAMAGE:** {financial_impact}
**RECOMMENDATION:** Execute rerouting immediately. Alert regional naval commands for escort where applicable.
"""
    
    return {
        "messages": [AIMessage(content="Generated Intelligence Briefing.")],
        "briefing": briefing,
        "status": "briefing_ready"
    }

workflow.add_node("IntelligenceBriefing", intelligence_briefing_node)

workflow.set_entry_point("ThreatAnalyst")
workflow.add_edge("ThreatAnalyst", "RoutingOrchestrator")
workflow.add_edge("RoutingOrchestrator", "IntelligenceBriefing")
workflow.add_edge("IntelligenceBriefing", END)

vanguard_app = workflow.compile()

if __name__ == "__main__":
    # Test the Agent Workflow
    initial_state = {
        "messages": [],
        "threat_event": "Naval blockade and live-fire exercises detected in the Strait of Malacca.",
        "impacted_nodes": [],
        "new_route": {},
        "status": "init"
    }
    print("[INFO] Initiating Vanguard Agent Swarm...")
    for event in vanguard_app.stream(initial_state):
        for key, value in event.items():
            print(f"[{key} Node Update]: {value['messages'][-1].content}")
