import math
import heapq

# --- 1. NODE DEFINITIONS & METADATA (LAT, LON, COUNTRY, REGION, TEU, STRATEGIC_SCORE) ---
NODES = {
    # === CHINA ===
    "shanghai": (31.23, 121.47, "CHN", "Asia", 47.3, 10),
    "ningbo": (29.87, 121.55, "CHN", "Asia", 33.3, 9),
    "shenzhen": (22.54, 114.06, "CHN", "Asia", 30.0, 9),
    "guangzhou": (23.10, 113.26, "CHN", "Asia", 24.2, 8),
    "qingdao": (36.07, 120.38, "CHN", "Asia", 25.0, 8),
    "tianjin": (38.97, 117.73, "CHN", "Asia", 21.0, 8),
    "xiamen": (24.47, 118.08, "CHN", "Asia", 12.0, 7),
    "dalian": (38.91, 121.60, "CHN", "Asia", 8.5, 7),
    "hong_kong": (22.29, 114.15, "HKG", "Asia", 14.8, 9),

    # === INDIA ===
    "mumbai": (18.95, 72.95, "IND", "South Asia", 6.3, 8),
    "jnpt": (18.95, 72.95, "IND", "South Asia", 5.0, 8), # Near Mumbai
    "mundra": (22.74, 69.72, "IND", "South Asia", 7.0, 8),
    "chennai": (13.10, 80.29, "IND", "South Asia", 4.2, 7),
    "visakhapatnam": (17.68, 83.21, "IND", "South Asia", 2.0, 6),
    "kochi": (9.93, 76.26, "IND", "South Asia", 1.5, 6),
    "kandla": (23.03, 70.21, "IND", "South Asia", 2.5, 7),
    "tuticorin": (8.76, 78.13, "IND", "South Asia", 1.0, 5),
    "kolkata": (22.57, 88.36, "IND", "South Asia", 1.2, 5),

    # === JAPAN ===
    "tokyo": (35.65, 139.77, "JPN", "Asia", 4.5, 8),
    "yokohama": (35.44, 139.64, "JPN", "Asia", 2.9, 7),
    "kobe": (34.68, 135.20, "JPN", "Asia", 2.8, 7),
    "osaka": (34.69, 135.50, "JPN", "Asia", 2.5, 7),
    "nagoya": (35.08, 136.88, "JPN", "Asia", 2.7, 7),
    "hakata": (33.59, 130.40, "JPN", "Asia", 1.0, 6),

    # === SOUTH KOREA ===
    "busan": (35.10, 129.04, "KOR", "Asia", 22.7, 9),
    "incheon": (37.45, 126.58, "KOR", "Asia", 3.4, 7),
    "ulsan": (35.53, 129.31, "KOR", "Asia", 2.0, 7),
    "gwangyang": (34.94, 127.69, "KOR", "Asia", 2.5, 7),

    # === SE ASIA ===
    "singapore": (1.26, 103.84, "SGP", "SE Asia", 39.0, 10),
    "portklang": (2.99, 101.39, "MYS", "SE Asia", 13.2, 8),
    "tanjungpelepas": (1.36, 103.55, "MYS", "SE Asia", 11.2, 8),
    "jakarta": (-6.10, 106.88, "IDN", "SE Asia", 7.6, 7),
    "surabaya": (-7.20, 112.73, "IDN", "SE Asia", 3.8, 6),
    "belawan": (3.78, 98.68, "IDN", "SE Asia", 1.5, 6),
    "hochiminh": (10.76, 106.66, "VNM", "SE Asia", 7.5, 7),
    "haiphong": (20.86, 106.68, "VNM", "SE Asia", 5.8, 6),
    "laemchabang": (13.08, 100.88, "THA", "SE Asia", 8.1, 7),
    "bangkok": (13.75, 100.50, "THA", "SE Asia", 1.5, 6),
    "manila": (14.58, 120.97, "PHL", "SE Asia", 5.2, 7),
    "cebu": (10.31, 123.89, "PHL", "SE Asia", 1.0, 5),
    "kaohsiung": (22.62, 120.27, "TWN", "Asia", 9.8, 8),
    "keelung": (25.13, 121.74, "TWN", "Asia", 2.4, 6),

    # === EUROPE ===
    "rotterdam": (51.95, 4.14, "NLD", "Europe", 14.4, 10),
    "amsterdam": (52.36, 4.90, "NLD", "Europe", 1.5, 7),
    "antwerp": (51.26, 4.40, "BEL", "Europe", 13.5, 9),
    "hamburg": (53.54, 9.99, "DEU", "Europe", 8.7, 9),
    "bremerhaven": (53.54, 8.58, "DEU", "Europe", 4.8, 8),
    "lehavre": (49.48, 0.11, "FRA", "Europe", 3.0, 8),
    "marseille": (43.29, 5.36, "FRA", "Europe", 2.0, 7),
    "valencia": (39.45, -0.32, "ESP", "Europe", 5.6, 8),
    "barcelona": (41.35, 2.17, "ESP", "Europe", 3.6, 7),
    "algeciras": (36.13, -5.45, "ESP", "Europe", 5.1, 8),
    "genoa": (44.41, 8.93, "ITA", "Europe", 2.6, 7),
    "trieste": (45.64, 13.76, "ITA", "Europe", 1.5, 6),
    "naples": (40.85, 14.26, "ITA", "Europe", 1.0, 5),
    "felixstowe": (51.96, 1.35, "GBR", "Europe", 3.8, 8),
    "southampton": (50.89, -1.40, "GBR", "Europe", 2.0, 7),
    "london_gateway": (51.50, 0.45, "GBR", "Europe", 2.5, 7),
    "piraeus": (37.94, 23.64, "GRC", "Europe", 5.4, 8),
    "istanbul": (41.00, 28.97, "TUR", "Europe", 3.5, 8),
    "izmir": (38.42, 27.14, "TUR", "Europe", 1.5, 6),
    "stpetersburg": (59.93, 30.30, "RUS", "Europe", 2.2, 7),
    "novorossiysk": (44.71, 37.76, "RUS", "Europe", 1.0, 6),
    "vladivostok": (43.11, 131.87, "RUS", "Asia", 1.5, 7),

    # === NORTH AMERICA ===
    "la": (33.74, -118.27, "USA", "North America", 9.9, 10),
    "longbeach": (33.75, -118.19, "USA", "North America", 9.0, 9),
    "oakland": (37.80, -122.27, "USA", "North America", 2.5, 8),
    "seattle": (47.60, -122.33, "USA", "North America", 3.0, 8),
    "houston": (29.76, -95.27, "USA", "North America", 3.4, 8),
    "newyork": (40.67, -74.04, "USA", "North America", 8.4, 9),
    "savannah": (32.08, -81.09, "USA", "North America", 5.6, 8),
    "charleston": (32.78, -79.93, "USA", "North America", 2.8, 7),
    "miami": (25.76, -80.19, "USA", "North America", 1.5, 7),
    "norfolk": (36.85, -76.28, "USA", "North America", 3.0, 8),
    "vancouver": (49.28, -123.11, "CAN", "North America", 3.5, 8),
    "montreal": (45.50, -73.55, "CAN", "North America", 1.7, 7),
    "halifax": (44.64, -63.57, "CAN", "North America", 0.5, 6),
    "prince_rupert": (54.31, -130.32, "CAN", "North America", 1.0, 6),
    "manzanillo": (19.05, -104.32, "MEX", "North America", 3.4, 7),
    "veracruz": (19.17, -96.13, "MEX", "North America", 1.5, 6),
    "lazaro_cardenas": (17.95, -102.20, "MEX", "North America", 1.5, 6),

    # === SOUTH AMERICA ===
    "santos": (-23.96, -46.30, "BRA", "South America", 4.2, 8),
    "rio_de_janeiro": (-22.90, -43.20, "BRA", "South America", 1.5, 6),
    "paranagua": (-25.52, -48.50, "BRA", "South America", 1.0, 6),
    "buenosaires": (-34.60, -58.38, "ARG", "South America", 1.4, 7),
    "valparaiso": (-33.04, -71.62, "CHL", "South America", 1.0, 6),
    "san_antonio": (-33.58, -71.60, "CHL", "South America", 1.5, 6),
    "callao": (-12.05, -77.15, "PER", "South America", 2.6, 7),
    "cartagena": (10.39, -75.51, "COL", "South America", 3.2, 7),

    # === MIDDLE EAST ===
    "dubai": (25.26, 55.30, "UAE", "Middle East", 2.0, 7),
    "jebelali": (25.01, 55.06, "UAE", "Middle East", 14.0, 9),
    "abu_dhabi": (24.45, 54.37, "UAE", "Middle East", 2.5, 7),
    "jeddah": (21.48, 39.17, "SAU", "Middle East", 4.8, 8),
    "dammam": (26.42, 50.10, "SAU", "Middle East", 2.0, 7),
    "salalah": (16.94, 54.00, "OMN", "Middle East", 4.6, 8),
    "sohar": (24.36, 56.73, "OMN", "Middle East", 1.5, 6),
    "hamad": (25.02, 51.58, "QAT", "Middle East", 2.8, 7),
    "shuwaikh": (29.34, 47.93, "KWT", "Middle East", 1.5, 6),
    "umm_qasr": (30.04, 47.93, "IRQ", "Middle East", 1.0, 6),

    # === AFRICA ===
    "durban": (-29.87, 31.03, "ZAF", "Africa", 2.8, 8),
    "capetown": (-33.90, 18.43, "ZAF", "Africa", 0.8, 7),
    "port_elizabeth": (-33.96, 25.60, "ZAF", "Africa", 0.5, 6),
    "alexandria": (31.20, 29.91, "EGY", "Africa", 2.0, 7),
    "portSaid": (31.26, 32.31, "EGY", "Africa", 3.8, 8),
    "tangier": (35.87, -5.50, "MAR", "Africa", 7.2, 8),
    "lagos": (6.44, 3.38, "NGA", "Africa", 1.2, 7),
    "mombasa": (-4.04, 39.67, "KEN", "Africa", 1.4, 7),
    "dar_es_salaam": (-6.79, 39.20, "TZA", "Africa", 1.0, 6),
    "djibouti": (11.59, 43.15, "DJI", "Africa", 1.0, 7),

    # === OCEANIA ===
    "sydney": (-33.96, 151.21, "AUS", "Oceania", 2.6, 8),
    "melbourne": (-37.82, 144.92, "AUS", "Oceania", 2.8, 8),
    "brisbane": (-27.38, 153.17, "AUS", "Oceania", 1.4, 7),
    "fremantle": (-32.05, 115.74, "AUS", "Oceania", 0.8, 6),
    "adelaide": (-34.92, 138.60, "AUS", "Oceania", 0.5, 6),
    "auckland": (-36.84, 174.77, "NZL", "Oceania", 0.9, 6),
    "tauranga": (-37.65, 176.17, "NZL", "Oceania", 1.2, 6),

    # === STRATEGIC CHOKEPOINTS ===
    "malacca": (2.5, 101.5, "INT", "Chokepoint", 0, 10),
    "suez": (30.0, 32.5, "EGY", "Chokepoint", 0, 10),
    "panama": (9.1, -79.7, "PAN", "Chokepoint", 0, 10),
    "hormuz": (26.5, 56.2, "INT", "Chokepoint", 0, 10),
    "babel": (12.6, 43.3, "INT", "Chokepoint", 0, 10),
    "gibraltar": (35.9, -5.6, "INT", "Chokepoint", 0, 10),
    "dover": (51.0, 1.5, "INT", "Chokepoint", 0, 9),
    "bosporus": (41.0, 29.0, "TUR", "Chokepoint", 0, 9),
    "cape": (-34.4, 18.5, "ZAF", "Chokepoint", 0, 8),
    "sunda": (-6.1, 105.8, "IDN", "Chokepoint", 0, 8),
    "lombok": (-8.4, 115.7, "IDN", "Chokepoint", 0, 8),
    "bering_strait": (65.9, -169.6, "INT", "Chokepoint", 0, 7),
    "taiwan_strait": (24.0, 119.5, "INT", "Chokepoint", 0, 9),
    "danish": (55.7, 12.6, "INT", "Chokepoint", 0, 8),

    # === OCEAN TRANSIT NODES ===
    "north_pacific": (45.0, -160.0, "OCEAN", "Transit", 0, 0),
    "central_pacific": (15.0, -150.0, "OCEAN", "Transit", 0, 0),
    "south_pacific": (-20.0, -130.0, "OCEAN", "Transit", 0, 0),
    "north_atlantic": (45.0, -30.0, "OCEAN", "Transit", 0, 0),
    "mid_atlantic": (15.0, -40.0, "OCEAN", "Transit", 0, 0),
    "south_atlantic": (-25.0, -20.0, "OCEAN", "Transit", 0, 0),
    "arabian_sea": (15.0, 65.0, "OCEAN", "Transit", 0, 0),
    "bay_of_bengal": (15.0, 90.0, "OCEAN", "Transit", 0, 0),
    "mediterranean_east": (34.0, 25.0, "OCEAN", "Transit", 0, 0),
    "mediterranean_west": (38.0, 5.0, "OCEAN", "Transit", 0, 0),
    "southern_ocean": (-55.0, 0.0, "OCEAN", "Transit", 0, 0),
    "cape_horn": (-56.0, -67.0, "OCEAN", "Transit", 0, 0),
    "south_china_sea": (15.0, 115.0, "OCEAN", "Transit", 0, 0),
    "philippine_sea": (20.0, 130.0, "OCEAN", "Transit", 0, 0),
    "indian_ocean_central": (-10.0, 75.0, "OCEAN", "Transit", 0, 0),
    "indian_ocean_south": (-30.0, 60.0, "OCEAN", "Transit", 0, 0),
    "black_sea": (43.0, 34.0, "OCEAN", "Transit", 0, 0),
    "gulf_of_mexico": (25.0, -90.0, "OCEAN", "Transit", 0, 0),
}

