'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

interface Props {
  onSelectNode: (data: any) => void;
  compromisedChokepoints: string[];
  ports: any[];
  chokepoints: any[];
  routes: any[];
  waypoints?: any[];
}

function getGlobeRoutes(ports: any[], chokepoints: any[], routes: any[], waypoints: any[] = []) {
  const portMap = new Map<string, [number, number]>();
  ports.forEach(([id,,,lat,lon]) => portMap.set(id, [lat, lon]));
  chokepoints.forEach(([id,,lat,lon]) => portMap.set(id, [lat, lon]));
  // Waypoints are used for routing coordinates only (not rendered as UI cards)
  waypoints.forEach(([id,,lat,lon]) => portMap.set(id, [lat, lon]));
  
  return routes.map(([pathArray, cargo, val, is_detour]) => {
    const coords = (pathArray as string[]).map(nodeId => {
      const pos = portMap.get(nodeId);
      if (!pos) return null;
      return [pos[0], pos[1], 0.01]; // lat, lon, alt
    }).filter(Boolean) as [number,number,number][];
    
    if (coords.length < 2) return null;
    return { 
      coords, 
      is_detour,
      name: cargo
    };
  }).filter((route): route is NonNullable<typeof route> => route !== null);
}

function getHtmlElements(ports: any[], chokepoints: any[], compromisedChokepoints: string[], onSelectNode: any) {
  const elements: any[] = [];
  
  // Show all ports, but rely on CSS to hide minor ones when zoomed out
  ports.forEach(([id, label, country, lat, lon, throughput, congestion, vessels, waitHours]) => {
    elements.push({
      id, lat, lon,
      type: 'port',
      render: () => {
        const congColor = congestion > 70 ? '#f87171' : '#34d399';
        const el = document.createElement('div');
        el.style.cursor = 'pointer';
        el.style.pointerEvents = 'auto';
        el.innerHTML = `
          <div class="port-card ${throughput < 5 ? 'minor-port' : ''}" style="background:rgba(15,23,42,0.95);backdrop-filter:blur(8px);border:1px solid #3b82f6;border-radius:6px;padding:8px 10px;min-width:200px;box-shadow:0 0 15px rgba(59,130,246,0.2);font-family:ui-monospace,monospace;transform:translate(-50%,-50%);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <span style="color:#fff;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px">${label.replace('Port of ','')}</span>
              <span class="detail-grid" style="font-size:8px;background:#1e293b;padding:1px 5px;border-radius:3px;border:1px solid #334155;color:#60a5fa">${country}</span>
            </div>
            <div class="detail-grid" style="border-top:1px solid #1e293b;padding-top:5px;display:grid;grid-template-columns:1fr 1fr;gap:2px 12px;font-size:8px;color:#94a3b8">
              <span>TEU: <b style="color:#93c5fd">${throughput}M</b></span>
              <span>WAIT: <b style="color:#fbbf24">${waitHours}h</b></span>
              <span>VESSELS: <b style="color:#34d399">${vessels}</b></span>
              <span>LOAD: <b style="color:${congColor}">${congestion}%</b></span>
            </div>
          </div>
        `;
        el.onclick = () => onSelectNode({ id, label, country, lat, lon, throughput, congestion, vessels, waitHours, type: 'port' });
        return el;
      }
    });
  });

  chokepoints.forEach(([id, label, lat, lon, traffic, riskLevel]) => {
    const isCompromised = compromisedChokepoints.includes(id);
    elements.push({
      id, lat, lon,
      type: 'chokepoint',
      render: () => {
        const borderColor = isCompromised ? '#ef4444' : riskLevel === 'CRITICAL' ? '#ef4444' : '#f59e0b';
        const statusText = isCompromised ? 'BLOCKED' : riskLevel;
        const statusColor = isCompromised ? '#ef4444' : riskLevel === 'CRITICAL' ? '#f87171' : '#fbbf24';
        const glow = isCompromised ? 'box-shadow:0 0 25px rgba(239,68,68,0.4)' : `box-shadow:0 0 15px ${borderColor}30`;
        const el = document.createElement('div');
        el.style.cursor = 'pointer';
        el.style.pointerEvents = 'auto';
        el.innerHTML = `
          <div class="choke-card" style="background:rgba(2,6,23,0.95);backdrop-filter:blur(8px);border:2px solid ${borderColor};border-radius:6px;padding:7px 10px;min-width:180px;${glow};font-family:ui-monospace,monospace;position:relative;overflow:hidden;transform:translate(-50%,-50%);">
            ${isCompromised ? '<div style="position:absolute;inset:0;background:rgba(239,68,68,0.08);animation:pulse 2s infinite"></div>' : ''}
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
              <span style="color:${borderColor};font-size:12px">⚠</span>
              <span style="color:${borderColor};font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px">${label}</span>
            </div>
            <div class="detail-grid" style="font-size:8px;color:#94a3b8;display:flex;justify-content:space-between">
              <span>TRAFFIC: <b style="color:#fbbf24">${traffic}/day</b></span>
              <span style="color:${statusColor};font-weight:800">${statusText}</span>
            </div>
          </div>
        `;
        el.onclick = () => onSelectNode({ id, label, traffic, riskLevel, isCompromised, type: 'chokepoint' });
        return el;
      }
    });
  });

  return elements;
}

