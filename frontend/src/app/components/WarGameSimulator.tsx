import React, { useState } from 'react';
import { Skull, AlertTriangle, ShieldAlert, Activity, FileText, Anchor } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  chokepoints: any[];
  onSimulate: (data: any) => void;
  isSimulating: boolean;
}

export function WarGameLeftPanel({ chokepoints, onSimulate, isSimulating }: Props) {
  const [selectedChokepoints, setSelectedChokepoints] = useState<string[]>([]);

  const toggleChokepoint = (id: string) => {
    if (selectedChokepoints.includes(id)) {
      setSelectedChokepoints(prev => prev.filter(c => c !== id));
    } else {
      if (selectedChokepoints.length < 5) {
        setSelectedChokepoints(prev => [...prev, id]);
      }
    }
  };

  const handleSimulate = () => {
    if (selectedChokepoints.length === 0) return;
    onSimulate({ blocked_chokepoints: selectedChokepoints });
  };

  return (
    <div className="w-[400px] flex flex-col border-r border-slate-800 bg-slate-950/80 shrink-0 h-full">
      <div className="p-4 border-b border-slate-800 bg-red-950/20">
        <h2 className="text-[11px] font-black text-red-500 tracking-widest flex items-center gap-2 mb-1"><Skull className="w-4 h-4" /> CASCADING FAILURE ENGINE</h2>
        <p className="text-[10px] text-slate-400 leading-relaxed">War Game Mode. Select up to 5 critical global chokepoints to simulate simultaneous cascading blockades and assess catastrophic global supply chain collapse.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <div className="flex justify-between items-center border-b border-slate-800 pb-1 mb-3">
            <h3 className="text-[9px] font-black text-slate-500 tracking-widest">TARGET CHOKEPOINTS (MAX 5)</h3>
            <span className="text-[9px] text-red-400 font-bold">{selectedChokepoints.length}/5 SELECTED</span>
          </div>
          
          <div className="space-y-2">
            {chokepoints.map(c => {
              const isSelected = selectedChokepoints.includes(c[0]);
              return (
                <div 
                  key={c[0]}
                  onClick={() => toggleChokepoint(c[0])}
                  className={`cursor-pointer p-2 rounded border flex items-center justify-between transition-colors ${isSelected ? 'bg-red-900/30 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-slate-900 border-slate-800 hover:border-slate-600'}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded border flex items-center justify-center ${isSelected ? 'bg-red-500 border-red-500' : 'border-slate-600'}`}>
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-red-100' : 'text-slate-400'}`}>{c[1].toUpperCase()}</span>
                  </div>
                  {isSelected && <AlertTriangle className="w-3 h-3 text-red-500" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 bg-black/40 mt-auto">
        <button 
          onClick={handleSimulate}
          disabled={isSimulating || selectedChokepoints.length === 0}
          className={`w-full py-3 border border-red-600 text-red-100 font-black rounded transition-colors tracking-[0.2em] text-[11px] ${isSimulating || selectedChokepoints.length === 0 ? 'bg-red-950/50 opacity-50 cursor-not-allowed' : 'bg-red-700 hover:bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]'}`}
        >
          {isSimulating ? 'SIMULATING COLLAPSE...' : 'INITIATE CASCADING FAILURE'}
        </button>
      </div>
    </div>
  );
}

export function WarGameRightPanel({ result }: { result: any }) {
  if (!result) {
    return (
      <div className="w-[360px] flex flex-col border-l border-slate-800 bg-slate-950/80 shrink-0 p-5 items-center justify-center text-center">
        <ShieldAlert className="w-12 h-12 text-slate-800 mb-4" />
        <h3 className="text-[11px] font-black text-slate-500 tracking-widest">AWAITING WAR GAME</h3>
        <p className="text-[9px] text-slate-600 mt-2">Select targets and initiate to view macroeconomic collapse scenario.</p>
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
      <h2 className="text-[11px] font-black text-red-500 tracking-widest mb-5 flex items-center gap-2"><Activity className="w-4 h-4" /> MACROECONOMIC IMPACT</h2>

      <div className="bg-red-950/40 border border-red-500 rounded p-4 mb-6 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
        <h3 className="text-[9px] font-black text-red-400 tracking-widest mb-1">GLOBAL FINANCIAL DAMAGE</h3>
        <div className="text-3xl font-black text-red-500 mb-2 animate-pulse">{formatMoney(result.total_global_damage)}</div>
        
        <div className="mt-4 pt-4 border-t border-red-900/50">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] text-slate-400 tracking-widest">TRADE DISRUPTED</span>
            <span className="text-[10px] font-bold text-red-400">{result.global_trade_disrupted_pct}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 border border-red-900/30">
            <div className="h-1.5 rounded-full bg-red-500" style={{ width: `${result.global_trade_disrupted_pct}%` }} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[9px] font-black text-slate-500 tracking-widest border-b border-slate-800 pb-1">CASUALTY REPORT BY REGION</h3>
        {result.details.map((d: any, i: number) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-3 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-200">{d.chokepoint.toUpperCase()}</span>
              <span className="text-[9px] text-red-400 font-bold">-{d.trade_share_pct}% TRADE</span>
            </div>
            <div className="flex justify-between items-center text-[9px]">
              <span className="text-slate-500">Damage</span>
              <span className="font-mono text-red-400">+{formatMoney(d.damage)}</span>
            </div>
            <div className="flex justify-between items-center text-[9px] mt-1">
              <span className="text-slate-500">Value Frozen</span>
              <span className="font-mono text-orange-400">{formatMoney(d.affected_value)}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-3 bg-red-900/20 border border-red-900/50 rounded flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[9px] font-black text-red-400 tracking-widest mb-1">SYSTEM WARNING</h4>
          <p className="text-[8px] text-slate-400 leading-relaxed">Supply chain collapse threshold exceeded. Secondary cascading delays expected at unaffected ports due to vessel bunching.</p>
        </div>
      </div>
    </div>
  );
}