# --- 2. EXPLICIT EDGE DEFINITIONS ---
# Ensuring no overland ghost-routing. Ports connect strictly via logic to oceans and neighbors.

EDGES = [
    # East Asia
    ("vladivostok", "hakata"), ("vladivostok", "busan"),
    ("busan", "incheon"), ("busan", "ulsan"), ("ulsan", "gwangyang"),
    ("gwangyang", "hakata"), ("busan", "tokyo"),
    ("tokyo", "yokohama"), ("yokohama", "nagoya"), ("nagoya", "osaka"),
    ("osaka", "kobe"), ("kobe", "hakata"), ("tokyo", "north_pacific"),
    ("dalian", "tianjin"), ("tianjin", "qingdao"), ("qingdao", "shanghai"),
    ("shanghai", "ningbo"), ("ningbo", "taiwan_strait"),
    ("shanghai", "busan"), ("shanghai", "hakata"),
    ("taiwan_strait", "xiamen"), ("xiamen", "shenzhen"),
    ("shenzhen", "guangzhou"), ("guangzhou", "hong_kong"),
    ("hong_kong", "south_china_sea"),
    ("taiwan_strait", "keelung"), ("keelung", "kaohsiung"),
    ("kaohsiung", "manila"), ("manila", "cebu"), ("cebu", "philippine_sea"),
    ("kobe", "philippine_sea"), ("taiwan_strait", "philippine_sea"),
    ("bering_strait", "north_pacific"), ("bering_strait", "vladivostok"),
    
    # SE Asia
    ("south_china_sea", "haiphong"), ("south_china_sea", "hochiminh"),
    ("hochiminh", "laemchabang"), ("laemchabang", "bangkok"),
    ("hochiminh", "singapore"), ("south_china_sea", "manila"),
    ("singapore", "tanjungpelepas"), ("tanjungpelepas", "malacca"),
    ("malacca", "portklang"), ("malacca", "belawan"),
    ("singapore", "jakarta"), ("jakarta", "surabaya"),
    ("jakarta", "sunda"), ("surabaya", "lombok"),
    ("sunda", "indian_ocean_central"), ("lombok", "indian_ocean_central"),
    
    # South Asia & Indian Ocean
    ("malacca", "bay_of_bengal"), ("bay_of_bengal", "kolkata"),
    ("kolkata", "chittagong"), ("bay_of_bengal", "visakhapatnam"),
    ("visakhapatnam", "chennai"), ("chennai", "tuticorin"),
    ("tuticorin", "colombo"), ("bay_of_bengal", "colombo"),
    ("colombo", "kochi"), ("kochi", "arabian_sea"),
    ("arabian_sea", "mumbai"), ("mumbai", "jnpt"), ("jnpt", "mundra"),
    ("mundra", "kandla"), ("kandla", "karachi"), ("karachi", "hormuz"),
    ("arabian_sea", "hormuz"), ("colombo", "indian_ocean_central"),
    ("indian_ocean_central", "arabian_sea"),
    
    # Middle East
    ("hormuz", "bandarabbas"), ("hormuz", "abu_dhabi"),
    ("abu_dhabi", "jebelali"), ("jebelali", "dubai"),
    ("dubai", "dammam"), ("dammam", "hamad"),
    ("hamad", "shuwaikh"), ("shuwaikh", "umm_qasr"),
    ("arabian_sea", "sohar"), ("sohar", "salalah"),
    ("salalah", "babel"), ("babel", "djibouti"),
    ("babel", "jeddah"), ("jeddah", "suez"),
    
    # Africa
    ("arabian_sea", "mombasa"), ("mombasa", "dar_es_salaam"),
    ("dar_es_salaam", "durban"), ("indian_ocean_south", "durban"),
    ("indian_ocean_central", "indian_ocean_south"),
    ("colombo", "indian_ocean_south"),
    ("durban", "port_elizabeth"), ("port_elizabeth", "cape"),
    ("cape", "capetown"), ("capetown", "south_atlantic"),
    ("south_atlantic", "lagos"), ("south_atlantic", "tangier"),
    ("suez", "portSaid"), ("portSaid", "alexandria"),
    ("alexandria", "mediterranean_east"),
    
    # Mediterranean & Europe
    ("mediterranean_east", "piraeus"), ("mediterranean_east", "bosporus"),
    ("bosporus", "istanbul"), ("istanbul", "izmir"), ("bosporus", "black_sea"),
    ("black_sea", "novorossiysk"),
    ("mediterranean_east", "mediterranean_west"),
    ("mediterranean_west", "trieste"), ("trieste", "genoa"),
    ("genoa", "marseille"), ("marseille", "barcelona"),
    ("barcelona", "valencia"), ("mediterranean_west", "naples"),
    ("naples", "genoa"), ("valencia", "algeciras"),
    ("mediterranean_west", "algeciras"), ("algeciras", "gibraltar"),
    ("gibraltar", "tangier"), ("gibraltar", "mid_atlantic"),
    ("gibraltar", "north_atlantic"), ("mid_atlantic", "north_atlantic"),
    ("north_atlantic", "dover"), ("north_atlantic", "southampton"),
    ("southampton", "london_gateway"), ("london_gateway", "felixstowe"),
    ("felixstowe", "dover"), ("dover", "lehavre"), ("lehavre", "antwerp"),
    ("dover", "antwerp"), ("antwerp", "rotterdam"),
    ("rotterdam", "amsterdam"), ("amsterdam", "bremerhaven"),
    ("bremerhaven", "hamburg"), ("hamburg", "danish"),
    ("danish", "gothenburg"), ("danish", "gdansk"),
    ("gdansk", "stpetersburg"),
    
    # Americas East Coast
    ("north_atlantic", "halifax"), ("halifax", "montreal"),
    ("north_atlantic", "newyork"), ("newyork", "norfolk"),
    ("norfolk", "charleston"), ("charleston", "savannah"),
    ("savannah", "miami"), ("miami", "gulf_of_mexico"),
    ("gulf_of_mexico", "houston"), ("gulf_of_mexico", "veracruz"),
    ("gulf_of_mexico", "cartagena"), ("cartagena", "colon"),
    ("mid_atlantic", "newyork"), ("mid_atlantic", "colon"),
    ("colon", "panama"),
    
    # Americas West Coast & Pacific
    ("panama", "balboa"), ("balboa", "lazaro_cardenas"),
    ("lazaro_cardenas", "manzanillo"), ("manzanillo", "la"),
    ("la", "longbeach"), ("la", "oakland"), ("oakland", "seattle"),
    ("seattle", "vancouver"), ("vancouver", "prince_rupert"),
    ("prince_rupert", "north_pacific"), ("seattle", "north_pacific"),
    ("la", "central_pacific"), ("central_pacific", "north_pacific"),
    ("balboa", "callao"), ("callao", "valparaiso"),
    ("valparaiso", "san_antonio"), ("san_antonio", "cape_horn"),
    
    # South America East
    ("mid_atlantic", "santos"), ("south_atlantic", "santos"),
    ("santos", "rio_de_janeiro"), ("santos", "paranagua"),
    ("paranagua", "buenosaires"), ("buenosaires", "cape_horn"),
    ("cape_horn", "southern_ocean"), ("cape", "southern_ocean"),
    
    # Pacific Transit
    ("north_pacific", "tokyo"), ("north_pacific", "busan"),
    ("central_pacific", "philippine_sea"), ("central_pacific", "south_pacific"),
    
    # Oceania
    ("south_pacific", "auckland"), ("auckland", "tauranga"),
    ("south_pacific", "brisbane"), ("brisbane", "sydney"),
    ("sydney", "melbourne"), ("melbourne", "adelaide"),
    ("adelaide", "fremantle"), ("fremantle", "indian_ocean_south"),
    ("lombok", "fremantle")
]

