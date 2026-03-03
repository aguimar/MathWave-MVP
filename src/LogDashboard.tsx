import React, { useState, useMemo, useCallback } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
    ReferenceLine, Tooltip, ReferenceDot, Label,
} from 'recharts';

// ─── Helpers ────────────────────────────────────────────────────────────────
const LOG_YMAX = 1000; // visual clamp for exponential
const CLAMP = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function logB(x: number, b: number): number | null {
    if (x <= 0 || b <= 0 || Math.abs(b - 1) < 1e-9) return null;
    return Math.log(x) / Math.log(b);
}

function expB(x: number, b: number): number {
    const raw = Math.pow(b, x);
    return CLAMP(raw, -LOG_YMAX, LOG_YMAX);
}

// Generate 400-point data for the exponential curve x ∈ [-6, 6]
function genExpData(b: number) {
    const pts = [];
    for (let i = 0; i <= 400; i++) {
        const x = -6 + (i / 400) * 12;
        const y = expB(x, b);
        pts.push({ x, y });
    }
    return pts;
}

// Generate 400-point data for the log curve x ∈ [0.01, 256]
function genLogData(b: number) {
    const pts = [];
    for (let i = 0; i <= 400; i++) {
        const x = 0.01 + (i / 400) * 255.99;
        const y = logB(x, b);
        if (y === null || !isFinite(y)) continue;
        pts.push({ x, y: CLAMP(y, -10, 10) });
    }
    return pts;
}

// Mirror line y=x: shared domain -8..8
function genMirrorData() {
    return [-8, -4, 0, 4, 8].map(v => ({ x: v, y: v }));
}

function fmt(v: number, digits = 4) {
    if (!isFinite(v)) return '∞';
    if (Math.abs(v) > 9999) return v.toExponential(2);
    return v.toFixed(digits);
}

function fmtShort(v: number) { return fmt(v, 3); }

// ─── Sub-component: Slider ───────────────────────────────────────────────────
interface SliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    color: string;
    onChange: (v: number) => void;
    format?: (v: number) => string;
}
function Slider({ label, value, min, max, step, color, onChange, format }: SliderProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
                <span className="text-sm font-bold font-mono" style={{ color }}>{format ? format(value) : value.toFixed(2)}</span>
            </div>
            <input
                type="range" min={min} max={max} step={step} value={value}
                onChange={e => onChange(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: color }}
            />
            <div className="flex justify-between text-xs text-slate-600 font-mono">
                <span>{min}</span><span>{max}</span>
            </div>
        </div>
    );
}

