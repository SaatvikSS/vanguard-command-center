import time
import requests
import json
from agent import vanguard_app

# The GDELT Project (Global Database of Events, Language, and Tone)
# We use a refined query to prevent GDELT from throwing a 429 (Too Many Requests) due to database overload
GDELT_API_URL = "https://api.gdeltproject.org/api/v2/doc/doc?query=(crisis OR conflict OR blockade OR military OR strike)&mode=artlist&format=json&maxrecords=10&sort=datedesc"

def handle_fallback():
    """Provides a realistic breaking news headline if the external API fails during a live demo."""
    fallback_headline = "BREAKING: Unprecedented military drills detected near the Strait of Malacca, commercial vessels rerouted."
    print(f"\n[ALERT DETECTED] {fallback_headline}")
    print("Source: Vanguard Internal Threat Intelligence (Fallback API)")
    return fallback_headline

def fetch_live_threats():
    """Polls the GDELT API for a firehose of global events."""
    print("[INTELLIGENCE] Polling GDELT Global Firehose Feed...")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VanguardSCRI/1.0'
    }
    try:
        response = requests.get(GDELT_API_URL, headers=headers, timeout=10)
        
        # Handle 429 Too Many Requests gracefully
        if response.status_code == 429:
            print("[WARNING] GDELT API Rate Limit Reached (429). Activating Secure Fallback protocol...")
            return handle_fallback()
            
        response.raise_for_status()
        data = response.json()
        
        articles = data.get("articles", [])
        if not articles:
            print("[INTELLIGENCE] No events detected.")
            return handle_fallback()
            
        print(f"\n🌍 [GLOBAL EVENT FIREHOSE] Top {len(articles[:5])} Breaking News Items:")
        for idx, article in enumerate(articles[:5]):
            print(f"  {idx + 1}. {article.get('title', 'Unknown')}")
            
        print("\n[ROUTING PROTOCOL] Selecting the most severe/relevant event to feed to the Agent Swarm...\n")
        
        # For the demo, we grab the top breaking news article
        top_event = articles[0]
        headline = top_event.get("title", "")
        url = top_event.get("url", "")
        
        print(f"[ALERT DETECTED] {headline}")
        print(f"Source: {url}")
        
        return headline
        
    except Exception as e:
        print(f"[ERROR] Failed to fetch GDELT data: {e}")
        print("[WARNING] Activating Secure Fallback protocol for demo continuity...")
        return handle_fallback()

def trigger_autonomous_swarm(threat_headline: str):
    """Feeds the real-world headline into the running FastAPI server so it appears on the website."""
    print("[SWARM] Forwarding live intelligence to Vanguard Command Center...")
    try:
        response = requests.post(
            'http://localhost:8000/api/threat/ingest',
            json={
                "event_id": "LIVE-INTEL",
                "location": "Global Assessment",
                "severity": 10,
                "description": threat_headline
            },
            timeout=5
        )
        if response.status_code == 200:
            print("[SUCCESS] Intelligence injected. Check your Next.js dashboard!")
        else:
            print(f"[ERROR] Command Center returned status code {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("[ERROR] Could not connect to Command Center. Is your FastAPI server (uvicorn main:app) running?")

if __name__ == "__main__":
    print("=== VANGUARD SCRI: LIVE API INTEGRATION MODULE ===")
    print("This script runs as a background worker in production.")
    
    # In production, this would be a while True: time.sleep(60) loop.
    # We execute it once for the demonstration.
    live_headline = fetch_live_threats()
    
    if live_headline:
        trigger_autonomous_swarm(live_headline)
