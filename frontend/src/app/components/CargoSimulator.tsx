import React, { useState } from 'react';
import { Package, Ship, AlertTriangle, DollarSign, Clock, ArrowRight, Activity, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  ports: any[];
  chokepoints: any[];
  onSimulate: (data: any) => void;
  isSimulating: boolean;
}

export function CargoSimulatorLeftPanel({ ports, chokepoints, onSimulate, isSimulating }: Props) {
  const [origin, setOrigin] = useState('shanghai');
  const [dest, setDest] = useState('rotterdam');
  const [chokepoint, setChokepoint] = useState('none');
  const [cargoValue, setCargoValue] = useState('4100000000');
  const [fuelCost, setFuelCost] = useState('45000');
  const [charterCost, setCharterCost] = useState('25000');

  const handleSimulate = async () => {
    onSimulate({
      origin,
      destination: dest,
      blocked_chokepoint: chokepoint,
      cargo_value: parseFloat(cargoValue),
      fuel_cost_per_day: parseFloat(fuelCost),
      charter_cost_per_day: parseFloat(charterCost)
    });
  };

  return (
    <div className="w-[400px] flex flex-col border-r border-slate-800 bg-slate-950/80 shrink-0 h-full">
      <div className="p-4 border-b border-slate-800 bg-blue-950/20">
        <h2 className="text-[11px] font-black text-blue-400 tracking-widest flex items-center gap-2 mb-1"><Package className="w-4 h-4" /> B2B CARGO SIMULATOR</h2>
        <p className="text-[10px] text-slate-400 leading-relaxed">Enter your shipment telemetrics below. Simulate global choke point blockades to calculate precise financial exposure and alternative routing costs.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-3">
          <h3 className="text-[9px] font-black text-slate-500 tracking-widest border-b border-slate-800 pb-1">1. ROUTE DEFINITION</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[8px] text-slate-400 font-bold tracking-widest block mb-1">ORIGIN PORT</label>
              <select value={origin} onChange={e => setOrigin(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-[10px] text-white">
                {ports.map(p => <option key={p[0]} value={p[0]}>{p[1]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[8px] text-slate-400 font-bold tracking-widest block mb-1">DESTINATION PORT</label>
              <select value={dest} onChange={e => setDest(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-[10px] text-white">
                {ports.map(p => <option key={p[0]} value={p[0]}>{p[1]}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-[9px] font-black text-slate-500 tracking-widest border-b border-slate-800 pb-1">2. CARGO FINANCIALS (USD)</h3>
          <div>
            <label className="text-[8px] text-slate-400 font-bold tracking-widest block mb-1">TOTAL GOODS VALUE</label>
            <input type="number" value={cargoValue} onChange={e => setCargoValue(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-[10px] text-emerald-400 font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[8px] text-slate-400 font-bold tracking-widest block mb-1">DAILY FUEL COST</label>
              <input type="number" value={fuelCost} onChange={e => setFuelCost(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-[10px] text-amber-400 font-mono" />
            </div>
            <div>
              <label className="text-[8px] text-slate-400 font-bold tracking-widest block mb-1">DAILY CHARTER RATE</label>
              <input type="number" value={charterCost} onChange={e => setCharterCost(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-[10px] text-blue-400 font-mono" />
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-[9px] font-black text-slate-500 tracking-widest border-b border-slate-800 pb-1">3. THREAT VECTOR</h3>
          <div>
            <label className="text-[8px] text-slate-400 font-bold tracking-widest block mb-1 text-red-400">TARGET CHOKEPOINT</label>
            <select value={chokepoint} onChange={e => setChokepoint(e.target.value)} className="w-full bg-red-950/30 border border-red-900 rounded p-1.5 text-[10px] text-red-200">
              <option value="none">NONE (OPTIMAL ROUTING)</option>
              {chokepoints.map(c => <option key={c[0]} value={c[0]}>{c[1]}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 bg-black/40 mt-auto">
        <button 
          onClick={handleSimulate}
          disabled={isSimulating}
          className={`w-full py-3 border border-orange-500 text-orange-100 font-black rounded transition-colors tracking-[0.2em] text-[11px] ${isSimulating ? 'bg-orange-900/20 opacity-50 cursor-wait animate-pulse' : 'bg-orange-600 hover:bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]'}`}
        >
          {isSimulating ? 'SIMULATING...' : 'EXECUTE SIMULATION'}
        </button>
      </div>
    </div>
  );
}

export function CargoSimulatorRightPanel({ result }: { result: any }) {
  if (!result) {
    return (
      <div className="w-[360px] flex flex-col border-l border-slate-800 bg-slate-950/80 shrink-0 p-5 items-center justify-center text-center">
        <Activity className="w-12 h-12 text-slate-800 mb-4" />
        <h3 className="text-[11px] font-black text-slate-500 tracking-widest">AWAITING SIMULATION</h3>
        <p className="text-[9px] text-slate-600 mt-2">Configure parameters in the left panel and execute to view personalized risk exposure.</p>
      </div>
    );
  }

  const formatMoney = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="w-[360px] flex flex-col border-l border-slate-800 bg-slate-950/80 shrink-0 p-5 overflow-y-auto">
      <h2 className="text-[11px] font-black text-orange-400 tracking-widest mb-5 flex items-center gap-2"><FileText className="w-4 h-4" /> RISK EXPOSURE REPORT</h2>

      {result.blocked_chokepoint === 'none' ? (
        <div className="bg-emerald-950/30 border border-emerald-900/50 rounded p-4 mb-6 relative overflow-hidden">
          <h3 className="text-[9px] font-black text-emerald-400 tracking-widest mb-1">OPTIMAL ROUTE CONFIRMED</h3>
          <div className="text-xl font-black text-emerald-500 mb-2">NO THREAT DETECTED</div>
          <div className="text-[9px] text-slate-400 leading-relaxed">
            Pathing is completely unobstructed. Base transit requires <span className="text-emerald-400 font-bold">{result.normal_distance_nm.toLocaleString()} NM</span>. No extra fuel or insurance surges applied.
          </div>
        </div>
      ) : result.unaffected ? (
        <div className="bg-blue-950/30 border border-blue-900/50 rounded p-4 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10"><Ship className="w-16 h-16 text-blue-500" /></div>
          <h3 className="text-[9px] font-black text-blue-400 tracking-widest mb-1">THREAT EVADED</h3>
          <div className="text-xl font-black text-blue-500 mb-2">ROUTE UNAFFECTED</div>
          <div className="text-[9px] text-slate-400 leading-relaxed">
            The blockade at <span className="text-white font-bold">{result.blocked_chokepoint.toUpperCase()}</span> does not intersect the optimal path for this shipment. Transit remains unobstructed.
          </div>
        </div>
      ) : (
        <div className="bg-red-950/30 border border-red-900/50 rounded p-4 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10"><AlertTriangle className="w-16 h-16 text-red-500" /></div>
          <h3 className="text-[9px] font-black text-red-400 tracking-widest mb-1">TOTAL DAMAGE ESTIMATE</h3>
          <div className="text-3xl font-black text-red-500 mb-2">{formatMoney(result.total_damage)}</div>
          <div className="text-[9px] text-slate-400 leading-relaxed">
            Blockade of <span className="text-white font-bold">{result.blocked_chokepoint.toUpperCase()}</span> will force a detour causing <span className="text-orange-400 font-bold">+{result.extra_transit_days} days</span> of delay and critical financial losses.
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-[9px] font-black text-slate-500 tracking-widest mb-2 border-b border-slate-800 pb-1">LOGISTICS IMPACT</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-900/50 border border-slate-800 rounded p-2">
              <div className="text-[8px] text-slate-500 tracking-widest mb-1">EXTRA DISTANCE</div>
              <div className="text-sm font-bold text-blue-400">+{result.extra_distance_nm.toLocaleString()} NM</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded p-2">
              <div className="text-[8px] text-slate-500 tracking-widest mb-1">TRANSIT DELAY</div>
              <div className="text-sm font-bold text-orange-400">+{result.extra_transit_days} DAYS</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[9px] font-black text-slate-500 tracking-widest mb-2 border-b border-slate-800 pb-1">FINANCIAL BREAKDOWN</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-slate-900/30 p-2 rounded border border-slate-800/50">
              <span className="text-[9px] text-slate-400 font-mono">Excess Fuel Burn</span>
              <span className="text-[10px] font-bold text-amber-400">+{formatMoney(result.extra_fuel_cost)}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900/30 p-2 rounded border border-slate-800/50">
              <span className="text-[9px] text-slate-400 font-mono">Extended Charter</span>
              <span className="text-[10px] font-bold text-blue-400">+{formatMoney(result.extra_charter_cost)}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900/30 p-2 rounded border border-slate-800/50">
              <span className="text-[9px] text-slate-400 font-mono">War Risk Insurance Surge</span>
              <span className="text-[10px] font-bold text-purple-400">+{formatMoney(result.insurance_surge)}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900/30 p-2 rounded border border-slate-800/50">
              <span className="text-[9px] text-slate-400 font-mono">Goods Depreciation Penalty</span>
              <span className="text-[10px] font-bold text-emerald-400">+{formatMoney(result.delay_penalty)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {result.ai_mitigations && result.ai_mitigations.length > 0 && (
        <div className="mt-6 border-t border-slate-800 pt-5 mb-4">
          <h3 className="text-[10px] font-black text-emerald-500 tracking-widest mb-3 flex items-center gap-2"><Activity className="w-3 h-3" /> VANGUARD AI MITIGATION</h3>
          <div className="space-y-3">
            {result.ai_mitigations.map((m: any, i: number) => (
              <div key={i} className="bg-emerald-950/20 border border-emerald-900/50 p-3 rounded">
                <h4 className="text-[10px] font-bold text-emerald-400 mb-1">{m.strategy}</h4>
                <p className="text-[9px] text-slate-400 leading-relaxed mb-2">{m.description}</p>
                <div className="flex justify-between items-center text-[9px] font-mono">
                  <span className="text-blue-400">{m.time_impact}</span>
                  <span className="text-amber-400">{m.cost_impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button className="mt-auto w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-black tracking-widest rounded transition-colors border border-slate-600">
        EXPORT PDF REPORT
      </button>
    </div>
  );
}