// ─── Custom tooltip ──────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono shadow-xl">
            <p className="text-slate-400">x = <span className="text-white">{Number(label).toFixed(3)}</span></p>
            {payload.map((p: any) => (
                <p key={p.dataKey} style={{ color: p.color }}>
                    y = {Number(p.value).toFixed(4)}
                </p>
            ))}
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LogDashboard() {
    const [base, setBaseRaw] = useState(2);
    const [xExp, setXExp] = useState(2);
    const [xLog, setXLog] = useState(4);
    // Properties section
    const [propA, setPropA] = useState(10);
    const [propB, setPropB] = useState(5);

    // Base change with snap-away-from-1 logic
    const setBase = useCallback((v: number) => {
        if (Math.abs(v - 1) < 0.05) v = v < 1 ? 0.9 : 1.1;
        setBaseRaw(CLAMP(v, 0.2, 10));
    }, []);

    // Computed values
    const yExp = expB(xExp, base);
    const logY = logB(yExp, base); // should ≈ xExp
    const isOverflow = Math.pow(base, xExp) > LOG_YMAX;
    const isBadLogDomain = xLog <= 0;

    // Chart data (memoised)
    const expData = useMemo(() => genExpData(base), [base]);
    const logData = useMemo(() => genLogData(base), [base]);
    const mirrorData = genMirrorData();

    // Properties
    const propLog = (x: number) => logB(x, base) ?? 0;
    const propLogAB = propLog(propA * propB);
    const propLogA = propLog(propA);
    const propLogB_val = propLog(propB);
    const propLHS = propLogAB;
    const propRHS = propLogA + propLogB_val;

    // Linear vs log scale samples
    const scaleSamples = [10, 100, 1000, 1_000_000];
    const maxLinear = 1_000_000;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pb-16">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="px-8 py-6 border-b border-slate-800">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400">
                            Logaritmos & Exponenciais
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Visualize que <code className="text-emerald-400">b^x = y</code> é o mesmo que{' '}
                            <code className="text-cyan-400">log_b(y) = x</code> &mdash; e que os gráficos são reflexos em <strong>y = x</strong>
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                        <span className="text-slate-400 text-sm">Base atual:</span>
                        <span className="text-2xl font-bold font-mono text-emerald-400">b = {base.toFixed(1)}</span>
                    </div>
                </div>
            </div>

            <div className="px-6 pt-6 space-y-8">

                {/* ── Dual Charts ──────────────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-6">

                    {/* Exponential */}
                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Exponencial</h2>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">y = b<sup>x</sup></p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-0.5 bg-emerald-400 rounded" />
                                <span className="text-xs text-slate-400">b<sup>x</sup></span>
                                <div className="w-3 h-0.5 bg-slate-500 rounded border-dashed" />
                                <span className="text-xs text-slate-400">y = x</span>
                            </div>
                        </div>
                        {isOverflow && (
                            <div className="mb-2 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-400">
                                ⚠ valor capado em {LOG_YMAX.toLocaleString()}
                            </div>
                        )}
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={expData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="x" type="number" domain={[-8, 8]} tickCount={9}
                                    tick={{ fill: '#475569', fontSize: 10 }} />
                                <YAxis type="number" domain={[-8, 8]} tickCount={9}
                                    tick={{ fill: '#475569', fontSize: 10 }} />
                                <Tooltip content={<ChartTooltip />} />
                                {/* Mirror line y=x */}
                                <Line data={mirrorData} type="linear" dataKey="y" stroke="#475569"
                                    strokeDasharray="5 4" strokeWidth={1} dot={false} isAnimationActive={false} />
                                {/* Curve */}
                                <Line data={expData} type="monotone" dataKey="y" stroke="#34d399"
                                    strokeWidth={2.5} dot={false} isAnimationActive={false} />
                                {/* Highlighted point */}
                                <ReferenceDot x={xExp} y={CLAMP(yExp, -8, 8)} r={7}
                                    fill="#34d399" stroke="#fff" strokeWidth={2} />
                                <ReferenceLine x={xExp} stroke="#34d399" strokeDasharray="4 3" strokeOpacity={0.4} />
                                <ReferenceLine y={CLAMP(yExp, -8, 8)} stroke="#34d399" strokeDasharray="4 3" strokeOpacity={0.4} />
                            </LineChart>
                        </ResponsiveContainer>
                        <p className="text-center text-xs text-slate-500 mt-2 font-mono">
                            ({xExp.toFixed(2)}, {fmtShort(yExp)})
                        </p>
                    </div>

                    {/* Logarithmic */}
                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Logarítmica</h2>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">y = log<sub>b</sub>(x)</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-0.5 bg-cyan-400 rounded" />
                                <span className="text-xs text-slate-400">log<sub>b</sub>(x)</span>
                                <div className="w-3 h-0.5 bg-slate-500 rounded border-dashed" />
                                <span className="text-xs text-slate-400">y = x</span>
                            </div>
                        </div>
                        {isBadLogDomain && (
                            <div className="mb-2 px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400">
                                domínio: x &gt; 0
                            </div>
                        )}
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={logData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="x" type="number" domain={[-8, 8]} tickCount={9}
                                    tick={{ fill: '#475569', fontSize: 10 }} />
                                <YAxis type="number" domain={[-8, 8]} tickCount={9}
                                    tick={{ fill: '#475569', fontSize: 10 }} />
                                <Tooltip content={<ChartTooltip />} />
                                {/* Mirror line */}
                                <Line data={mirrorData} type="linear" dataKey="y" stroke="#475569"
                                    strokeDasharray="5 4" strokeWidth={1} dot={false} isAnimationActive={false} />
                                {/* Curve */}
                                <Line data={logData} type="monotone" dataKey="y" stroke="#22d3ee"
                                    strokeWidth={2.5} dot={false} isAnimationActive={false} />
                                {/* Highlighted point — coordinates are SWAPPED (the inverse) */}
                                <ReferenceDot
                                    x={CLAMP(yExp, 0.01, 8)}
                                    y={CLAMP(xExp, -8, 8)}
                                    r={7} fill="#22d3ee" stroke="#fff" strokeWidth={2} />
                                <ReferenceLine x={CLAMP(yExp, 0.01, 8)} stroke="#22d3ee" strokeDasharray="4 3" strokeOpacity={0.4} />
                                <ReferenceLine y={CLAMP(xExp, -8, 8)} stroke="#22d3ee" strokeDasharray="4 3" strokeOpacity={0.4} />
                            </LineChart>
                        </ResponsiveContainer>
                        <p className="text-center text-xs text-slate-500 mt-2 font-mono">
                            ({fmtShort(yExp)}, {xExp.toFixed(2)}) &nbsp;←&nbsp; coordenadas trocadas!
                        </p>
                    </div>
                </div>

                {/* ── Sliders ───────────────────────────────────────────────── */}
                <div className="grid grid-cols-3 gap-6 bg-slate-800/30 border border-slate-700/40 rounded-2xl p-6">
                    <Slider label="Base  b" value={base} min={0.2} max={10} step={0.1}
                        color="#34d399" onChange={setBase}
                        format={v => v.toFixed(1) + (Math.abs(v - 1) < 0.05 ? ' (≠1)' : '')} />
                    <Slider label="Expoente  x" value={xExp} min={-6} max={6} step={0.1}
                        color="#818cf8" onChange={setXExp} />
                    <Slider label="Entrada log  x" value={xLog} min={0.01} max={256} step={0.01}
                        color="#f59e0b" onChange={setXLog}
                        format={v => v.toFixed(2)} />
                </div>

                {/* ── Equivalence Card ─────────────────────────────────────── */}
                <div className="bg-gradient-to-r from-emerald-900/30 via-slate-800/60 to-cyan-900/30 border border-slate-600/50 rounded-2xl p-7">
                    <h2 className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
                        Equivalência em Tempo Real
                    </h2>
                    <div className="flex items-center justify-center gap-8 flex-wrap">
                        {/* Exponential side */}
                        <div className="text-center">
                            <p className="text-xs text-slate-500 mb-1 font-mono">Forma Exponencial</p>
                            <p className="font-mono text-2xl">
                                <span className="text-emerald-400">{base.toFixed(1)}</span>
                                <sup className="text-emerald-300 text-lg">{xExp.toFixed(2)}</sup>
                                <span className="text-slate-400 mx-2">=</span>
                                <span className="text-white font-bold">{fmtShort(yExp)}</span>
                            </p>
                        </div>

                        {/* Central arrow */}
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-16 h-px bg-gradient-to-r from-emerald-400 to-cyan-400" />
                            <span className="text-xs text-slate-500 px-2 font-mono">⇔</span>
                            <div className="w-16 h-px bg-gradient-to-r from-cyan-400 to-emerald-400" />
                        </div>

                        {/* Log side */}
                        <div className="text-center">
                            <p className="text-xs text-slate-500 mb-1 font-mono">Forma Logarítmica</p>
                            <p className="font-mono text-2xl">
                                <span className="text-slate-300">log</span>
                                <sub className="text-cyan-400 text-sm">{base.toFixed(1)}</sub>
                                <span className="text-slate-400">(</span>
                                <span className="text-white font-bold">{fmtShort(yExp)}</span>
                                <span className="text-slate-400">)</span>
                                <span className="text-slate-400 mx-2">=</span>
                                <span className="text-cyan-400 font-bold">
                                    {logY !== null && isFinite(logY) ? fmtShort(logY) : '∞'}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Proof bar */}
                    <div className="mt-6 flex justify-center">
                        <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 font-mono text-sm">
                            <span className="text-slate-400">log</span>
                            <sub className="text-emerald-400">{base.toFixed(1)}</sub>
                            <span className="text-slate-300">({fmtShort(yExp)}) =</span>
                            <span className="text-cyan-400 font-bold">
                                {logY !== null && isFinite(logY) ? logY.toFixed(6) : '—'}
                            </span>
                            <span className="text-slate-500">≈ x = {xExp.toFixed(2)}</span>
                            <span className="text-emerald-400 font-bold ml-2">
                                {logY !== null && Math.abs(logY - xExp) < 0.001 ? '✓' : ''}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Linear vs Log Scale ───────────────────────────────────── */}
                <div className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">
                        Escala Linear vs Escala Logarítmica
                    </h2>
                    <p className="text-xs text-slate-500 mb-6">
                        Valores muito diferentes cabem numa escala logarítmica compacta. Base 10.
                    </p>

                    <div className="space-y-4">
                        {scaleSamples.map(v => {
                            const logVal = Math.log10(v);
                            const linearPct = (v / maxLinear) * 100;
                            const logPct = (logVal / 6) * 100; // log10(1e6)=6
                            return (
                                <div key={v} className="grid grid-cols-[90px_1fr_70px_1fr_60px] gap-3 items-center">
                                    <span className="text-xs font-mono text-slate-400 text-right">
                                        {v >= 1000 ? v.toLocaleString('pt-BR') : v}
                                    </span>
                                    {/* Linear bar */}
                                    <div className="h-3 bg-slate-700/60 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-400 transition-all"
                                            style={{ width: `${linearPct}%` }}
                                        />
                                    </div>
                                    {/* Arrow + label */}
                                    <div className="text-center">
                                        <span className="text-xs text-slate-500 font-mono">→ log = </span>
                                    </div>
                                    {/* Log bar */}
                                    <div className="h-3 bg-slate-700/60 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all"
                                            style={{ width: `${logPct}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold font-mono text-amber-400">
                                        {logVal.toFixed(1)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-4 flex gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-2 rounded-full bg-gradient-to-r from-violet-500 to-violet-400" />
                            <span className="text-xs text-slate-400">Escala linear</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400" />
                            <span className="text-xs text-slate-400">log₁₀ (escala logarítmica)</span>
                        </div>
                    </div>
                </div>

                {/* ── Properties Section ────────────────────────────────────── */}
                <div className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">
                        Propriedades Interativas
                    </h2>
                    <p className="text-xs text-slate-500 mb-6">
                        Demonstra que <code className="text-pink-400">log(a·b) = log(a) + log(b)</code>{' '}
                        usando a base b = <strong className="text-emerald-400">{base.toFixed(1)}</strong> do slider acima.
                    </p>

                    {/* Inputs a, b */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <Slider label="a" value={propA} min={0.01} max={1000} step={0.01}
                            color="#f472b6" onChange={setPropA} format={v => v.toFixed(2)} />
                        <Slider label="b" value={propB} min={0.01} max={1000} step={0.01}
                            color="#c084fc" onChange={setPropB} format={v => v.toFixed(2)} />
                    </div>

                    {/* Results grid */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'log(a)', value: propLogA, color: '#f472b6', formula: `log${base.toFixed(1)}(${propA.toFixed(2)})` },
                            { label: 'log(b)', value: propLogB_val, color: '#c084fc', formula: `log${base.toFixed(1)}(${propB.toFixed(2)})` },
                            { label: 'log(a) + log(b)', value: propRHS, color: '#818cf8', formula: 'soma' },
                        ].map(item => (
                            <div key={item.label}
                                className="rounded-xl border p-4 text-center"
                                style={{ borderColor: `${item.color}30`, background: `${item.color}08` }}>
                                <span className="text-xs text-slate-500 font-mono block mb-1">{item.formula}</span>
                                <span className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: item.color }}>
                                    {item.label}
                                </span>
                                <span className="text-xl font-bold font-mono" style={{ color: item.color }}>
                                    {isFinite(item.value) ? item.value.toFixed(5) : '—'}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Big equality */}
                    <div className="mt-5 rounded-xl bg-slate-900/60 border border-slate-700/50 p-4 text-center font-mono">
                        <span className="text-slate-300">log</span>
                        <sub className="text-emerald-400">{base.toFixed(1)}</sub>
                        <span className="text-slate-300">
                            ({propA.toFixed(2)} × {propB.toFixed(2)}) = log({propA.toFixed(2)} · {propB.toFixed(2)}) =
                        </span>
                        <span className="text-pink-400 font-bold ml-2 text-lg">{isFinite(propLHS) ? propLHS.toFixed(5) : '—'}</span>
                        <br />
                        <span className="text-slate-500 text-xs">log(a) + log(b) =</span>
                        <span className="text-pink-400 font-bold ml-2">{fmtShort(propLogA)} + {fmtShort(propLogB_val)} = </span>
                        <span className="text-pink-300 font-bold">{isFinite(propRHS) ? propRHS.toFixed(5) : '—'}</span>
                        {isFinite(propLHS) && isFinite(propRHS) && Math.abs(propLHS - propRHS) < 0.0001 && (
                            <span className="ml-3 text-emerald-400 text-base">✓ Verificado!</span>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
