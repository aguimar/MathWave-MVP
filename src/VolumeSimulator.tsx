import React, { useState } from 'react';
import { Box, Circle as CircleIcon, Cylinder, Cone as ConeIcon, Calculator, BoxSelect, PlayCircle, LifeBuoy, Hexagon } from 'lucide-react';

type SolidType = 'Cubo' | 'Esfera' | 'Cilindro' | 'Cone' | 'Toro' | 'Romboide';

interface SolidParams {
    radius: number; // r
    height: number; // h
    edge: number;   // a
    majorRadius: number; // R (Toro)
    width: number;  // b (Romboide)
}

const DEFAULT_PARAMS: SolidParams = {
    radius: 1,
    height: 2,
    edge: 1.5,
    majorRadius: 2.5,
    width: 1.2
};

export default function VolumeSimulator() {
    const [solidType, setSolidType] = useState<SolidType>('Cubo');
    const [params, setParams] = useState<SolidParams>(DEFAULT_PARAMS);

    const handleParamChange = (key: keyof SolidParams, value: number) => {
        setParams(prev => ({ ...prev, [key]: value }));
    };

    const getThemeColor = () => {
        switch (solidType) {
            case 'Cubo': return '#06b6d4'; // Cyan-500
            case 'Esfera': return '#8b5cf6'; // Violet-500
            case 'Cilindro': return '#f43f5e'; // Rose-500
            case 'Cone': return '#10b981'; // Emerald-500
            case 'Toro': return '#f59e0b'; // Amber-500
            case 'Romboide': return '#ec4899'; // Pink-500
            default: return '#06b6d4';
        }
    };

    const getFormulaContext = () => {
        switch (solidType) {
            case 'Cubo':
                return {
                    formula: `V = a³`,
                    calculation: `V = (${params.edge})³ = ${(Math.pow(params.edge, 3)).toFixed(2)} u.v.`,
                    desc: 'O volume do cubo é o produto de suas três dimensões idênticas (Aresta × Aresta × Aresta).'
                };
            case 'Esfera':
                return {
                    formula: `V = ⁴⁄₃·π·r³`,
                    calculation: `V = ⁴⁄₃·π·(${params.radius})³ ≈ ${((4 / 3) * Math.PI * Math.pow(params.radius, 3)).toFixed(2)} u.v.`,
                    desc: 'O volume da esfera cresce rapidamente de forma cúbica em relação ao seu raio.'
                };
            case 'Cilindro':
                return {
                    formula: `V = π·r²·h`,
                    calculation: `V = π·(${params.radius})²·(${params.height}) ≈ ${(Math.PI * Math.pow(params.radius, 2) * params.height).toFixed(2)} u.v.`,
                    desc: 'O volume do cilindro é a área de sua base circular (π·r²) multiplicada pela sua altura (h).'
                };
            case 'Cone':
                return {
                    formula: `V = ⅓·π·r²·h`,
                    calculation: `V = ⅓·π·(${params.radius})²·(${params.height}) ≈ ${((1 / 3) * Math.PI * Math.pow(params.radius, 2) * params.height).toFixed(2)} u.v.`,
                    desc: 'O volume de um cone é exatamentre um terço do volume de um cilindro com a mesma base e altura.'
                };
            case 'Toro':
                return {
                    formula: `V = 2π²·R·r²`,
                    calculation: `V = 2π²·(${params.majorRadius})·(${params.radius})² ≈ ${(2 * Math.pow(Math.PI, 2) * params.majorRadius * Math.pow(params.radius, 2)).toFixed(2)} u.v.`,
                    desc: 'O volume do toroide (rosquinha) depende da distância do centro ao meio do tubo (R) e o raio do tubo (r).'
                };
            case 'Romboide':
                return {
                    formula: `V = a·b·h`,
                    calculation: `V = (${params.edge})·(${params.width})·(${params.height}) = ${(params.edge * params.width * params.height).toFixed(2)} u.v.`,
                    desc: 'O volume de um romboide tridimensional (prisma) é obtido multiplicando sua largura, comprimento e altura.'
                };
            default:
                return { formula: '', calculation: '', desc: '' };
        }
    };

    // ── Videos: 2 verified YT videos per solid (opens on YouTube) ─────────
    const getVideos = () => {
        const map: Record<SolidType, { id: string; title: string; channel: string }[]> = {
            Cubo: [
                { id: 'uJgbLhhWrZo', title: 'Geometria Espacial 04: Volume do Cubo', channel: 'Matemática no Papel' },
                { id: 'JRDBMV6YM4E', title: 'Geometria Espacial 06: Volume do Paralelepípedo', channel: 'Matemática no Papel' },
            ],
            Esfera: [
                { id: 'Pk-IOSEQ8sQ', title: 'FÁCIL e RÁPIDO | ESFERA | GEOMETRIA ESPACIAL', channel: 'Dicasdemat Sandro Curió' },
                { id: 'uJgbLhhWrZo', title: 'Geometria Espacial: Sólidos e Volumes', channel: 'Matemática no Papel' },
            ],
            Cilindro: [
                { id: 'sFWBwWg2szE', title: 'CILINDRO | GEOMETRIA ESPACIAL', channel: 'Dicasdemat Sandro Curió' },
                { id: 'Pk-IOSEQ8sQ', title: 'ESFERA | GEOMETRIA ESPACIAL', channel: 'Dicasdemat Sandro Curió' },
            ],
            Cone: [
                { id: '67IM72aHevg', title: 'CONE | GEOMETRIA ESPACIAL | RÁPIDO E FÁCIL', channel: 'Dicasdemat Sandro Curió' },
                { id: 'sFWBwWg2szE', title: 'CILINDRO | GEOMETRIA ESPACIAL', channel: 'Dicasdemat Sandro Curió' },
            ],
            Toro: [
                { id: 'Gr3fx2BfD9w', title: 'Cálculo do Volume do TORO', channel: 'Prof. Me Daniel — Matemática' },
                { id: '67IM72aHevg', title: 'CONE | GEOMETRIA ESPACIAL | RÁPIDO E FÁCIL', channel: 'Dicasdemat Sandro Curió' },
            ],
            Romboide: [
                { id: 'JRDBMV6YM4E', title: 'Geometria Espacial 06: Volume do Paralelepípedo', channel: 'Matemática no Papel' },
                { id: 'uJgbLhhWrZo', title: 'Geometria Espacial 04: Volume do Cubo', channel: 'Matemática no Papel' },
            ],
        };
        return map[solidType] ?? [];
    };

    const mathInfo = getFormulaContext();
    const tc = getThemeColor();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Left Column: Visualization */}
            <div className="lg:col-span-3 flex flex-col gap-6">

                {/* Visualizer Panel */}
                <div className="glass-panel rounded-2xl p-6 relative flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <BoxSelect className="w-5 h-5 text-slate-300" style={{ color: tc }} />
                            Laboratório de Geometria 3D
                        </h2>

                        {/* Solid Selectors */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-700/50">
                            {(['Cubo', 'Esfera', 'Cilindro', 'Cone', 'Toro', 'Romboide'] as SolidType[]).map((type) => {
                                let activeClass = '';
                                if (solidType === type) {
                                    if (type === 'Cubo') activeClass = 'bg-cyan-500/20 text-cyan-300';
                                    else if (type === 'Esfera') activeClass = 'bg-violet-500/20 text-violet-300';
                                    else if (type === 'Cilindro') activeClass = 'bg-rose-500/20 text-rose-300';
                                    else if (type === 'Cone') activeClass = 'bg-emerald-500/20 text-emerald-300';
                                    else if (type === 'Toro') activeClass = 'bg-amber-500/20 text-amber-300';
                                    else if (type === 'Romboide') activeClass = 'bg-pink-500/20 text-pink-300';
                                }
                                return (
                                    <button
                                        key={type}
                                        onClick={() => setSolidType(type)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 flex justify-center items-center gap-2 ${solidType === type ? activeClass : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                                    >
                                        {type === 'Cubo' && <Box className="w-4 h-4" />}
                                        {type === 'Esfera' && <CircleIcon className="w-4 h-4" />}
                                        {type === 'Cilindro' && <Cylinder className="w-4 h-4" />}
                                        {type === 'Cone' && <ConeIcon className="w-4 h-4" />}
                                        {type === 'Toro' && <LifeBuoy className="w-4 h-4" />}
                                        {type === 'Romboide' && <Hexagon className="w-4 h-4" />}
                                        {type}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* The SVG pseudo-3D Canvas */}
                    <div className="h-[400px] w-full flex items-center justify-center bg-slate-900/40 rounded-xl border border-slate-700/50 overflow-hidden relative">
                        {/* Grid lines background */}
                        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                        <svg viewBox="-5 -5 10 10" className="w-full h-[90%] z-10 overflow-visible drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            {/* Origin Reference lines */}
                            <line x1="-5" y1="0" x2="5" y2="0" stroke="#334155" strokeWidth="0.05" strokeDasharray="0.2,0.2" />
                            <line x1="0" y1="-5" x2="0" y2="5" stroke="#334155" strokeWidth="0.05" strokeDasharray="0.2,0.2" />

                            {solidType === 'Cubo' && (() => {
                                const a = params.edge;
                                const o = a / 3; // depth offset for isometric illusion
                                return (
                                    <g stroke={tc} strokeWidth="0.1" fill={`${tc}20`} strokeLinecap="round" strokeLinejoin="round">
                                        {/* Back face */}
                                        <rect x={-a / 2 + o} y={-a / 2 - o} width={a} height={a} strokeDasharray="0.2,0.2" fill="none" opacity="0.5" />
                                        {/* Connections */}
                                        <line x1={-a / 2} y1={-a / 2} x2={-a / 2 + o} y2={-a / 2 - o} strokeDasharray="0.2,0.2" opacity="0.5" />
                                        <line x1={a / 2} y1={-a / 2} x2={a / 2 + o} y2={-a / 2 - o} />
                                        <line x1={a / 2} y1={a / 2} x2={a / 2 + o} y2={a / 2 - o} />
                                        <line x1={-a / 2} y1={a / 2} x2={-a / 2 + o} y2={a / 2 - o} />
                                        {/* Front face */}
                                        <rect x={-a / 2} y={-a / 2} width={a} height={a} />
                                    </g>
                                );
                            })()}

                            {solidType === 'Esfera' && (() => {
                                const r = params.radius;
                                return (
                                    <g>
                                        <defs>
                                            <radialGradient id="sphereGrad" cx="30%" cy="30%" r="70%">
                                                <stop offset="0%" stopColor={tc} stopOpacity="0.8" />
                                                <stop offset="100%" stopColor={tc} stopOpacity="0.1" />
                                            </radialGradient>
                                        </defs>
                                        {/* Main Outline */}
                                        <circle cx="0" cy="0" r={r} fill="url(#sphereGrad)" stroke={tc} strokeWidth="0.1" />
                                        {/* 3D Equator Ellipses */}
                                        <ellipse cx="0" cy="0" rx={r} ry={r * 0.3} fill="none" stroke={tc} strokeWidth="0.05" opacity="0.8" />
                                        <ellipse cx="0" cy="0" rx={r} ry={r * 0.3} fill="none" stroke={tc} strokeWidth="0.05" strokeDasharray="0.2,0.2" opacity="0.4" />
                                        <ellipse cx="0" cy="0" rx={r * 0.3} ry={r} fill="none" stroke={tc} strokeWidth="0.04" strokeDasharray="0.1,0.2" opacity="0.3" />
                                    </g>
                                );
                            })()}

                            {solidType === 'Cilindro' && (() => {
                                const r = params.radius;
                                const h = params.height;
                                const halfH = h / 2;
                                return (
                                    <g stroke={tc} strokeWidth="0.1" fill={`${tc}20`} strokeLinecap="round">
                                        {/* Bottom ellipse hidden part */}
                                        <path d={`M ${-r} ${halfH} A ${r} ${r * 0.3} 0 0 1 ${r} ${halfH}`} fill="none" strokeDasharray="0.2,0.2" opacity="0.5" />
                                        {/* Main Body */}
                                        <path d={`M ${-r} ${-halfH} L ${-r} ${halfH} A ${r} ${r * 0.3} 0 0 0 ${r} ${halfH} L ${r} ${-halfH} Z`} />
                                        {/* Top ellipse */}
                                        <ellipse cx="0" cy={-halfH} rx={r} ry={r * 0.3} />
                                    </g>
                                );
                            })()}

                            {solidType === 'Cone' && (() => {
                                const r = params.radius;
                                const h = params.height;
                                const halfH = h / 2;
                                return (
                                    <g stroke={tc} strokeWidth="0.1" fill={`${tc}20`} strokeLinecap="round" strokeLinejoin="round">
                                        {/* Base hidden part */}
                                        <path d={`M ${-r} ${halfH} A ${r} ${r * 0.3} 0 0 1 ${r} ${halfH}`} fill="none" strokeDasharray="0.2,0.2" opacity="0.5" />
                                        {/* Main Cone Body */}
                                        <path d={`M 0 ${-halfH} L ${-r} ${halfH} A ${r} ${r * 0.3} 0 0 0 ${r} ${halfH} Z`} />
                                    </g>
                                );
                            })()}

                            {solidType === 'Toro' && (() => {
                                const R = params.majorRadius;
                                const r = params.radius;
                                return (
                                    <g>
                                        <defs>
                                            <radialGradient id="torusGrad" cx="30%" cy="30%" r="70%">
                                                <stop offset="0%" stopColor={tc} stopOpacity="0.8" />
                                                <stop offset="100%" stopColor={tc} stopOpacity="0.2" />
                                            </radialGradient>
                                        </defs>
                                        {/* Outer circle */}
                                        <ellipse cx="0" cy="0" rx={R + r} ry={(R + r) * 0.4} fill="url(#torusGrad)" stroke={tc} strokeWidth="0.1" />
                                        {/* Inner hole */}
                                        <ellipse cx="0" cy="0" rx={R - r} ry={(R - r) * 0.4} fill="#0f172a" stroke={tc} strokeWidth="0.1" opacity="0.9" />
                                        {/* 3D wireframe arcs to show depth */}
                                        <path d={`M ${-(R + r)} 0 A ${r} ${r * 0.4} 0 0 1 ${-(R - r)} 0`} fill="none" stroke={tc} strokeWidth="0.05" opacity="0.5" />
                                        <path d={`M ${(R - r)} 0 A ${r} ${r * 0.4} 0 0 1 ${(R + r)} 0`} fill="none" stroke={tc} strokeWidth="0.05" opacity="0.5" />
                                    </g>
                                );
                            })()}

                            {solidType === 'Romboide' && (() => {
                                const a = params.edge;
                                const b = params.width;
                                const h = params.height;
                                const o = b / 2; // depth offset for isometric illusion
                                return (
                                    <g stroke={tc} strokeWidth="0.1" fill={`${tc}20`} strokeLinecap="round" strokeLinejoin="round">
                                        {/* Back face */}
                                        <rect x={-a / 2 + o} y={-h / 2 - o} width={a} height={h} strokeDasharray="0.2,0.2" fill="none" opacity="0.5" />
                                        {/* Connections */}
                                        <line x1={-a / 2} y1={-h / 2} x2={-a / 2 + o} y2={-h / 2 - o} strokeDasharray="0.2,0.2" opacity="0.5" />
                                        <line x1={a / 2} y1={-h / 2} x2={a / 2 + o} y2={-h / 2 - o} />
                                        <line x1={a / 2} y1={h / 2} x2={a / 2 + o} y2={h / 2 - o} />
                                        <line x1={-a / 2} y1={h / 2} x2={-a / 2 + o} y2={h / 2 - o} />
                                        {/* Front face */}
                                        <rect x={-a / 2} y={-h / 2} width={a} height={h} />
                                    </g>
                                );
                            })()}
                        </svg>
                    </div>
                </div>

                {/* Mathematical Formula Card */}
                <div className="glass-panel rounded-2xl p-6 border-l-4" style={{ borderColor: tc }}>
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        <Calculator className="w-5 h-5 text-slate-300" style={{ color: tc }} />
                        Cálculo do Volume
                    </h3>
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-slate-900/40 p-4 rounded-xl border border-slate-700/30">
                        <div className="text-center md:text-left">
                            <p className="text-slate-400 text-sm mb-1">Equação Matemática</p>
                            <p className="text-2xl font-bold font-mono text-slate-200 tracking-wider">
                                {mathInfo.formula}
                            </p>
                        </div>
                        <div className="hidden md:block w-px h-16 bg-slate-700/50"></div>
                        <div className="text-center md:text-left flex-1">
                            <p className="text-slate-400 text-sm mb-1">Resultado Atual</p>
                            <p className="text-xl font-bold font-mono text-slate-200">
                                {mathInfo.calculation}
                            </p>
                            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                                {mathInfo.desc}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Video Links Panel */}
                <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group border-l-4" style={{ borderColor: tc }}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-red-500/10 transition-colors duration-500" />

                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        <PlayCircle className="w-5 h-5 text-red-500" />
                        Videoaulas Recomendadas
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getVideos().map((v) => (
                            <a
                                key={v.id}
                                href={`https://www.youtube.com/watch?v=${v.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/card flex flex-col rounded-xl overflow-hidden border border-slate-700/50 hover:border-red-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] bg-slate-900/40 hover:bg-slate-800/60"
                            >
                                {/* Thumbnail */}
                                <div className="relative w-full aspect-video bg-black overflow-hidden">
                                    <img
                                        src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                                        alt={v.title}
                                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                                        onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${v.id}/mqdefault.jpg`; }}
                                    />
                                    {/* Play overlay */}
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                                        <div className="w-14 h-14 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg">
                                            <PlayCircle className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    {/* YouTube badge */}
                                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                        YT
                                    </span>
                                </div>
                                {/* Info */}
                                <div className="p-3 flex flex-col gap-1">
                                    <p className="text-sm font-medium text-slate-200 line-clamp-2 group-hover/card:text-white leading-snug">{v.title}</p>
                                    <p className="text-xs text-slate-500">{v.channel}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                    <p className="text-xs text-slate-600 mt-3 text-center">Clique em um vídeo para abrir no YouTube ↗</p>
                </div>

            </div>

            {/* Right Column: Parameters */}
            <div className="glass-panel rounded-2xl p-6 h-fit sticky top-24">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Parâmetros</h2>
                </div>

                <div className="space-y-6">
                    {(solidType === 'Cubo' || solidType === 'Romboide') && (
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-slate-300">Comprimento (a)</label>
                                <span className="text-sm font-mono px-2 py-0.5 rounded" style={{ color: tc, backgroundColor: `${tc}20` }}>{params.edge.toFixed(1)}</span>
                            </div>
                            <input
                                type="range" min="0.5" max="5.0" step="0.1" value={params.edge}
                                onChange={(e) => handleParamChange('edge', parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: tc }}
                            />
                            <p className="text-xs text-slate-500">Mede a extensão da base horizontal.</p>
                        </div>
                    )}

                    {solidType === 'Romboide' && (
                        <div className="space-y-3 pt-4 border-t border-slate-700/50">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-slate-300">Largura (b)</label>
                                <span className="text-sm font-mono px-2 py-0.5 rounded" style={{ color: tc, backgroundColor: `${tc}20` }}>{params.width.toFixed(1)}</span>
                            </div>
                            <input
                                type="range" min="0.5" max="5.0" step="0.1" value={params.width}
                                onChange={(e) => handleParamChange('width', parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: tc }}
                            />
                            <p className="text-xs text-slate-500">Mede a profundidade da base.</p>
                        </div>
                    )}

                    {solidType === 'Toro' && (
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-slate-300">Raio Maior (R)</label>
                                <span className="text-sm font-mono px-2 py-0.5 rounded" style={{ color: tc, backgroundColor: `${tc}20` }}>{params.majorRadius.toFixed(1)}</span>
                            </div>
                            <input
                                type="range" min="1.0" max="4.0" step="0.1" value={params.majorRadius}
                                onChange={(e) => handleParamChange('majorRadius', parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: tc }}
                            />
                            <p className="text-xs text-slate-500">Distância do centro de revolução até o centro do tubo.</p>
                        </div>
                    )}

                    {(solidType === 'Esfera' || solidType === 'Cilindro' || solidType === 'Cone' || solidType === 'Toro') && (
                        <div className="space-y-3 pt-4 border-t border-slate-700/50">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-slate-300">{solidType === 'Toro' ? 'Raio Menor (r)' : 'Raio (r)'}</label>
                                <span className="text-sm font-mono px-2 py-0.5 rounded" style={{ color: tc, backgroundColor: `${tc}20` }}>{params.radius.toFixed(1)}</span>
                            </div>
                            <input
                                type="range" min="0.5" max="4.0" step="0.1" value={params.radius}
                                onChange={(e) => handleParamChange('radius', parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: tc }}
                            />
                            <p className="text-xs text-slate-500">{solidType === 'Toro' ? 'Raio da seção transversal do tubo.' : 'Distância do centro até a borda circular.'}</p>
                        </div>
                    )}

                    {(solidType === 'Cilindro' || solidType === 'Cone' || solidType === 'Romboide') && (
                        <div className="space-y-3 pt-4 border-t border-slate-700/50">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-slate-300">Altura (h)</label>
                                <span className="text-sm font-mono px-2 py-0.5 rounded" style={{ color: tc, backgroundColor: `${tc}20` }}>{params.height.toFixed(1)}</span>
                            </div>
                            <input
                                type="range" min="1.0" max="8.0" step="0.1" value={params.height}
                                onChange={(e) => handleParamChange('height', parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: tc }}
                            />
                            <p className="text-xs text-slate-500">Distância vertical entre as extremidades.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
