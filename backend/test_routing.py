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
    "durban": "africa_south", "capetown": "africa_south", "mombasa": "africa_east", "lagos": "africa_west",
    # Americas
    "la": "us_west", "longbeach": "us_west", "vancouver": "us_west", "manzanillo": "us_west", "balboa": "us_west", "callao": "us_west",
    "newyork": "us_east", "savannah": "us_east", "houston": "us_east", "charleston": "us_east", "montreal": "us_east", "colon": "us_east",
    "santos": "south_america_east", "cartagena": "south_america_east", "buenosaires": "south_america_east",
    # Oceania
    "melbourne": "oceania", "sydney": "oceania", "brisbane": "oceania", "auckland": "oceania", "tauranga": "oceania",
}

GRAPH = {
    "east_asia": ["taiwan_strait", "tsugaru"],
    "se_asia": ["taiwan_strait", "malacca", "sunda", "lombok"],
    "south_asia": ["malacca", "colombo_wp"],
    "middle_east": ["hormuz", "babel"],
    "europe_north": ["dover", "danish"],
    "europe_south": ["gibraltar", "suez", "cape_st_vincent"],
    "africa_east": ["babel", "madagascar_east"],
    "africa_south": ["cape", "mozambique", "namibia_coast"],
    "africa_west": ["namibia_coast", "canary_islands"],
    "us_west": ["panama"],
    "us_east": ["panama", "canary_islands"],
    "south_america_east": ["cape_horn", "canary_islands"],
    "oceania": ["lombok", "cape_horn"],

    "taiwan_strait": ["east_asia", "se_asia"],
    "malacca": ["se_asia", "south_asia"],
    "sunda": ["se_asia", "madagascar_east"],
    "lombok": ["se_asia", "oceania"],
    "tsugaru": ["east_asia", "us_west"],
    
    "colombo_wp": ["south_asia", "babel", "madagascar_east", "hormuz"],
    "hormuz": ["middle_east", "colombo_wp"],
    "babel": ["middle_east", "suez", "colombo_wp", "africa_east"],
    "suez": ["babel", "europe_south"],
    
    "madagascar_east": ["colombo_wp", "sunda", "africa_east", "mozambique", "cape"],
    "mozambique": ["madagascar_east", "africa_south"],
    "cape": ["madagascar_east", "africa_south", "namibia_coast", "cape_horn"],
    "namibia_coast": ["cape", "africa_south", "africa_west"],
    "canary_islands": ["africa_west", "us_east", "south_america_east", "cape_st_vincent"],
    
    "cape_st_vincent": ["canary_islands", "gibraltar", "dover"],
    "gibraltar": ["cape_st_vincent", "europe_south"],
    "dover": ["cape_st_vincent", "europe_north"],
    "danish": ["europe_north"],
    
    "panama": ["us_west", "us_east"],
    "cape_horn": ["us_west", "south_america_east", "cape"],
}

def shortest_path(origin, dest, blocked=None):
    start = REGION_MAP.get(origin, origin)
    end = REGION_MAP.get(dest, dest)
    
    if start == end:
        return [origin, dest]
        
    queue = [[start]]
    visited = set()
    visited.add(start)
    if blocked:
        visited.add(blocked)
        
    while queue:
        path = queue.pop(0)
        node = path[-1]
        
        if node == end:
            return [origin] + path[1:-1] + [dest]
            
        for neighbor in GRAPH.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(path + [neighbor])
    return [origin, dest]

print("Chennai -> Barcelona (Normal):", shortest_path("chennai", "barcelona"))
print("Chennai -> Barcelona (Suez Blocked):", shortest_path("chennai", "barcelona", "suez"))
