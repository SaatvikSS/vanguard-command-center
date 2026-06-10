from fastapi import FastAPI, WebSocket, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import asyncio
import json
from agent import vanguard_app
import graph_db

app = FastAPI(
    title="Vanguard SCRI Command Center API",
    description="Backend engine for autonomous supply chain routing.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ThreatAlert(BaseModel):
    event_id: str
    location: str
    severity: int
    description: str

active_connections = []

@app.websocket("/ws/stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
        active_connections.remove(websocket)

async def run_agent_swarm(alert: ThreatAlert):
    initial_state = {
        "messages": [],
        "threat_event": alert.description,
        "impacted_nodes": [],
        "new_route": {},
        "status": "init"
    }
    
    for event in vanguard_app.stream(initial_state):
        for key, value in event.items():
            log_msg = value.get("messages", [])[-1].content if value.get("messages") else f"Agent {key} processing..."
            payload = json.dumps({
                "type": "log",
                "agent": key,
                "message": log_msg,
                "state": value.get("status")
            })
            for connection in active_connections:
                await connection.send_text(payload)
            await asyncio.sleep(1) # Artificial delay for cinematic UI effect
            
            if "new_route" in value and value["new_route"]:
                route_payload = json.dumps({
                    "type": "route_update",
                    "route": value["new_route"]
                })
                for connection in active_connections:
                    await connection.send_text(route_payload)
                    
            if "briefing" in value and value["briefing"]:
                briefing_payload = json.dumps({
                    "type": "briefing",
                    "briefing": value["briefing"]
                })
                for connection in active_connections:
                    await connection.send_text(briefing_payload)

@app.post("/api/threat/ingest")
async def ingest_threat(alert: ThreatAlert, background_tasks: BackgroundTasks):
    print(f"[SECURITY ALERT] Received threat at {alert.location}")
    background_tasks.add_task(run_agent_swarm, alert)
    return {"status": "Threat ingestion initiated. Swarm deployed."}

# ──────────────────────────────────────────────────────────────────────
# CARGO SIMULATOR API
# ──────────────────────────────────────────────────────────────────────

class SimulateRequest(BaseModel):
    origin: str
    destination: str
    blocked_chokepoint: str
    cargo_value: float  # USD
    fuel_cost_per_day: float = 45000  # default bulk carrier
    charter_cost_per_day: float = 25000
    insurance_rate: float = 0.05  # % of cargo value

@app.post("/api/simulate")
async def simulate_cargo(req: SimulateRequest):
    cp = req.blocked_chokepoint
    
    original_route, original_dist = graph_db.calculate_shortest_path_dijkstra(req.origin, req.destination, None)
    
    if cp == "none" or cp not in original_route:
        return {
            "blocked_chokepoint": cp,
            "normal_distance_nm": round(original_dist),
            "detour_distance_nm": 0,
            "extra_distance_nm": 0,
            "extra_transit_days": 0,
            "extra_fuel_cost": 0,
            "extra_charter_cost": 0,
            "insurance_surge": 0,
            "delay_penalty": 0,
            "total_damage": 0,
            "original_route": original_route,
            "detour_route": [],
            "ai_mitigations": [],
            "is_detour": False,
            "unaffected": cp != "none"
        }
        
    detour_route, detour_dist = graph_db.calculate_shortest_path_dijkstra(req.origin, req.destination, cp)
    
    extra_nm = detour_dist - original_dist
    if extra_nm < 0: extra_nm = 0
    
    knots = 14
    nm_per_day = knots * 24
    extra_days = round(extra_nm / nm_per_day)
    
    extra_fuel = extra_days * req.fuel_cost_per_day
    extra_charter = extra_days * req.charter_cost_per_day
    
    insurance_surge_rate = 0.45 
    insurance_surge = req.cargo_value * (insurance_surge_rate / 100)
    
    delay_penalty_rate = 0.15 
    delay_penalty = req.cargo_value * (delay_penalty_rate / 100) * extra_days
    
    total_damage = extra_fuel + extra_charter + insurance_surge + delay_penalty
    
    ai_mitigations = []
    
    if extra_days > 5 and req.cargo_value > 50_000_000:
        air_freight_premium = 1_200_000 
        ai_mitigations.append({
            "strategy": "Intermodal Air Freight Shift",
            "description": f"Divert top 15% tier of high-value, time-sensitive cargo to nearest regional air hub.",
            "time_impact": f"-{extra_days - 2} Days",
            "cost_impact": f"+${air_freight_premium:,.0f}"
        })
            
    speed_fuel_penalty = extra_fuel * 0.4
    ai_mitigations.append({
        "strategy": "Vessel Speed Optimization",
        "description": "Increase vessel transit speed from 14 knots to 19 knots across unobstructed zones to partially offset delay.",
        "time_impact": f"-{max(2, extra_days // 3)} Days",
        "cost_impact": f"+${speed_fuel_penalty:,.0f}"
    })
    
    ai_mitigations.append({
        "strategy": "Force Majeure Declaration",
        "description": "Execute automated smart contract force majeure clauses to pause daily charter rate penalties.",
        "time_impact": "0 Days",
        "cost_impact": f"-${(extra_charter * 0.8):,.0f}"
    })
    
    return {
        "blocked_chokepoint": cp,
        "normal_distance_nm": round(original_dist),
        "detour_distance_nm": round(detour_dist),
        "extra_distance_nm": round(extra_nm),
        "extra_transit_days": extra_days,
        "extra_fuel_cost": round(extra_fuel),
        "extra_charter_cost": round(extra_charter),
        "insurance_surge": round(insurance_surge),
        "delay_penalty": round(delay_penalty),
        "total_damage": round(total_damage),
        "original_route": original_route,
        "detour_route": detour_route,
        "ai_mitigations": ai_mitigations,
        "is_detour": True,
    }

class WargameRequest(BaseModel):
    blocked_chokepoints: list[str]
    cargo_value: float = 1_842_000_000_000  # $1.84 Trillion global freight at risk

@app.post("/api/simulate/wargame")
async def wargame(req: WargameRequest):
    """Simulate cascading failures across multiple chokepoints simultaneously."""
    results = []
    total_global_damage = 0
    affected_routes_count = 0
    
    # Global trade percentages flowing through each chokepoint
    trade_share = {
        "suez": 12, "malacca": 25, "panama": 5, "hormuz": 21,
        "babel": 9, "gibraltar": 8, "dover": 6, "taiwan_strait": 15,
        "sunda": 3, "lombok": 2, "tsugaru": 4, "cape": 2,
        "mozambique": 1, "danish": 4,
    }
    
    for cp in req.blocked_chokepoints:
        share = trade_share.get(cp, 3)
        affected_value = req.cargo_value * (share / 100)
        
        # Determine a typical major route affected by this chokepoint to draw a detour
        major_routes = {
            "suez": ("shanghai", "rotterdam"),
            "panama": ("busan", "newyork"),
            "malacca": ("singapore", "felixstowe"),
            "hormuz": ("jebelali", "rotterdam"),
            "babel": ("jeddah", "genoa"),
            "gibraltar": ("santos", "rotterdam"),
            "dover": ("lehavre", "genoa"),
            "taiwan_strait": ("shanghai", "la"),
            "sunda": ("jakarta", "santos"),
            "lombok": ("melbourne", "piraeus"),
            "tsugaru": ("busan", "rotterdam"),
            "cape": ("jakarta", "rotterdam"),
            "mozambique": ("durban", "genoa"),
            "danish": ("hamburg", "genoa"),
        }
        origin, dest = major_routes.get(cp, ("shanghai", "rotterdam"))
        
        _, original_dist = graph_db.calculate_shortest_path_dijkstra(origin, dest, None)
        detour_route, detour_dist = graph_db.calculate_shortest_path_dijkstra(origin, dest, cp)
        
        extra_nm = detour_dist - original_dist
        if extra_nm < 0: extra_nm = 0
        extra_days = round(extra_nm / (14 * 24))
        
        extra_fuel = extra_days * 45000 * 500  # 500 ships per day rerouted
        insurance_surge = affected_value * 0.045  # Massive global spike
        delay_penalty = affected_value * 0.015 * extra_days
        damage = extra_fuel + insurance_surge + delay_penalty
        
        total_global_damage += damage
        affected_routes_count += share
        
        results.append({
            "chokepoint": cp,
            "trade_share_pct": share,
            "affected_value": round(affected_value),
            "damage": round(damage),
            "extra_days": extra_days,
            "detour_route": detour_route,
        })
    
    return {
        "blocked": req.blocked_chokepoints,
        "total_global_damage": round(total_global_damage),
        "global_trade_disrupted_pct": min(affected_routes_count, 100),
        "collapse_index": "CATASTROPHIC" if affected_routes_count > 40 else "SEVERE" if affected_routes_count > 20 else "ELEVATED",
        "details": results,
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