def haversine(lat1, lon1, lat2, lon2):
    """Calculate the great circle distance in nautical miles between two points."""
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    r = 3440.065
    return c * r

# Build the weighted graph
WEIGHTED_GRAPH = {}
for node in NODES:
    WEIGHTED_GRAPH[node] = {}

for u, v in EDGES:
    if u in NODES and v in NODES:
        lat1, lon1, *_ = NODES[u]
        lat2, lon2, *_ = NODES[v]
        dist = haversine(lat1, lon1, lat2, lon2)
        WEIGHTED_GRAPH[u][v] = dist
        WEIGHTED_GRAPH[v][u] = dist

def get_risk_multiplier(node_a, node_b):
    """
    Simulates a geopolitical / piracy risk layer.
    High-risk corridors inflate the edge distance, guiding the algorithm
    to actively avoid them if a slightly longer, safer route exists.
    """
    high_risk_zones = {"babel", "hormuz", "black_sea"}
    elevated_risk_zones = {"taiwan_strait", "malacca"}
    
    if node_a in high_risk_zones or node_b in high_risk_zones:
        return 1.3 # 30% penalty
    if node_a in elevated_risk_zones or node_b in elevated_risk_zones:
        return 1.1 # 10% penalty
    return 1.0

def calculate_shortest_path_dijkstra(origin, dest, blocked_node=None, use_risk=False):
    """
    Weighted Dijkstra using heapq.
    """
    if origin not in WEIGHTED_GRAPH or dest not in WEIGHTED_GRAPH:
        return [], 0.0
        
    pq = [(0.0, origin, [origin])]
    visited = set()
    
    while pq:
        dist, current_node, path = heapq.heappop(pq)
        
        if current_node in visited:
            continue
            
        visited.add(current_node)
        
        if current_node == dest:
            return path, dist
            
        for neighbor, weight in WEIGHTED_GRAPH[current_node].items():
            if neighbor == blocked_node:
                continue
                
            if neighbor not in visited:
                multiplier = get_risk_multiplier(current_node, neighbor) if use_risk else 1.0
                heapq.heappush(pq, (dist + (weight * multiplier), neighbor, path + [neighbor]))
                
    return [], 0.0
