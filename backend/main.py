from fastapi import FastAPI, WebSocket, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import asyncio
import json
from agent import vanguard_app

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

# Avg nautical miles between waypoints (rough estimates for cost calculation)
DISTANCE_TABLE = {
    "suez": {"normal_nm": 8400, "detour_nm": 13200, "extra_days": 12},
    "panama": {"normal_nm": 9200, "detour_nm": 16800, "extra_days": 14},
    "malacca": {"normal_nm": 7600, "detour_nm": 12400, "extra_days": 10},
    "hormuz": {"normal_nm": 5800, "detour_nm": 14200, "extra_days": 18},
    "babel": {"normal_nm": 6200, "detour_nm": 13600, "extra_days": 16},
    "gibraltar": {"normal_nm": 4200, "detour_nm": 6800, "extra_days": 5},
    "dover": {"normal_nm": 2200, "detour_nm": 5400, "extra_days": 6},
    "taiwan_strait": {"normal_nm": 5400, "detour_nm": 7200, "extra_days": 4},
    "sunda": {"normal_nm": 8800, "detour_nm": 10200, "extra_days": 3},
    "lombok": {"normal_nm": 8200, "detour_nm": 9600, "extra_days": 3},
    "tsugaru": {"normal_nm": 6400, "detour_nm": 11800, "extra_days": 12},
    "cape": {"normal_nm": 11200, "detour_nm": 9400, "extra_days": -2},
    "mozambique": {"normal_nm": 7800, "detour_nm": 11400, "extra_days": 8},
    "danish": {"normal_nm": 1800, "detour_nm": 4600, "extra_days": 6},
}

REGION_MAP = {
    # Asia
    "shanghai": "east_asia", "ningbo": "east_asia", "shenzhen": "east_asia", "qingdao": "east_asia", "guangzhou": "east_asia", "tianjin": "east_asia", "dalian": "east_asia", "xiamen": "east_asia", "hong_kong": "east_asia", "kaohsiung": "east_asia", "keelung": "east_asia", "tokyo": "east_asia", "yokohama": "east_asia", "kobe": "east_asia", "nagoya": "east_asia", "busan": "east_asia", "incheon": "east_asia",
    "singapore": "se_asia", "portklang": "se_asia", "tanjungpelepas": "se_asia", "laemchabang": "se_asia", "hochiminh": "se_asia", "haiphong": "se_asia", "manila": "se_asia", "jakarta": "se_asia", "surabaya": "se_asia",
    "mumbai": "south_asia", "mundra": "south_asia", "chennai": "south_asia", "colombo": "south_asia", "chittagong": "south_asia", "karachi": "south_asia",
    "jebelali": "middle_east", "salalah": "middle_east", "jeddah": "middle_east", "hamad": "middle_east", "bandarabbas": "middle_east", "djibouti": "middle_east",
    # Europe
    "rotterdam": "europe_north", "antwerp": "europe_north", "hamburg": "europe_north", "bremerhaven": "europe_north", "felixstowe": "europe_north", "southampton": "europe_north", "lehavre": "europe_north", "gdansk": "europe_north", "gothenburg": "europe_north", "stpetersburg": "europe_north",
    "piraeus": "europe_south", "algeciras": "europe_south", "barcelona": "europe_south", "valencia": "europe_south", "genoa": "europe_south", "gioia_tauro": "europe_south", "tangier": "europe_south", "portSaid": "europe_south",
    # Africa
    "durban": "africa_south", "capetown": "africa_south", "mombasa": "africa_east", "lagos": "west_africa",
    # Americas
    "la": "us_west", "longbeach": "us_west", "vancouver": "us_west", "manzanillo": "us_west", "balboa": "us_west", "callao": "us_west",
    "newyork": "us_east", "savannah": "us_east", "houston": "us_east", "charleston": "us_east", "montreal": "us_east", "colon": "us_east",
    "santos": "south_america_east", "cartagena": "south_america_east", "buenosaires": "south_america_east",
    # Oceania
    "melbourne": "oceania", "sydney": "oceania", "brisbane": "oceania", "auckland": "oceania", "tauranga": "oceania",
}

GRAPH = {
    "east_asia": ["taiwan_strait", "tsugaru", "malacca", "sunda"],
    "se_asia": ["taiwan_strait", "malacca", "sunda", "lombok"],
    "south_asia": ["malacca", "babel", "hormuz", "madagascar_east"],
    "middle_east": ["hormuz", "babel"],
    "europe_north": ["dover", "danish"],
    "europe_south": ["gibraltar", "suez", "cape_st_vincent"],
    "africa_east": ["babel", "madagascar_east", "mozambique"],
    "africa_south": ["cape", "mozambique", "namibia_coast"],
    "west_africa": ["namibia_coast", "canary_islands"],
    "us_west": ["panama", "tsugaru"],
    "us_east": ["panama", "canary_islands", "dover"],
    "south_america_east": ["cape_horn", "canary_islands", "santos"],
    "oceania": ["lombok", "cape_horn"],

    "taiwan_strait": ["east_asia", "se_asia"],
    "malacca": ["se_asia", "south_asia"],
    "sunda": ["se_asia", "madagascar_east", "cape"],
    "lombok": ["se_asia", "oceania"],
    "tsugaru": ["east_asia", "us_west"],
    
    "hormuz": ["middle_east", "south_asia"],
    "babel": ["middle_east", "suez", "south_asia", "africa_east"],
    "suez": ["babel", "europe_south"],
    
    "madagascar_east": ["south_asia", "sunda", "africa_east", "mozambique", "cape"],
    "mozambique": ["madagascar_east", "africa_south"],
    "cape": ["madagascar_east", "africa_south", "namibia_coast", "cape_horn", "sunda"],
    "namibia_coast": ["cape", "africa_south", "west_africa"],
    "canary_islands": ["west_africa", "us_east", "south_america_east", "cape_st_vincent"],
    
    "cape_st_vincent": ["canary_islands", "gibraltar", "dover", "europe_south"],
    "gibraltar": ["cape_st_vincent", "europe_south"],
    "dover": ["cape_st_vincent", "europe_north", "us_east"],
    "danish": ["europe_north"],
    
    "panama": ["us_west", "us_east"],
    "cape_horn": ["oceania", "south_america_east", "cape"],
}

