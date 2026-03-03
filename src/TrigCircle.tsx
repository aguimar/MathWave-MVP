import React, { useState, useCallback, useRef, useEffect } from 'react';

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────
interface FuncValue {
    label: string;
    value: number | null; // null = undefined (e.g. tan at 90°)
    color: string;
    symbol: string;
    formula: string;
}

// ────────────────────────────────────────────────────────────────────────────
// Constants – SVG coordinate system centred at (0,0); radius = 1
// We'll use a viewBox of -3 -2.5 6 5 to leave breathing room all around
// ────────────────────────────────────────────────────────────────────────────
const R = 1; // unit circle radius
const COLORS = {
    sen: '#06b6d4',   // cyan
    cos: '#8b5cf6',   // violet
    tan: '#f59e0b',   // amber
    cot: '#10b981',   // emerald
    sec: '#f43f5e',   // rose
    csc: '#ec4899',   // pink
    axes: '#334155',  // slate-700
    circle: '#1e293b', // slate-800
    point: '#ffffff',
    grid: '#1e293b',
};

// Helper: clamp display of near-infinite
const NEAR_INF = 50;
function clampVal(v: number): number | null {
    if (!isFinite(v) || Math.abs(v) > NEAR_INF) return null;
    return v;
}

function fmt(v: number | null): string {
    if (v === null) return '∞';
    return v.toFixed(4);
}

function fmtShort(v: number | null): string {
    if (v === null) return '∞';
    return v.toFixed(3);
}