export default function GlobalMap({ onSelectNode, compromisedChokepoints, ports, chokepoints, routes, waypoints = [] }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setDimensions({ width: entries[0].contentRect.width, height: entries[0].contentRect.height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [ready]);

  // Point globe to Middle East on start
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 25, lng: 55, altitude: 2.5 }, 1000);
    }
  }, [ready]);

  // Altitude polling for semantic zoom
  useEffect(() => {
    if (!globeRef.current || !ready) return;
    const interval = setInterval(() => {
      const alt = globeRef.current.pointOfView().altitude;
      if (alt > 1.8) {
        document.body.classList.add('globe-zoomed-out');
      } else {
        document.body.classList.remove('globe-zoomed-out');
      }
    }, 250);
    return () => clearInterval(interval);
  }, [ready]);

  // Memoize routes so they don't flash/re-animate on every Live Feed ping
  const routeLines = useMemo(() => getGlobeRoutes(ports, chokepoints, routes, waypoints), [JSON.stringify(routes)]);
  // Re-render HTML nodes when port data updates (congestion, traffic)
  const htmlNodes = useMemo(() => getHtmlElements(ports, chokepoints, compromisedChokepoints, onSelectNode), [ports, chokepoints, compromisedChokepoints]);

  if (!ready) return null;

  return (
    <div ref={containerRef} onWheel={(e) => e.stopPropagation()} style={{ width: '100%', height: '100%', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', touchAction: 'none' }}>
      <style>{`
        body.globe-zoomed-out .detail-grid { display: none !important; }
        body.globe-zoomed-out .port-card { min-width: auto !important; padding: 4px 6px !important; }
        body.globe-zoomed-out .choke-card { min-width: auto !important; padding: 4px 6px !important; }
        body.globe-zoomed-out .minor-port { display: none !important; }
      `}</style>
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pathsData={routeLines}
        pathPoints="coords"
        pathPointLat={(p: any) => p[0]}
        pathPointLng={(p: any) => p[1]}
        pathPointAlt={(p: any) => p[2]}
        pathColor={(d: any) => d.is_detour ? 'rgba(239, 68, 68, 0.9)' : 'rgba(59, 130, 246, 0.4)'}
        pathDashLength={0.05}
        pathDashGap={0.02}
        pathDashAnimateTime={(d: any) => d.is_detour ? 2000 : 8000}
        pathStroke={(d: any) => d.is_detour ? 3 : 1}
        htmlElementsData={htmlNodes}
        htmlLat={(d: any) => d.lat}
        htmlLng={(d: any) => d.lon}
        htmlElement={(d: any) => d.render()}
        atmosphereColor="#3b82f6"
        atmosphereAltitude={0.15}
      />
    </div>
  );
}