VALID_WAYPOINTS = {
    "malacca", "suez", "panama", "hormuz", "babel", "gibraltar", "dover", "taiwan_strait",
    "cape", "sunda", "lombok", "tsugaru", "mozambique", "danish",
    "west_africa", "namibia_coast", "madagascar_east", "cape_horn", "canary_islands", "cape_st_vincent"
}

def calculate_shortest_path(origin, dest, blocked=None):
    start = REGION_MAP.get(origin, origin)
    end = REGION_MAP.get(dest, dest)
    
    if start == end:
        return [origin, dest]
        
    queue = [[start]]
    visited = set([start])
    if blocked:
        visited.add(blocked)
        
    while queue:
        path = queue.pop(0)
        node = path[-1]
        
        if node == end:
            route = [origin]
            for n in path[1:-1]:
                if n in VALID_WAYPOINTS:
                    route.append(n)
            route.append(dest)
            return route
            
        for neighbor in GRAPH.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(path + [neighbor])
    return [origin, dest]

@app.post("/api/simulate")
async def simulate_cargo(req: SimulateRequest):
    cp = req.blocked_chokepoint
    
    original_route = calculate_shortest_path(req.origin, req.destination, None)
    
    if cp == "none" or cp not in original_route:
        # Rough distance calculation just for optimal path visual context
        normal_distance = len(original_route) * 1400  # rough estimate
        return {
            "blocked_chokepoint": cp,
            "normal_distance_nm": normal_distance,
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
        
    dist = DISTANCE_TABLE.get(cp, {"normal_nm": 8000, "detour_nm": 12000, "extra_days": 8})
    
    extra_nm = dist["detour_nm"] - dist["normal_nm"]
    extra_days = dist["extra_days"]
    extra_fuel = extra_days * req.fuel_cost_per_day
    extra_charter = extra_days * req.charter_cost_per_day
    
    # Insurance surges during crises (war risk premium goes from 0.05% to ~0.5%)
    insurance_surge_rate = 0.45  # percentage points increase
    insurance_surge = req.cargo_value * (insurance_surge_rate / 100)
    
    # Goods delay penalty (typically 0.1-0.5% of cargo value per day)
    delay_penalty_rate = 0.15  # % per day
    delay_penalty = req.cargo_value * (delay_penalty_rate / 100) * extra_days
    
    total_damage = extra_fuel + extra_charter + insurance_surge + delay_penalty
    
    detour_route = calculate_shortest_path(req.origin, req.destination, cp)
    
    # Generate dynamic AI mitigations based on extra days and distance
    ai_mitigations = []
    
    # Strategy 1: Modal Shift if delay is severe
    if extra_days > 7:
        air_shift_cost = req.cargo_value * 0.002 # 0.2% cost premium
        if air_shift_cost < delay_penalty:
            ai_mitigations.append({
                "strategy": "Intermodal Air Freight Shift",
                "description": "Shift top 15% tier of high-value cargo to air freight via regional hub prior to blockade zone.",
                "time_impact": f"-{extra_days - 2} Days",
                "cost_impact": f"+${air_shift_cost:,.0f}"
            })
            
    # Strategy 2: Speed Optimization (Slow Steaming Reverse)
    speed_fuel_penalty = extra_fuel * 0.4
    ai_mitigations.append({
        "strategy": "Vessel Speed Optimization",
        "description": "Increase vessel transit speed from 14 knots to 19 knots across unobstructed zones to partially offset delay.",
        "time_impact": f"-{max(2, extra_days // 3)} Days",
        "cost_impact": f"+${speed_fuel_penalty:,.0f}"
    })
    
    # Strategy 3: Insurance / Contractual
    ai_mitigations.append({
        "strategy": "Force Majeure Declaration",
        "description": "Execute automated smart contract force majeure clauses to pause daily charter rate penalties.",
        "time_impact": "0 Days",
        "cost_impact": f"-${(extra_charter * 0.8):,.0f}"
    })
    
    return {
        "blocked_chokepoint": cp,
        "normal_distance_nm": dist["normal_nm"],
        "detour_distance_nm": dist["detour_nm"],
        "extra_distance_nm": extra_nm,
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
        dist = DISTANCE_TABLE.get(cp, {"normal_nm": 8000, "detour_nm": 12000, "extra_days": 8})
        share = trade_share.get(cp, 3)
        affected_value = req.cargo_value * (share / 100)
        
        extra_days = dist["extra_days"]
        extra_fuel = extra_days * 45000 * 500  # 500 ships per day rerouted
        insurance_surge = affected_value * 0.045  # Massive global spike
        delay_penalty = affected_value * 0.015 * extra_days
        damage = extra_fuel + insurance_surge + delay_penalty
        
        total_global_damage += damage
        affected_routes_count += share
        
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
        detour_route = calculate_shortest_path(origin, dest, cp)
        
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
