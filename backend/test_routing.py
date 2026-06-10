import graph_db

validation_routes = [
    ("shanghai", "rotterdam"),
    ("shanghai", "hamburg"),
    ("singapore", "rotterdam"),
    ("busan", "antwerp"),
    ("shanghai", "la"),
    ("shanghai", "newyork"),
    ("dubai", "rotterdam"),
    ("mumbai", "rotterdam"),
    ("mundra", "hamburg"),
    ("tokyo", "la"),
    ("singapore", "sydney"),
    ("santos", "rotterdam"),
    ("durban", "rotterdam"),
    ("vladivostok", "hamburg"),
]

closures_to_test = [
    ("suez", "shanghai", "rotterdam"),
    ("panama", "shanghai", "newyork"),
    ("hormuz", "dubai", "rotterdam"),
    ("malacca", "singapore", "rotterdam"),
    ("babel", "mumbai", "rotterdam"),
    ("gibraltar", "santos", "rotterdam")
]

def run_validation():
    print("# Global Expansion Routing Engine Validation\n")
    print("## 1. Baseline Trade Corridors\n")
    
    for origin, dest in validation_routes:
        path, dist = graph_db.calculate_shortest_path_dijkstra(origin, dest, None)
        print(f"### {origin.upper()} → {dest.upper()}")
        print(f"**Distance:** {round(dist):,} NM")
        print(f"**Path ({len(path)} nodes):** {' -> '.join(path)}\n")
        
    print("## 2. Strategic Chokepoint Rerouting\n")
    for cp, origin, dest in closures_to_test:
        print(f"### {origin.upper()} → {dest.upper()} ({cp.upper()} BLOCKED)")
        base_path, base_dist = graph_db.calculate_shortest_path_dijkstra(origin, dest, None)
        detour_path, detour_dist = graph_db.calculate_shortest_path_dijkstra(origin, dest, cp)
        
        extra_nm = detour_dist - base_dist
        print(f"**Original Distance:** {round(base_dist):,} NM")
        print(f"**New Distance:** {round(detour_dist):,} NM (+{round(extra_nm):,} NM detour)")
        print(f"**Detour Path:** {' -> '.join(detour_path)}\n")

if __name__ == "__main__":
    run_validation()