// ────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────
export default function TrigCircle() {
    const [angle, setAngle] = useState(0.785398); // 45°
    const [isDragging, setIsDragging] = useState(false);
    const [isAnimating, setIsAnimating] = useState(true);
    const svgRef = useRef<SVGSVGElement>(null);
    const rafRef = useRef<number>(0);
    const lastTimeRef = useRef<number | null>(null);

    // Animation loop
    useEffect(() => {
        if (!isAnimating) return;
        const animate = (time: number) => {
            if (lastTimeRef.current === null) lastTimeRef.current = time;
            const dt = time - lastTimeRef.current;
            lastTimeRef.current = time;
            setAngle(prev => (prev + dt * 0.0005) % (2 * Math.PI));
            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [isAnimating]);

    // Convert SVG event to angle
    const angleFromSvg = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
        const svg = svgRef.current;
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        const vb = svg.viewBox.baseVal;
        const scaleX = vb.width / rect.width;
        const scaleY = vb.height / rect.height;
        const svgX = (e.clientX - rect.left) * scaleX + vb.x;
        const svgY = (e.clientY - rect.top) * scaleY + vb.y;
        // origin is at (0,0) in our viewBox
        const a = Math.atan2(-svgY, svgX); // y-axis is inverted in SVG
        setAngle(a < 0 ? a + 2 * Math.PI : a);
    }, []);

    const handlePointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
        setIsAnimating(false);
        setIsDragging(true);
        lastTimeRef.current = null;
        angleFromSvg(e);
        (e.target as Element).setPointerCapture(e.pointerId);
    }, [angleFromSvg]);

    const handlePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
        if (!isDragging) return;
        angleFromSvg(e);
    }, [isDragging, angleFromSvg]);

    const handlePointerUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // ── Math ────────────────────────────────────────────────────────────────
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const tanA = clampVal(Math.tan(angle));
    const cotA = clampVal(cosA / sinA);
    const secA = clampVal(1 / cosA);
    const cscA = clampVal(1 / sinA);

    const deg = ((angle * 180) / Math.PI).toFixed(1);

    // Point on circle
    const px = cosA;
    const py = -sinA; // SVG inverted y

    // --- Segment endpoints ---
    // SEN: vertical from (cos,0) to  (cos, sin) on circle
    const senX1 = cosA; const senY1 = 0;
    const senX2 = cosA; const senY2 = -sinA;

    // COS: horizontal from (0,0) to (cos, 0)
    const cosX1 = 0; const cosY1 = 0;
    const cosX2 = cosA; const cosY2 = 0;

    // TAN: tangent segment from (1,0) to (1, tan)
    const tanVisible = tanA !== null;
    const tanX1 = 1; const tanY1 = 0;
    const tanX2 = 1; const tanY2 = tanA !== null ? -tanA : 0;

    // COT: tangent segment from (0,1) to (cot, 1)
    const cotVisible = cotA !== null;
    const cotX1 = 0; const cotY1 = -1;
    const cotX2 = cotA !== null ? cotA : 0; const cotY2 = -1;

    // SEC: from origin to intersection of x-axis extension with tangent at P
    // Defined as 1/cos: point (sec, 0)
    const secVisible = secA !== null;
    const secEndX = secA !== null ? secA : 0;

    // CSC: from origin to (0, csc)
    const cscVisible = cscA !== null;
    const cscEndY = cscA !== null ? -cscA : 0;

    const funcs: FuncValue[] = [
        { label: 'Seno', symbol: 'sen', value: sinA, color: COLORS.sen, formula: 'sen θ = y' },
        { label: 'Cosseno', symbol: 'cos', value: cosA, color: COLORS.cos, formula: 'cos θ = x' },
        { label: 'Tangente', symbol: 'tan', value: tanA, color: COLORS.tan, formula: 'tan θ = sen/cos' },
        { label: 'Cossecante', symbol: 'csc', value: cscA, color: COLORS.csc, formula: 'csc θ = 1/sen' },
        { label: 'Secante', symbol: 'sec', value: secA, color: COLORS.sec, formula: 'sec θ = 1/cos' },
        { label: 'Cotangente', symbol: 'cot', value: cotA, color: COLORS.cot, formula: 'cot θ = cos/sen' },
    ];

    // Quadrant labels
    const quadrant = cosA >= 0 && sinA >= 0 ? 'I' : cosA < 0 && sinA >= 0 ? 'II' : cosA < 0 ? 'III' : 'IV';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-800">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400">
                        Círculo Trigonométrico
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">
                        Arraste o ponto para visualizar todas as funções em tempo real
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-sm font-mono">
                        <span className="text-slate-400">θ = </span>
                        <span className="text-white font-semibold">{deg}°</span>
                        <span className="text-slate-500 ml-3">{(angle).toFixed(4)} rad</span>
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-sm">
                        <span className="text-slate-400">Quadrante </span>
                        <span className="text-white font-bold">{quadrant}</span>
                    </div>
                    <button
                        onClick={() => { setIsAnimating(v => !v); lastTimeRef.current = null; }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${isAnimating
                            ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30'
                            : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-white'}`}
                    >
                        {isAnimating ? '⏸ Pausar' : '▶ Animar'}
                    </button>
                </div>
            </div>

            {/* ── Main Layout ─────────────────────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden">

                {/* ── Left: Function Cards ──────────────────────────────── */}
                <div className="w-64 shrink-0 p-4 flex flex-col gap-2 overflow-y-auto border-r border-slate-800">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Valores Atuais</p>
                    {funcs.map(f => (
                        <div
                            key={f.symbol}
                            className="rounded-xl p-3 border transition-all duration-300"
                            style={{
                                borderColor: `${f.color}40`,
                                background: `${f.color}08`,
                            }}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: f.color }}>
                                    {f.label}
                                </span>
                                <span className="text-xs text-slate-500 font-mono">{f.formula}</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold font-mono" style={{ color: f.color }}>
                                    {fmtShort(f.value)}
                                </span>
                                {f.value === null && (
                                    <span className="text-xs text-slate-500">Indefinido</span>
                                )}
                            </div>
                            {/* Mini progress bar showing the value magnitude */}
                            {f.value !== null && Math.abs(f.value) <= 2 && (
                                <div className="mt-2 h-1 rounded-full bg-slate-700/60 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-100"
                                        style={{
                                            width: `${Math.min(100, Math.abs(f.value) * 50)}%`,
                                            background: f.color,
                                            marginLeft: f.value < 0 ? 'auto' : undefined,
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* ── Center: Interactive SVG ───────────────────────────── */}
                <div className="flex-1 flex items-center justify-center p-6 min-w-0">
                    <svg
                        ref={svgRef}
                        viewBox="-3.2 -2.8 6.4 5.6"
                        className="w-full max-w-[680px] aspect-square select-none cursor-crosshair"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                    >
                        {/* ── Defs: arrow markers ────────────────────────── */}
                        <defs>
                            {/* Radial gradient for the circle fill */}
                            <radialGradient id="circleGlow" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.4" />
                            </radialGradient>
                        </defs>

                        {/* ── Grid lines (subtle) ────────────────────────── */}
                        {[-2, -1, 1, 2].map(v => (
                            <React.Fragment key={v}>
                                <line x1={v} y1="-2.5" x2={v} y2="2.5" stroke="#1e293b" strokeWidth="0.015" />
                                <line x1="-3" y1={v} x2="3" y2={v} stroke="#1e293b" strokeWidth="0.015" />
                            </React.Fragment>
                        ))}

                        {/* ── Unit circle ────────────────────────────────── */}
                        <circle cx="0" cy="0" r={R} fill="url(#circleGlow)" stroke="#334155" strokeWidth="0.03" />

                        {/* ── Axes ───────────────────────────────────────── */}
                        {/* x-axis */}
                        <line x1="-3" y1="0" x2="3" y2="0" stroke="#475569" strokeWidth="0.025" />
                        {/* y-axis */}
                        <line x1="0" y1="-2.5" x2="0" y2="2.5" stroke="#475569" strokeWidth="0.025" />

                        {/* Axis arrow tips */}
                        <polygon points="3,0 2.95,-0.04 2.95,0.04" fill="#475569" />
                        <polygon points="0,-2.5 -0.04,-2.45 0.04,-2.45" fill="#475569" />

                        {/* Axis labels */}
                        <text x="3.05" y="0.08" fontSize="0.14" fill="#64748b" fontFamily="monospace">x</text>
                        <text x="0.07" y="-2.55" fontSize="0.14" fill="#64748b" fontFamily="monospace">y</text>

                        {/* Tick marks */}
                        {[-2, -1, 1, 2].map(v => (
                            <React.Fragment key={v}>
                                <line x1={v} y1="-0.05" x2={v} y2="0.05" stroke="#475569" strokeWidth="0.02" />
                                <text x={v - 0.05} y="0.2" fontSize="0.12" fill="#475569" fontFamily="monospace">{v}</text>
                                <line x1="-0.05" y1={-v} x2="0.05" y2={-v} stroke="#475569" strokeWidth="0.02" />
                                <text x="-0.25" y={-v + 0.05} fontSize="0.12" fill="#475569" fontFamily="monospace">{v}</text>
                            </React.Fragment>
                        ))}

                        {/* Notable angle markers: 30, 45, 60, 90... */}
                        {[30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330].map(d => {
                            const a = d * Math.PI / 180;
                            const x1 = Math.cos(a) * 0.94;
                            const y1 = -Math.sin(a) * 0.94;
                            const x2 = Math.cos(a) * 1.06;
                            const y2 = -Math.sin(a) * 1.06;
                            return <line key={d} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#334155" strokeWidth="0.02" />;
                        })}

                        {/* Helpful angle labels at cardinal points */}
                        <text x="1.08" y="0.08" fontSize="0.11" fill="#475569">0°</text>
                        <text x="0.05" y="-1.12" fontSize="0.11" fill="#475569">90°</text>
                        <text x="-1.22" y="0.08" fontSize="0.11" fill="#475569">180°</text>
                        <text x="0.05" y="1.22" fontSize="0.11" fill="#475569">270°</text>

                        {/* ── Radius line from origin to P ───────────────── */}
                        <line
                            x1="0" y1="0"
                            x2={px} y2={py}
                            stroke="#475569"
                            strokeWidth="0.025"
                            strokeDasharray="0.06 0.04"
                        />

                        {/* ── COSENO segment (x-axis projection) ────────── */}
                        <line
                            x1={cosX1} y1={cosY1}
                            x2={cosX2} y2={cosY2}
                            stroke={COLORS.cos}
                            strokeWidth="0.04"
                            strokeLinecap="round"
                        />
                        {/* COS label */}
                        <text
                            x={(cosX1 + cosX2) / 2}
                            y="-0.12"
                            fontSize="0.12"
                            fill={COLORS.cos}
                            textAnchor="middle"
                            fontWeight="bold"
                        >cos</text>

                        {/* ── SENO segment (vertical projection) ────────── */}
                        <line
                            x1={senX1} y1={senY1}
                            x2={senX2} y2={senY2}
                            stroke={COLORS.sen}
                            strokeWidth="0.04"
                            strokeLinecap="round"
                        />
                        {/* SEN label */}
                        <text
                            x={senX2 + (cosA >= 0 ? 0.15 : -0.15)}
                            y={(senY1 + senY2) / 2 + 0.04}
                            fontSize="0.12"
                            fill={COLORS.sen}
                            textAnchor="middle"
                            fontWeight="bold"
                        >sen</text>

                        {/* ── TANGENTE segment ───────────────────────────── */}
                        {tanVisible && (
                            <>
                                {/* vertical line at x=1 */}
                                <line
                                    x1={tanX1} y1={tanY1}
                                    x2={tanX2} y2={tanY2}
                                    stroke={COLORS.tan}
                                    strokeWidth="0.04"
                                    strokeLinecap="round"
                                />
                                {/* hypotenuse from origin to tan point */}
                                <line
                                    x1="0" y1="0"
                                    x2={tanX2} y2={tanY2}
                                    stroke={COLORS.tan}
                                    strokeWidth="0.018"
                                    strokeDasharray="0.05 0.03"
                                    opacity="0.6"
                                />
                                <text
                                    x="1.25"
                                    y={(tanY1 + tanY2) / 2 + 0.04}
                                    fontSize="0.12"
                                    fill={COLORS.tan}
                                    fontWeight="bold"
                                >tan</text>
                            </>
                        )}

                        {/* ── COTANGENTE segment ────────────────────────── */}
                        {cotVisible && (
                            <>
                                <line
                                    x1={cotX1} y1={cotY1}
                                    x2={cotX2} y2={cotY2}
                                    stroke={COLORS.cot}
                                    strokeWidth="0.04"
                                    strokeLinecap="round"
                                />
                                <line
                                    x1="0" y1="0"
                                    x2={cotX2} y2={cotY2}
                                    stroke={COLORS.cot}
                                    strokeWidth="0.018"
                                    strokeDasharray="0.05 0.03"
                                    opacity="0.6"
                                />
                                <text
                                    x={(cotX1 + cotX2) / 2}
                                    y="-1.15"
                                    fontSize="0.12"
                                    fill={COLORS.cot}
                                    textAnchor="middle"
                                    fontWeight="bold"
                                >cot</text>
                            </>
                        )}

                        {/* ── SECANTE segment (from origin to x=sec, y=0) ── */}
                        {secVisible && (
                            <>
                                <line
                                    x1="0" y1="0"
                                    x2={secEndX} y2="0"
                                    stroke={COLORS.sec}
                                    strokeWidth="0.035"
                                    strokeLinecap="round"
                                    opacity="0.75"
                                />
                                <text
                                    x={secEndX / 2}
                                    y="0.22"
                                    fontSize="0.12"
                                    fill={COLORS.sec}
                                    textAnchor="middle"
                                    fontWeight="bold"
                                >sec</text>
                                {/* Dot at intersection */}
                                <circle cx={secEndX} cy="0" r="0.04" fill={COLORS.sec} />
                            </>
                        )}

                        {/* ── COSSECANTE segment (from origin to x=0, y=csc) */}
                        {cscVisible && (
                            <>
                                <line
                                    x1="0" y1="0"
                                    x2="0" y2={cscEndY}
                                    stroke={COLORS.csc}
                                    strokeWidth="0.035"
                                    strokeLinecap="round"
                                    opacity="0.75"
                                />
                                <text
                                    x="-0.22"
                                    y={cscEndY / 2 + 0.04}
                                    fontSize="0.12"
                                    fill={COLORS.csc}
                                    textAnchor="middle"
                                    fontWeight="bold"
                                >csc</text>
                                {/* Dot at intersection */}
                                <circle cx="0" cy={cscEndY} r="0.04" fill={COLORS.csc} />
                            </>
                        )}

                        {/* ── Angle arc (small arc near origin) ─────────── */}
                        {(() => {
                            const arcR = 0.22;
                            const arcX = arcR;
                            const arcY = 0;
                            const arcEndX = cosA * arcR;
                            const arcEndY = -sinA * arcR;
                            const largeArc = angle > Math.PI ? 1 : 0;
                            return (
                                <path
                                    d={`M ${arcX} ${arcY} A ${arcR} ${arcR} 0 ${largeArc} 0 ${arcEndX} ${arcEndY}`}
                                    fill="none"
                                    stroke="#64748b"
                                    strokeWidth="0.02"
                                />
                            );
                        })()}
                        {/* Angle label */}
                        <text
                            x={cosA * 0.35}
                            y={-sinA * 0.35 + 0.06}
                            fontSize="0.13"
                            fill="#94a3b8"
                            textAnchor="middle"
                        >θ</text>

                        {/* ── Dotted projection lines (P to axes) ───────── */}
                        <line
                            x1={px} y1={py}
                            x2={px} y2="0"
                            stroke="#475569"
                            strokeWidth="0.015"
                            strokeDasharray="0.04 0.03"
                        />
                        <line
                            x1={px} y1={py}
                            x2="0" y2={py}
                            stroke="#475569"
                            strokeWidth="0.015"
                            strokeDasharray="0.04 0.03"
                        />

                        {/* ── Point P on circle (draggable) ──────────────── */}
                        {/* Glow ring */}
                        <circle cx={px} cy={py} r="0.12" fill="white" opacity="0.08" />
                        <circle cx={px} cy={py} r="0.07" fill="white" opacity="0.15" />
                        {/* Main dot */}
                        <circle
                            cx={px} cy={py}
                            r="0.055"
                            fill="white"
                            stroke="#94a3b8"
                            strokeWidth="0.02"
                            style={{ cursor: 'grab', filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.6))' }}
                        />
                        {/* Coordinate label near point */}
                        <text
                            x={px + (cosA >= 0 ? 0.14 : -0.14)}
                            y={py - 0.1}
                            fontSize="0.11"
                            fill="#94a3b8"
                            textAnchor={cosA >= 0 ? 'start' : 'end'}
                        >
                            ({fmtShort(cosA)}, {fmtShort(sinA)})
                        </text>
                    </svg>
                </div>

                {/* ── Right: Detailed values panel ─────────────────────── */}
                <div className="w-72 shrink-0 p-4 flex flex-col gap-3 overflow-y-auto border-l border-slate-800">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Detalhe por Função</p>

                    {funcs.map(f => (
                        <div
                            key={f.symbol}
                            className="rounded-xl border overflow-hidden"
                            style={{ borderColor: `${f.color}30` }}
                        >
                            {/* Header strip */}
                            <div
                                className="px-3 py-1.5 flex items-center justify-between"
                                style={{ background: `${f.color}18` }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: f.color }} />
                                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: f.color }}>
                                        {f.label}
                                    </span>
                                </div>
                                <code className="text-xs text-slate-400">{f.formula}</code>
                            </div>

                            {/* Value */}
                            <div className="px-3 py-2.5 bg-slate-900/50">
                                <div className="flex items-baseline justify-between">
                                    <div>
                                        <span className="text-slate-500 text-xs font-mono">{f.symbol}({deg}°) = </span>
                                        <span
                                            className="text-lg font-bold font-mono ml-1"
                                            style={{ color: f.value !== null ? f.color : '#64748b' }}
                                        >
                                            {fmt(f.value)}
                                        </span>
                                    </div>
                                    {f.value !== null && (
                                        <div className="text-xs text-slate-500">
                                            {f.value > 0 ? '(+)' : '(−)'}
                                        </div>
                                    )}
                                </div>

                                {/* Visual bar within ±2 range */}
                                {f.value !== null && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-xs text-slate-600">-2</span>
                                        <div className="flex-1 h-1.5 rounded-full bg-slate-800 relative">
                                            <div
                                                className="absolute top-0 h-full w-0.5 rounded-full bg-slate-600"
                                                style={{ left: '50%' }}
                                            />
                                            <div
                                                className="absolute top-0 h-full rounded-full transition-all duration-75"
                                                style={{
                                                    background: f.color,
                                                    width: `${Math.min(50, Math.abs(f.value) * 25)}%`,
                                                    left: f.value >= 0 ? '50%' : `${50 - Math.min(50, Math.abs(f.value) * 25)}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-600">+2</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Identity reminder */}
                    <div className="mt-2 rounded-xl border border-slate-700/40 bg-slate-800/30 p-3">
                        <p className="text-xs font-semibold text-slate-400 mb-2">Identidades Fundamentais</p>
                        <div className="space-y-1 font-mono text-xs text-slate-500">
                            <div>sen²θ + cos²θ = <span className="text-cyan-400">{(sinA * sinA + cosA * cosA).toFixed(4)}</span></div>
                            {secA !== null && <div>1 + tan²θ = sec²θ: <span className="text-rose-400">{(1 + (tanA ?? 0) ** 2).toFixed(2)} ≈ {(secA ** 2).toFixed(2)}</span></div>}
                            {cscA !== null && <div>1 + cot²θ = csc²θ: <span className="text-pink-400">{cotA !== null ? (1 + cotA ** 2).toFixed(2) : '∞'} ≈ {(cscA ** 2).toFixed(2)}</span></div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
