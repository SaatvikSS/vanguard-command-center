"use client";
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { AlertTriangle } from 'lucide-react';

// LARGE card for major ports (throughput > 5M TEU)
export const CustomPortNode = ({ data }: any) => {
  if (!data.isPrimary) {
    // TINY dot node for minor ports — just name + country
    return (
      <div className="bg-slate-900/80 border border-slate-700/40 rounded px-2 py-1 min-w-[80px] max-w-[120px]">
        <div className="text-[7px] text-slate-500 font-mono truncate">{data.label}</div>
        <div className="text-[6px] text-slate-600">{data.country} • {data.throughput}M</div>
        <Handle type="source" position={Position.Right} className="w-1 h-1 bg-slate-600 border-none" />
        <Handle type="target" position={Position.Left} className="w-1 h-1 bg-slate-600 border-none" />
      </div>
    );
  }

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] rounded p-2.5 min-w-[220px]">
      <div className="flex justify-between items-center mb-1">
        <span className="text-white text-xs font-bold uppercase tracking-wider">{data.label}</span>
        <span className="text-[8px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-blue-400">{data.country}</span>
      </div>
      <div className="space-y-0.5 mt-2 border-t border-slate-800 pt-2">
        <div className="flex justify-between text-[9px] text-slate-400 font-mono">
          <span>TEU:</span><span className="text-blue-300 font-bold">{data.throughput}M</span>
          <span>WAIT:</span><span className="text-amber-400">{data.waitHours}h</span>
        </div>
        <div className="flex justify-between text-[9px] text-slate-400 font-mono">
          <span>VESSELS:</span><span className="text-emerald-400">{data.vessels}</span>
          <span>LOAD:</span><span className={data.congestion > 70 ? 'text-red-400 font-bold' : 'text-emerald-400'}>{data.congestion}%</span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="w-1.5 h-1.5 bg-blue-500 border-none" />
      <Handle type="target" position={Position.Left} className="w-1.5 h-1.5 bg-blue-500 border-none" />
    </div>
  );
};

export const CustomChokepointNode = ({ data }: any) => (
  <div className={`bg-slate-950/95 backdrop-blur-md border-2 rounded p-2.5 min-w-[180px] relative overflow-hidden ${data.isCompromised ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)]' : 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'}`}>
    {data.isCompromised && <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>}
    <div className="flex items-center gap-2 mb-1">
      <AlertTriangle className={`w-4 h-4 ${data.isCompromised ? 'text-red-500' : 'text-amber-500'}`} />
      <span className={`text-[10px] font-bold uppercase tracking-wider ${data.isCompromised ? 'text-red-400' : 'text-amber-400'}`}>{data.label}</span>
    </div>
    <div className="text-[8px] text-slate-400 font-mono mt-1 flex justify-between">
      <span>TRAFFIC: <span className="text-amber-300">{data.traffic}/day</span></span>
      <span className={data.isCompromised ? 'text-red-500 font-bold animate-pulse' : `${data.riskLevel === 'CRITICAL' ? 'text-red-400' : 'text-amber-500'}`}>{data.isCompromised ? 'BLOCKED' : data.riskLevel}</span>
    </div>
    <Handle type="source" position={Position.Right} className={`w-1.5 h-1.5 ${data.isCompromised ? 'bg-red-500' : 'bg-amber-500'} border-none`} />
    <Handle type="target" position={Position.Left} className={`w-1.5 h-1.5 ${data.isCompromised ? 'bg-red-500' : 'bg-amber-500'} border-none`} />
  </div>
);

export const nodeTypes = { customPort: CustomPortNode, customChokepoint: CustomChokepointNode };
