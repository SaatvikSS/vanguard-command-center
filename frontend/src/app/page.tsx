"use client";
import React, { useState, useEffect } from 'react';
import { ShieldAlert, Server, Globe, Wifi, ActivitySquare, TrendingUp, AlertTriangle, Ship, Anchor, Package, History, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PORT_DATA, CHOKEPOINTS, GLOBAL_ROUTES, STATIC_NEWS, COMMODITIES, SPOT_RATES, WAYPOINTS } from './data/staticData';
import { CargoSimulatorLeftPanel, CargoSimulatorRightPanel } from './components/CargoSimulator';
import { WarGameLeftPanel, WarGameRightPanel } from './components/WarGameSimulator';
import NextDynamic from 'next/dynamic';

// Globe must be loaded client-side only (no SSR)
const GlobalMap = NextDynamic(() => import('./components/GlobalMap'), { ssr: false, loading: () => <div className="flex items-center justify-center h-full bg-[#050B14] text-blue-500 font-mono animate-pulse">Loading Global Map...</div> });

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function CommandCenter() {
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<{agent: string, message: string}[]>([]);
  const [status, setStatus] = useState('GLOBAL NETWORK SECURE');
  const [dataMode, setDataMode] = useState<'STATIC' | 'LIVE'>('STATIC');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [liveNews, setLiveNews] = useState<any[]>([]);
  const [aisData, setAisData] = useState<any[]>([]);
  const [compromised, setCompromised] = useState<string[]>([]);
  const [customThreat, setCustomThreat] = useState("");
  const [ports, setPorts] = useState(PORT_DATA);
  const [chokepoints, setChokepoints] = useState(CHOKEPOINTS);
  const [routes, setRoutes] = useState<any[]>(GLOBAL_ROUTES);
  const [simulating, setSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<'COMMAND' | 'SIMULATOR' | 'WARGAME'>('COMMAND');
  const [simResult, setSimResult] = useState<any>(null);
  const [warGameResult, setWarGameResult] = useState<any>(null);
  const [briefing, setBriefing] = useState<string | null>(null);
  useEffect(() => { setMounted(true); }, []);

  // WebSocket for AI Agent logs
  useEffect(() => {
    if (!mounted) return;
    const ws = new WebSocket('ws://localhost:8000/ws/stream');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'log') {
        setLogs(prev => [...prev, { agent: data.agent, message: data.message }]);
        if (data.state === 'threat_analyzed') setStatus('CRITICAL EVENT DETECTED');
        if (data.state === 'route_healed') setStatus('GLOBAL ROUTE RESTORED');
      }
      if (data.type === 'route_update') {
        const newRoute = data.route;
        // Deduplicate: replace existing detour for same blocked_node, or append
        setRoutes(prev => {
          const filtered = prev.filter((r: any) => !(r[3] && r[1] === `DETOUR (${newRoute.blocked_node?.toUpperCase()})`));
          return [
            ...filtered,
            [newRoute.route, `DETOUR (${newRoute.blocked_node?.toUpperCase()})`, newRoute.financial_impact || '$0', true]
          ];
        });
        if (newRoute.blocked_node) {
          setCompromised(prev => [...new Set([...prev, newRoute.blocked_node])]);
        }
        setSimulating(false);
      }
      if (data.type === 'briefing') {
        setBriefing(data.briefing);
      }
    };
    ws.onerror = () => {};
    return () => ws.close();
  }, [mounted]);

  // News feed & Live Map Simulation
  useEffect(() => {
    if (!mounted) return;
    if (dataMode === 'LIVE') {
      const fetchGDELT = async () => {
        try {
          const res = await fetch("/api/gdelt");
          const data = await res.json();
          setLiveNews((data.articles || []).map((a: any) => {
            let timeStr = 'LIVE';
            if (a.seendate) { // e.g., 20260607T201500Z
              const str = String(a.seendate);
              if (str.length >= 14) {
                const dt = new Date(`${str.slice(0,4)}-${str.slice(4,6)}-${str.slice(6,8)}T${str.slice(9,11)}:${str.slice(11,13)}:${str.slice(13,15)}Z`);
                const diffMins = Math.floor((Date.now() - dt.getTime()) / 60000);
                if (diffMins >= 0) timeStr = diffMins < 60 ? `${diffMins}m` : `${Math.floor(diffMins/60)}h`;
              }
            }
            return { title: a.title, domain: a.domain || a.url, severity: 'LIVE', time: timeStr };
          }));
        } catch { setLiveNews(STATIC_NEWS); }
      };
      fetchGDELT();
      const newsIv = setInterval(fetchGDELT, 30000);
      
      // Simulate live map telemetrics
      const mapIv = setInterval(() => {
        setPorts(prev => prev.map(p => {
          const newCong = Math.max(0, Math.min(100, p[6] + Math.floor(Math.random()*5) - 2));
          return [p[0], p[1], p[2], p[3], p[4], p[5], newCong, p[7], p[8]];
        }));
      }, 3000);
      
      return () => { clearInterval(newsIv); clearInterval(mapIv); };
    } else {
      setLiveNews(STATIC_NEWS);
      setPorts(PORT_DATA);
      setChokepoints(CHOKEPOINTS);
      setRoutes(GLOBAL_ROUTES);
    }
  }, [dataMode, mounted]);

  // AIS ship simulator
  useEffect(() => {
    if (!mounted) return;
    const names = ['EVER GIVEN','MSC GULSUN','HMM ALGECIRAS','OOCL HONG KONG','ONE APUS','COSCO UNIVERSE','MAERSK EDINBURGH','CMA CGM MARCO POLO','MOL TRIUMPH','YANG MING WARRANTY'];
    const gen = () => ({ name: names[Math.floor(Math.random()*names.length)], mmsi: Math.floor(200000000+Math.random()*700000000), lat: (Math.random()*120-40).toFixed(4), lon: (Math.random()*300-100).toFixed(4), speed: (8+Math.random()*16).toFixed(1), heading: Math.floor(Math.random()*360) });
    setAisData(Array.from({length:12}, gen));
    const iv = setInterval(() => setAisData(prev => [gen(), ...prev.slice(0,11)]), 1800);
    return () => clearInterval(iv);
  }, [mounted]);

  // Clean up simulator state when leaving the tab
  useEffect(() => {
    if (activeTab === 'COMMAND') {
      setSimResult(null);
      setWarGameResult(null);
      setCompromised([]);
      setRoutes(GLOBAL_ROUTES);
    } else if (activeTab === 'SIMULATOR') {
      setWarGameResult(null);
      if (!simResult) setRoutes(GLOBAL_ROUTES);
    } else if (activeTab === 'WARGAME') {
      setSimResult(null);
      if (!warGameResult) setRoutes(GLOBAL_ROUTES);
    }
  }, [activeTab]);

  const triggerCrisis = async () => {
    setStatus('ANALYZING THREAT...');
    setSimulating(true);
    setLogs([]);
    setBriefing(null);
    const desc = customThreat.trim() !== "" ? customThreat : (dataMode === 'LIVE' && liveNews.length > 0 ? liveNews[0].title : "Naval blockade in Strait of Malacca blocking commercial shipping.");
    await fetch(`${API_BASE}/api/threat/ingest`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_id: "INTEL-0824", location: "Global", severity: 10, description: desc })
    }).catch(() => { setSimulating(false); });
  };

  const runCargoSimulation = async (payload: any) => {
    setSimulating(true);
    setSimResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/simulate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setSimResult(data);
      // Isolate routes to only the simulation paths
      // Isolate routes to only the simulation paths
      const newRoutes: any[] = [[data.original_route || [], 'NORMAL PATH', 'Standard Cost']];
      if (data.is_detour && !data.unaffected) {
        newRoutes.push([data.detour_route || [], `DETOUR (${data.blocked_chokepoint.toUpperCase()})`, `$${(data.total_damage/1000000).toFixed(1)}M`, true]);
      }
      setRoutes(newRoutes);
      setCompromised([data.blocked_chokepoint]);
    } catch (err) {
      console.error(err);
    }
    setSimulating(false);
  };

  const runWarGame = async (payload: any) => {
    setSimulating(true);
    setWarGameResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/simulate/wargame`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setWarGameResult(data);
      
      // Isolate routes to only the detours for the wargame
      setRoutes(data.details.map((d: any) => [d.detour_route || [], `DETOUR (${d.chokepoint.toUpperCase()})`, `$${(d.damage/1000000).toFixed(1)}M`, true]));
      setCompromised(data.blocked);
    } catch (err) {
      console.error(err);
    }
    setSimulating(false);
  };

  if (!mounted) return <div className="flex items-center justify-center h-screen bg-[#020617] text-blue-500 font-mono tracking-widest animate-pulse text-lg">INITIALIZING VANGUARD GLOBAL NETWORK...</div>;

  const sevColor = (s: string) => s === 'CRITICAL' ? 'bg-red-500' : s === 'HIGH' ? 'bg-orange-500' : s === 'ELEVATED' ? 'bg-yellow-500' : s === 'LIVE' ? 'bg-cyan-500 animate-pulse' : 'bg-blue-500';

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-white font-sans overflow-hidden">
      {/* TOP BAR */}
      <div className="h-14 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-5 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <ShieldAlert className="w-7 h-7 text-blue-500" />
          <h1 className="text-lg font-black tracking-[0.2em] text-slate-100">VANGUARD <span className="text-blue-500">SCRI</span></h1>
          <div className="h-7 w-px bg-slate-800 mx-2" />
          <div className="flex items-center gap-6 text-[11px] font-mono text-slate-500">
            <div className="flex flex-col"><span>ACTIVE FREIGHT</span><span className="text-emerald-400 font-bold text-base">$18.42B</span></div>
            <div className="flex flex-col"><span>SHIPS TRACKED</span><span className="text-blue-400 font-bold text-base">104,204</span></div>
            <div className="flex flex-col"><span>PORTS ONLINE</span><span className="text-blue-400 font-bold text-base">{PORT_DATA.length}</span></div>
            <div className="flex flex-col"><span>CHOKEPOINTS</span><span className="text-amber-500 font-bold text-base">{CHOKEPOINTS.length}</span></div>
            <div className="flex flex-col"><span>GLOBAL THREAT</span><span className="text-amber-500 font-bold text-base animate-pulse">ELEVATED</span></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900 rounded border border-slate-700 p-0.5 mr-2">
            <button onClick={() => setActiveTab('COMMAND')} className={`px-4 py-1.5 text-[10px] font-black tracking-widest rounded transition-all ${activeTab === 'COMMAND' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>COMMAND CENTER</button>
            <button onClick={() => setActiveTab('SIMULATOR')} className={`px-4 py-1.5 text-[10px] font-black tracking-widest rounded transition-all ${activeTab === 'SIMULATOR' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-slate-500'}`}>B2B SIMULATOR</button>
            <button onClick={() => setActiveTab('WARGAME')} className={`px-4 py-1.5 text-[10px] font-black tracking-widest rounded transition-all ${activeTab === 'WARGAME' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'text-slate-500'}`}>WAR GAME</button>
          </div>
          <div className="flex bg-slate-900 rounded border border-slate-700 p-0.5">
            <button onClick={() => setDataMode('STATIC')} className={`px-5 py-1.5 text-[10px] font-black tracking-widest rounded transition-all ${dataMode === 'STATIC' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>STATIC DATA</button>
            <button onClick={() => setDataMode('LIVE')} className={`px-5 py-1.5 text-[10px] font-black tracking-widest rounded flex items-center gap-1 transition-all ${dataMode === 'LIVE' ? 'bg-red-600 text-white animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'text-slate-500'}`}>
              <Wifi className="w-3 h-3" />LIVE GDELT
            </button>
          </div>
        </div>
      </div>

      <PanelGroup orientation="horizontal" className="flex flex-1 min-h-0">
        {/* LEFT PANEL */}
        <Panel 
          defaultSize="25%" minSize="20%" maxSize="40%" collapsible 
          className="flex flex-col border-r border-slate-800 bg-slate-950/80"
        >
          {activeTab === 'COMMAND' ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-slate-800">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-[11px] font-black text-slate-400 tracking-widest">MISSION CONTROL</h2>
                  <div className={`px-2 py-0.5 rounded text-[9px] font-bold ${status.includes('SECURE') || status.includes('RESTORED') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse'}`}>{status}</div>
                </div>
                <div className="space-y-2 mb-2">
                  <input 
                    type="text" 
                    placeholder="Enter custom threat description..." 
                    value={customThreat} 
                    onChange={e => setCustomThreat(e.target.value)} 
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-[11px] text-white placeholder-slate-500"
                  />
                  <button onClick={triggerCrisis} className="w-full py-2 bg-red-600 hover:bg-red-500 transition rounded font-black tracking-widest text-sm border border-red-400 uppercase">DEPLOY AI SWARM</button>
                </div>
              </div>

              <div className="flex-1 min-h-0 flex flex-col border-b border-slate-800">
                <div className="p-3 pb-0">
                  <h3 className="text-[10px] font-black text-amber-500 tracking-widest mb-2 flex items-center gap-2">
                    <Globe className="w-3 h-3" /> {dataMode === 'LIVE' ? 'LIVE GDELT GLOBAL FEED' : 'GLOBAL THREAT INTELLIGENCE'} ({liveNews.length})
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-3 pt-1 space-y-1.5">
                  {liveNews.map((n, i) => (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} key={i} className="bg-slate-900/80 border border-slate-800 p-2.5 rounded text-[10px] flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${sevColor(n.severity)} mt-1 shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-slate-300 font-mono leading-relaxed">{n.title}</div>
                        <div className="flex justify-between mt-1 text-[8px] text-slate-600"><span>{n.domain}</span><span>{n.time}</span></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {dataMode === 'LIVE' && (
                <div className="flex-1 min-h-0 flex flex-col border-b border-slate-800 bg-slate-950">
                  <div className="p-3 pb-0">
                    <h3 className="text-[10px] font-black text-cyan-400 tracking-widest mb-2 flex items-center gap-2">
                      <Ship className="w-3 h-3" /> LIVE AIS DATA FEED
                    </h3>
                  </div>
                  <div className="flex-1 overflow-y-auto font-mono text-[8px] p-3 pt-1 space-y-1">
                    <div className="flex gap-2 text-slate-500 border-b border-slate-800 pb-1 mb-1">
                      <span className="w-20">VESSEL</span><span className="w-16">MMSI</span><span className="w-16">LAT/LON</span><span className="w-8">KTS</span>
                    </div>
                    {aisData.map((s, i) => (
                      <div key={s.mmsi + '-' + i} className="flex gap-2 text-slate-400 py-0.5 border-b border-slate-800/30">
                        <span className="w-20 text-cyan-500 truncate">{s.name}</span>
                        <span className="w-16">{s.mmsi}</span>
                        <span className="w-16 text-slate-500">{s.lat}/{s.lon}</span>
                        <span className="w-8 text-emerald-400">{s.speed}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={`${dataMode === 'LIVE' ? 'h-[120px]' : 'h-[180px]'} p-3 bg-black/60 flex flex-col shrink-0 transition-all`}>
                <h3 className="text-[10px] font-black text-blue-500 tracking-widest mb-2 flex items-center gap-2"><Server className="w-3 h-3" /> LANGGRAPH SWARM LOGS</h3>
                <div className="flex-1 overflow-y-auto font-mono text-[9px] space-y-2">
                  {logs.length === 0 && <span className="text-slate-600 animate-pulse">&gt; Awaiting threat ingestion...</span>}
                  {logs.map((l, i) => (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={i} className="bg-blue-950/20 border border-blue-900/40 p-2 rounded">
                      <span className="text-blue-400 font-bold">[{l.agent}]</span>
                      <span className="text-slate-400 ml-2">{l.message}</span>
                    </motion.div>
                  ))}
                  {briefing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 p-3 bg-slate-900 border border-slate-700 rounded text-slate-300 font-mono text-[9px] whitespace-pre-wrap">
                      {briefing}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === 'SIMULATOR' ? (
            <CargoSimulatorLeftPanel ports={ports} chokepoints={chokepoints} onSimulate={runCargoSimulation} isSimulating={simulating} />
          ) : (
            <WarGameLeftPanel chokepoints={chokepoints} onSimulate={runWarGame} isSimulating={simulating} />
          )}
        </Panel>

        <PanelResizeHandle className="w-2 z-50 bg-slate-900 border-x border-slate-800 flex items-center justify-center hover:bg-blue-500 transition-colors cursor-col-resize">
          <GripVertical className="w-3 h-4 text-slate-500" />
        </PanelResizeHandle>

        {/* CENTER: LEAFLET MAP */}
        <Panel minSize="30%" className="relative min-w-0">
          <GlobalMap 
            onSelectNode={setSelectedNode} 
            compromisedChokepoints={compromised} 
            ports={
              activeTab === 'SIMULATOR' && simResult ? ports.filter(p => simResult.original_route?.includes(p[0]) || simResult.detour_route?.includes(p[0])) :
              activeTab === 'WARGAME' && warGameResult ? ports.filter(p => warGameResult.details.some((d: any) => d.detour_route?.includes(p[0]))) :
              ports
            } 
            chokepoints={
              activeTab === 'SIMULATOR' && simResult ? chokepoints.filter(c => simResult.original_route?.includes(c[0]) || simResult.detour_route?.includes(c[0])) :
              activeTab === 'WARGAME' && warGameResult ? chokepoints.filter(c => warGameResult.details.some((d: any) => d.detour_route?.includes(c[0]))) :
              chokepoints
            } 
            routes={routes} 
            waypoints={WAYPOINTS} 
          />

          {/* Node detail overlay */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-4 left-4 z-[1000] bg-slate-950/95 backdrop-blur-xl border border-blue-500 rounded-lg p-4 w-72 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest">{selectedNode.label}</h3>
                  <button onClick={() => setSelectedNode(null)} className="text-slate-500 hover:text-white text-sm">✕</button>
                </div>
                <div className="space-y-2 font-mono text-[10px] text-slate-300">
                  {selectedNode.country && <div className="flex justify-between border-b border-slate-800 pb-1"><span>COUNTRY</span><span className="text-blue-400">{selectedNode.country}</span></div>}
                  {selectedNode.throughput && <div className="flex justify-between border-b border-slate-800 pb-1"><span>THROUGHPUT</span><span className="text-emerald-400">{selectedNode.throughput}M TEU/yr</span></div>}
                  {selectedNode.vessels && <div className="flex justify-between border-b border-slate-800 pb-1"><span>VESSELS</span><span className="text-blue-400">{selectedNode.vessels}</span></div>}
                  {selectedNode.waitHours && <div className="flex justify-between border-b border-slate-800 pb-1"><span>AVG WAIT</span><span className="text-amber-400">{selectedNode.waitHours}h</span></div>}
                  {selectedNode.congestion && <div className="flex justify-between border-b border-slate-800 pb-1"><span>CONGESTION</span><span className={selectedNode.congestion > 70 ? 'text-red-400' : 'text-emerald-400'}>{selectedNode.congestion}%</span></div>}
                  {selectedNode.lat && <div className="flex justify-between border-b border-slate-800 pb-1"><span>COORDS</span><span className="text-slate-500">{selectedNode.lat}°, {selectedNode.lon}°</span></div>}
                  {selectedNode.traffic && <div className="flex justify-between border-b border-slate-800 pb-1"><span>DAILY TRAFFIC</span><span className="text-amber-400">{selectedNode.traffic} vessels</span></div>}
                  {selectedNode.riskLevel && <div className="flex justify-between"><span>RISK</span><span className={selectedNode.riskLevel === 'CRITICAL' ? 'text-red-500 font-bold' : 'text-amber-400'}>{selectedNode.riskLevel}</span></div>}
                  {selectedNode.type === 'chokepoint' && (
                    <button 
                      onClick={async () => {
                        setSimulating(true);
                        setSelectedNode(null);
                        setStatus('ANALYZING THREAT...');
                        setLogs([]);
                        await fetch(`${API_BASE}/api/threat/ingest`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            event_id: `BLK-${Math.floor(Math.random()*1000)}`,
                            location: selectedNode.label,
                            severity: 5,
                            description: `Simulated complete blockade of ${selectedNode.label}. Immediate global rerouting required.`
                          })
                        }).catch(() => { setSimulating(false); });
                      }}
                      disabled={simulating}
                      className={`w-full mt-3 py-2 border border-red-500 text-red-100 font-bold rounded transition-colors tracking-widest text-[10px] ${simulating ? 'bg-red-900/20 opacity-50 cursor-wait animate-pulse' : 'bg-red-900/40 hover:bg-red-800/60'}`}
                    >
                      {simulating ? '⏳ SIMULATING...' : 'SIMULATE BLOCKADE'}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>


        </Panel>

        <PanelResizeHandle className="w-2 z-50 bg-slate-900 border-x border-slate-800 flex items-center justify-center hover:bg-blue-500 transition-colors cursor-col-resize">
          <GripVertical className="w-3 h-4 text-slate-500" />
        </PanelResizeHandle>

        <Panel 
          defaultSize="25%" minSize="20%" maxSize="40%" collapsible 
          className="flex flex-col border-l border-slate-800 bg-slate-950/80 overflow-y-auto"
        >
          {activeTab === 'COMMAND' ? (
            <div className="p-5 flex flex-col shrink-0">
              <h2 className="text-[11px] font-black text-slate-400 tracking-widest mb-5 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> MACRO ANALYTICS</h2>

          <div className="mb-6">
            <h3 className="text-[9px] font-black text-slate-500 tracking-widest mb-3">CONTAINER SPOT RATES ($/TEU) — 12 WEEK</h3>
            <div className="h-44 w-full bg-slate-900/50 border border-slate-800 rounded p-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SPOT_RATES}>
                  <defs>
                    <linearGradient id="cEU" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                    <linearGradient id="cUS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                    <linearGradient id="cIN" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.4} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#475569" fontSize={8} />
                  <YAxis stroke="#475569" fontSize={8} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '10px' }} />
                  <Legend wrapperStyle={{ fontSize: '9px' }} />
                  <Area type="monotone" dataKey="shanghai_eu" name="SHA→EU" stroke="#ef4444" strokeWidth={2} fill="url(#cEU)" />
                  <Area type="monotone" dataKey="shanghai_us" name="SHA→US" stroke="#3b82f6" strokeWidth={2} fill="url(#cUS)" />
                  <Area type="monotone" dataKey="asia_india" name="ASIA→IND" stroke="#10b981" strokeWidth={2} fill="url(#cIN)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-[9px] font-black text-slate-500 tracking-widest mb-3 flex items-center gap-2"><Package className="w-3 h-3" /> CARGO VALUE AT RISK</h3>
            <div className="space-y-2.5">
              {COMMODITIES.map((c, i) => (
                <div key={i} className="bg-slate-900/50 border border-slate-800 p-2.5 rounded">
                  <div className="flex justify-between text-[10px] font-bold text-white mb-1"><span>{c.name}</span><span style={{ color: c.color }}>{c.value}</span></div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 border border-slate-800"><div className="h-1.5 rounded-full" style={{ width: `${c.exposure}%`, backgroundColor: c.color, boxShadow: `0 0 8px ${c.color}50` }} /></div>
                  <div className="text-[8px] text-slate-600 font-mono mt-1">{c.exposure}% EXPOSURE • {c.route}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[9px] font-black text-slate-500 tracking-widest mb-3 flex items-center gap-2"><Anchor className="w-3 h-3" /> NETWORK STATISTICS</h3>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-900/50 border border-slate-800 rounded p-3"><div className="text-lg font-black text-blue-400">{PORT_DATA.length}</div><div className="text-[8px] text-slate-500 tracking-widest">PORTS</div></div>
              <div className="bg-slate-900/50 border border-slate-800 rounded p-3"><div className="text-lg font-black text-amber-400">{CHOKEPOINTS.length}</div><div className="text-[8px] text-slate-500 tracking-widest">CHOKEPOINTS</div></div>
              <div className="bg-slate-900/50 border border-slate-800 rounded p-3"><div className="text-lg font-black text-emerald-400">{GLOBAL_ROUTES.length}</div><div className="text-[8px] text-slate-500 tracking-widest">ACTIVE ROUTES</div></div>
              <div className="bg-slate-900/50 border border-slate-800 rounded p-3"><div className="text-lg font-black text-red-400">$7.85B</div><div className="text-[8px] text-slate-500 tracking-widest">VALUE AT RISK</div></div>
            </div>
          </div>

          <div className="mt-6 mb-6">
            <h3 className="text-[9px] font-black text-slate-500 tracking-widest mb-3 flex items-center gap-2"><History className="w-3 h-3" /> HISTORICAL CRISIS REPLAY</h3>
            <div className="space-y-2">
              <button 
                onClick={() => {
                  setActiveTab('WARGAME');
                  runWarGame({ blocked_chokepoints: ['suez'], cargo_value: 18420000000 });
                }}
                className="w-full text-left bg-slate-900/50 hover:bg-slate-800 border border-slate-800 p-2.5 rounded transition-colors group"
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-300 group-hover:text-white mb-1">
                  <span>EVER GIVEN BLOCKADE (2021)</span>
                  <span className="text-orange-400">SUEZ CANAL</span>
                </div>
                <div className="text-[8px] text-slate-500">6-day complete blockage. $9.6B daily trade disruption.</div>
              </button>

              <button 
                onClick={() => {
                  setActiveTab('WARGAME');
                  runWarGame({ blocked_chokepoints: ['babel', 'hormuz'], cargo_value: 18420000000 });
                }}
                className="w-full text-left bg-slate-900/50 hover:bg-slate-800 border border-slate-800 p-2.5 rounded transition-colors group"
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-300 group-hover:text-white mb-1">
                  <span>RED SEA CRISIS (2024)</span>
                  <span className="text-red-400">MULTI-NODE</span>
                </div>
                <div className="text-[8px] text-slate-500">Houthi attacks forcing global Cape of Good Hope rerouting.</div>
              </button>

              <button 
                onClick={() => {
                  setActiveTab('WARGAME');
                  runWarGame({ blocked_chokepoints: ['panama'], cargo_value: 18420000000 });
                }}
                className="w-full text-left bg-slate-900/50 hover:bg-slate-800 border border-slate-800 p-2.5 rounded transition-colors group"
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-300 group-hover:text-white mb-1">
                  <span>GATUN LAKE DROUGHT (2023)</span>
                  <span className="text-amber-400">PANAMA CANAL</span>
                </div>
                <div className="text-[8px] text-slate-500">Climate-induced draft restrictions. 40% transit reduction.</div>
              </button>
            </div>
          </div>
        </div>
        ) : activeTab === 'SIMULATOR' ? (
          <CargoSimulatorRightPanel result={simResult} />
        ) : (
          <WarGameRightPanel result={warGameResult} />
        )}
        </Panel>
      </PanelGroup>

      {/* BRIEFING MODAL */}
      <AnimatePresence>
        {briefing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-5">
            <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} className="w-full max-w-2xl bg-[#020617] border border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.3)] rounded p-8 font-mono relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse" />
              <button onClick={() => setBriefing(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">✕</button>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
                <ShieldAlert className="w-12 h-12 text-blue-500" />
                <div>
                  <h2 className="text-xl font-black tracking-[0.2em] text-blue-500">INTELLIGENCE BRIEFING</h2>
                  <p className="text-xs text-slate-500 tracking-widest mt-1">VANGUARD AUTONOMOUS SWARM // TOP SECRET</p>
                </div>
              </div>
              
              <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                {briefing.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) return <h3 key={i} className="text-lg font-black text-red-500 mb-4">{line.replace('# ', '')}</h3>;
                  if (line.startsWith('## ')) return <h4 key={i} className="text-sm font-bold text-blue-400 mt-6 mb-2 border-b border-slate-800 pb-1">{line.replace('## ', '')}</h4>;
                  if (line.startsWith('**') && line.includes('**:')) {
                    const parts = line.split('**:');
                    return <div key={i} className="my-2"><span className="text-amber-400 font-bold">{parts[0].replace('**', '')}:</span><span className="text-white ml-2">{parts.slice(1).join('**:')}</span></div>;
                  }
                  if (line.trim() === '') return <br key={i} />;
                  return <p key={i}>{line}</p>;
                })}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
                <button onClick={() => setBriefing(null)} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-widest rounded transition-colors">ACKNOWLEDGE</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
