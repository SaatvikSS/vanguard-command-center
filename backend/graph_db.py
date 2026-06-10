import os
from neo4j import GraphDatabase

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")

class SupplyChainGraph:
    def __init__(self):
        self.is_mock = False
        try:
            self.driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
            self.driver.verify_connectivity()
        except Exception:
            print("[WARN] Neo4j not running or unreachable. Entering Hackathon Pitch Mock Mode.")
            self.is_mock = True

    def close(self):
        if not self.is_mock:
            self.driver.close()

    def seed_database(self):
        """Seeds the Neo4j database with exact maritime waypoints and edge costs for pathfinding."""
        if self.is_mock: return
        query = """
        MATCH (n) DETACH DELETE n;

        // Create Nodes
        CREATE (shanghai:Port {id: 'shanghai', name: 'Port of Shanghai'})
        CREATE (taiwan:Chokepoint {id: 'taiwan_strait', name: 'Taiwan Strait'})
        CREATE (singapore:Port {id: 'singapore', name: 'Port of Singapore'})
        CREATE (malacca:Chokepoint {id: 'malacca', name: 'Strait of Malacca'})
        CREATE (babel:Chokepoint {id: 'babel', name: 'Bab el-Mandeb'})
        CREATE (suez:Chokepoint {id: 'suez', name: 'Suez Canal'})
        CREATE (gibraltar:Chokepoint {id: 'gibraltar', name: 'Strait of Gibraltar'})
        CREATE (rotterdam:Port {id: 'rotterdam', name: 'Port of Rotterdam'})
        
        // Alternative nodes for Cape route
        CREATE (sunda:Chokepoint {id: 'sunda', name: 'Sunda Strait'})
        CREATE (cape:Chokepoint {id: 'cape', name: 'Cape of Good Hope'})

        // Primary Route Edges (Suez)
        CREATE (shanghai)-[:ROUTE {cost: 500}]->(taiwan)
        CREATE (taiwan)-[:ROUTE {cost: 1500}]->(singapore)
        CREATE (singapore)-[:ROUTE {cost: 100}]->(malacca)
        CREATE (malacca)-[:ROUTE {cost: 3500}]->(babel)
        CREATE (babel)-[:ROUTE {cost: 1200}]->(suez)
        CREATE (suez)-[:ROUTE {cost: 1800}]->(gibraltar)
        CREATE (gibraltar)-[:ROUTE {cost: 1000}]->(rotterdam)

        // Alternate Route Edges (Cape of Good Hope)
        CREATE (malacca)-[:ROUTE {cost: 500}]->(sunda)
        CREATE (sunda)-[:ROUTE {cost: 4500}]->(cape)
        CREATE (cape)-[:ROUTE {cost: 3800}]->(gibraltar)
        """
        with self.driver.session() as session:
            session.run(query)
            print("[INFO] Maritime Network Seeded. Edges calibrated.")

    def update_edge_risk(self, location_name: str, new_cost: int):
        """Sever a node by massively increasing the cost of all incoming edges."""
        if self.is_mock:
            import time
            time.sleep(0.5)
            print(f"[ALERT] Node {location_name} compromised. Inbound routes severed (MOCK).")
            return
            
        query = """
        MATCH ()-[r:ROUTE]->(n {name: $location_name})
        SET r.cost = $new_cost
        RETURN r
        """
        with self.driver.session() as session:
            session.run(query, location_name=location_name, new_cost=new_cost)
            print(f"[ALERT] Node {location_name} compromised. Inbound routes severed.")

    def calculate_optimal_route(self, origin_id: str, destination_id: str, blocked_node: str = None):
        """Uses Neo4j's native shortestPath or APOC to find the cheapest route."""
        if self.is_mock:
            import time
            time.sleep(1.5)
            # Dynamic mock costs based on the specific origin→dest pair
            mock_costs = {
                ("shanghai", "rotterdam"): 11900,
                ("busan", "newyork"): 15400,
                ("singapore", "felixstowe"): 9800,
                ("jebelali", "rotterdam"): 12800,
                ("jeddah", "genoa"): 11200,
                ("santos", "rotterdam"): 6800,
                ("lehavre", "genoa"): 5400,
                ("shanghai", "la"): 5600,
                ("jakarta", "santos"): 8900,
                ("melbourne", "piraeus"): 7500,
                ("busan", "rotterdam"): 9200,
                ("jakarta", "rotterdam"): 9800,
                ("durban", "genoa"): 8200,
                ("hamburg", "genoa"): 4600,
            }
            cost = mock_costs.get((origin_id, destination_id), 10000)
            # Return None so agent.py uses its own fallback array
            return {"route": None, "cost": cost}
            
        query = """
        MATCH (start {id: $origin_id}), (end {id: $destination_id})
        CALL apoc.algo.dijkstra(start, end, 'ROUTE', 'cost') YIELD path, weight
        RETURN [node in nodes(path) | node.id] AS route_nodes, weight AS total_cost
        """
        with self.driver.session() as session:
            try:
                result = session.run(query, origin_id=origin_id, destination_id=destination_id)
                record = result.single()
                if record:
                    return {"route": record["route_nodes"], "cost": record["total_cost"]}
            except Exception as e:
                print(f"[WARN] APOC Dijkstra failed: {e}. Falling back to basic shortest path.")
                # Fallback if APOC isn't installed
                fallback_query = """
                MATCH p=shortestPath((start {id: $origin_id})-[:ROUTE*]-(end {id: $destination_id}))
                RETURN [node in nodes(path) | node.id] AS route_nodes, 0 AS total_cost
                """
                res = session.run(fallback_query, origin_id=origin_id, destination_id=destination_id)
                rec = res.single()
                if rec:
                    return {"route": rec["route_nodes"], "cost": 11900} # Mock cost for fallback
        return None

if __name__ == "__main__":
    db = SupplyChainGraph()
    db.seed_database()
    db.close()
