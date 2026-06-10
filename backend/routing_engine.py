# Simplified Graph for routing
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

# The graph links regions, chokepoints, and waypoints
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

# The waypoints are nodes we ACTUALLY want to include in the route array.
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
            # We found the path. Clean it up to only include origin, valid waypoints, and dest.
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
                
    # Fallback if no path found
    return [origin, dest]

print("Chennai -> Barcelona (Normal):", calculate_shortest_path("chennai", "barcelona"))
print("Chennai -> Barcelona (Suez Blocked):", calculate_shortest_path("chennai", "barcelona", "suez"))
