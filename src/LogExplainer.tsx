import React, { useState, useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    ResponsiveContainer, ReferenceLine, ReferenceDot, Tooltip
} from 'recharts';

// ── Types ───────────────────────────────────────────────────────────────────
type Tab = 'definicao' | 'propriedades' | 'leis' | 'videos';

// ── Helpers ─────────────────────────────────────────────────────────────────
function logBase(base: number, x: number): number | null {
    if (x <= 0 || base <= 0 || base === 1) return null;
    return Math.log(x) / Math.log(base);
}

// ── Chart data ───────────────────────────────────────────────────────────────
function buildLogData(base: number) {
    const pts: { x: number; y: number | null }[] = [];
    for (let i = 0.05; i <= 20; i += 0.1) {
        const y = logBase(base, i);
        pts.push({ x: parseFloat(i.toFixed(2)), y: y !== null ? parseFloat(y.toFixed(4)) : null });
    }
    return pts;
}

// ── Video cards (verified IDs) ───────────────────────────────────────────────
const VIDEOS = [
    { id: 'tR6S4dz6UGA', title: 'APRENDA LOGARITMO EM 8 MINUTOS | RÁPIDO e FÁCIL', channel: 'Dicasdemat Sandro Curió' },
    { id: '3gNGS4vzM_o', title: 'Logaritmo: Propriedades Operatórias', channel: 'Prof. Ferretto | ENEM e Vestibulares' },
    { id: 'tR6S4dz6UGA', title: 'Logaritmo — Definição e Exemplos', channel: 'Dicasdemat Sandro Curió' },
    { id: '3gNGS4vzM_o', title: 'Leis dos Logaritmos com Exercícios', channel: 'Prof. Ferretto | ENEM e Vestibulares' },
];

// ── Sub-components ───────────────────────────────────────────────────────────
function VideoCard({ id, title, channel }: { id: string; title: string; channel: string }) {
    return (
        <a
            href={`https://www.youtube.com/watch?v=${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group/card flex flex-col rounded-xl overflow-hidden border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] bg-slate-900/40 hover:bg-slate-800/60"
        >
            <div className="relative w-full aspect-video bg-black overflow-hidden">
                <img
                    src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                    alt={title}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${id}/mqdefault.jpg`; }}
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    </div>
                </div>
                <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">YT</span>
            </div>
            <div className="p-3 flex flex-col gap-1">
                <p className="text-sm font-medium text-slate-200 line-clamp-2 group-hover/card:text-white leading-snug">{title}</p>
                <p className="text-xs text-slate-500">{channel}</p>
            </div>
        </a>
    );
}

interface LawCardProps { law: string; desc: string; example: string; color: string; }
function LawCard({ law, desc, example, color }: LawCardProps) {
    return (
        <div className={`rounded-xl p-5 border bg-slate-900/40 hover:bg-slate-800/60 transition-all duration-300`}
            style={{ borderColor: `${color}40` }}>
            <div className="font-mono text-lg font-bold mb-2" style={{ color }}>{law}</div>
            <p className="text-sm text-slate-400 mb-3 leading-relaxed">{desc}</p>
            <div className="text-xs font-mono bg-slate-800/80 rounded-lg px-3 py-2 text-slate-300 border border-slate-700/50">
                {example}
            </div>
        </div>
    );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function LogExplainer() {
    const [tab, setTab] = useState<Tab>('definicao');
    const [base, setBase] = useState(10);
    const [xVal, setXVal] = useState(5);

    const data = useMemo(() => buildLogData(base), [base]);
    const result = useMemo(() => logBase(base, xVal), [base, xVal]);

    const themeColor = '#10b981'; // emerald-500

    const TABS: { key: Tab; label: string }[] = [
        { key: 'definicao', label: 'Definição & Gráfico' },
        { key: 'propriedades', label: 'Propriedades' },
        { key: 'leis', label: 'Leis Operatórias' },
        { key: 'videos', label: 'Videoaulas' },
    ];

    return (
        <div className="flex-1 ml-64 h-screen overflow-y-auto bg-slate-950">
            <div className="p-6 max-w-6xl mx-auto space-y-6">

                {/* ── Header ── */}
                <div className="glass-panel rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl" style={{ background: `${themeColor}22`, border: `1px solid ${themeColor}40` }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" style={{ color: themeColor }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Logaritmos</h1>
                            <p className="text-slate-400 text-sm">A operação inversa da exponenciação</p>
                        </div>
                    </div>

                    {/* Definição central */}
                    <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
                        <p className="text-slate-300 text-sm leading-relaxed">
                            O <span className="text-emerald-400 font-semibold">logaritmo</span> de um número{' '}
                            <span className="font-mono text-amber-300">y</span> na base{' '}
                            <span className="font-mono text-amber-300">b</span> é o expoente{' '}
                            <span className="font-mono text-amber-300">x</span> ao qual a base deve ser elevada para produzir esse número:
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-4 justify-center">
                            <div className="font-mono text-2xl font-bold text-center">
                                <span className="text-slate-400">log</span>
                                <sub className="text-amber-400 text-base">b</sub>
                                <span className="text-slate-400">(y) = x</span>
                            </div>
                            <div className="text-slate-500">⟺</div>
                            <div className="font-mono text-2xl font-bold text-center">
                                <span className="text-amber-400">b</span>
                                <sup className="text-emerald-400 text-base">x</sup>
                                <span className="text-slate-400"> = y</span>
                            </div>
                        </div>
                        <p className="text-center text-slate-500 text-xs mt-2">com b {'>'} 0, b ≠ 1, y {'>'} 0</p>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="glass-panel rounded-2xl overflow-hidden">
                    <div className="flex border-b border-slate-700/50 overflow-x-auto">
                        {TABS.map(t => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`flex-1 min-w-max px-5 py-3.5 text-sm font-medium transition-all duration-300 whitespace-nowrap
                                    ${tab === t.key
                                        ? 'text-emerald-300 border-b-2 border-emerald-400 bg-emerald-500/10'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                                    }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {/* ─────── TAB: Definição & Gráfico ─────── */}
                        {tab === 'definicao' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Controls */}
                                <div className="lg:col-span-1 space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <label className="text-sm font-medium text-slate-300">Base (b)</label>
                                            <span className="text-xs font-mono px-2 py-1 rounded bg-slate-900 text-emerald-300 border border-slate-700">{base.toFixed(1)}</span>
                                        </div>
                                        <input type="range" min={0.2} max={10} step={0.1}
                                            value={base}
                                            onChange={e => {
                                                let v = parseFloat(e.target.value);
                                                if (v > 0.95 && v < 1.05) v = 1.1;
                                                setBase(parseFloat(v.toFixed(1)));
                                            }}
                                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                            style={{ background: `linear-gradient(to right, ${themeColor} 0%, ${themeColor} ${((base - 0.2) / (10 - 0.2)) * 100}%, #334155 ${((base - 0.2) / (10 - 0.2)) * 100}%, #334155 100%)` }}
                                        />
                                        <p className="text-[10px] text-slate-500">Precisa ser positiva e diferente de 1.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <label className="text-sm font-medium text-slate-300">Valor de x</label>
                                            <span className="text-xs font-mono px-2 py-1 rounded bg-slate-900 text-amber-300 border border-slate-700">{xVal.toFixed(2)}</span>
                                        </div>
                                        <input type="range" min={0.01} max={20} step={0.01}
                                            value={xVal}
                                            onChange={e => setXVal(parseFloat(e.target.value))}
                                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                            style={{ background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${((xVal - 0.01) / (20 - 0.01)) * 100}%, #334155 ${((xVal - 0.01) / (20 - 0.01)) * 100}%, #334155 100%)` }}
                                        />
                                        <p className="text-[10px] text-slate-500">Domínio do logaritmo: x {'>'} 0</p>
                                    </div>

                                    {/* Result box */}
                                    <div className="rounded-xl p-4 border border-emerald-500/30 bg-emerald-500/10">
                                        <p className="text-xs text-slate-400 mb-1">Resultado calculado:</p>
                                        <div className="font-mono text-xl font-bold text-emerald-300">
                                            log<sub className="text-amber-400 text-sm">{base.toFixed(1)}</sub>({xVal.toFixed(2)}) =
                                        </div>
                                        <div className="font-mono text-3xl font-bold text-white mt-1">
                                            {result !== null ? result.toFixed(4) : '—'}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-2">
                                            Ou seja: {base.toFixed(1)}<sup>{result !== null ? result.toFixed(4) : '?'}</sup> = {xVal.toFixed(2)}
                                        </div>
                                    </div>

                                    {/* Special values */}
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Valores Notáveis</p>
                                        {[
                                            { x: 1, label: `log₍b₎(1) = 0` },
                                            { x: base, label: `log₍b₎(b) = 1` },
                                            { x: base * base, label: `log₍b₎(b²) = 2` },
                                        ].map(({ x, label }) => (
                                            <button key={x}
                                                onClick={() => setXVal(parseFloat(x.toFixed(2)))}
                                                className="w-full text-left px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 hover:border-emerald-500/40 transition-all duration-200 text-xs font-mono text-slate-300"
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Chart */}
                                <div className="lg:col-span-2">
                                    <div className="h-80 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                <XAxis dataKey="x" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }}
                                                    label={{ value: 'x', position: 'insideBottomRight', offset: -5, fill: '#94a3b8', fontSize: 11 }} />
                                                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[-6, 6]}
                                                    label={{ value: 'log_b(x)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
                                                <Tooltip
                                                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                                                    labelStyle={{ color: '#94a3b8', fontSize: 11 }}
                                                    itemStyle={{ color: themeColor, fontSize: 11 }}
                                                    formatter={(v: number) => [v?.toFixed(4), `log₍${base.toFixed(1)}₎(x)`]}
                                                    labelFormatter={(l: number) => `x = ${l}`}
                                                />
                                                {/* y = 0 reference */}
                                                <ReferenceLine y={0} stroke="#475569" strokeDasharray="4 4" />
                                                {/* x = 1 reference (log=0) */}
                                                <ReferenceLine x={1} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.5} />
                                                {/* Main log curve */}
                                                <Line type="monotone" dataKey="y" stroke={themeColor}
                                                    strokeWidth={2.5} dot={false} connectNulls={false} />
                                                {/* Current x point */}
                                                {result !== null && result >= -6 && result <= 6 && (
                                                    <ReferenceDot x={xVal} y={result}
                                                        r={6} fill={themeColor} stroke="#fff" strokeWidth={2} />
                                                )}
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    {/* Behaviour note */}
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="rounded-lg p-3 bg-slate-800/50 border border-slate-700/40 text-xs text-slate-400">
                                            <span className="text-emerald-400 font-semibold">b {'>'} 1:</span> Função crescente. Quanto maior a base, mais "achatada" a curva.
                                        </div>
                                        <div className="rounded-lg p-3 bg-slate-800/50 border border-slate-700/40 text-xs text-slate-400">
                                            <span className="text-amber-400 font-semibold">0 {'<'} b {'<'} 1:</span> Função decrescente. A curva "vira de cabeça pra baixo".
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─────── TAB: Propriedades ─────── */}
                        {tab === 'propriedades' && (
                            <div className="space-y-6">
                                {/* Domain / Conditions */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { label: 'Domínio', value: 'x ∈ (0, +∞)', color: '#10b981', desc: 'O logaritmo só existe para x estritamente positivo.' },
                                        { label: 'Imagem', value: 'y ∈ ℝ', color: '#8b5cf6', desc: 'O resultado pode ser qualquer número real.' },
                                        { label: 'Restrição da base', value: 'b > 0, b ≠ 1', color: '#f59e0b', desc: 'Base positiva e diferente de um.' },
                                    ].map(({ label, value, color, desc }) => (
                                        <div key={label} className="rounded-xl p-4 border bg-slate-900/50 text-center" style={{ borderColor: `${color}40` }}>
                                            <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">{label}</p>
                                            <p className="font-mono text-xl font-bold" style={{ color }}>{value}</p>
                                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{desc}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Key properties */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        {
                                            title: 'Ponto fixo em x = 1',
                                            desc: 'Qualquer logaritmo de 1 é zero, independente da base.',
                                            formula: 'log_b(1) = 0',
                                            color: '#10b981',
                                            proof: 'Pois b⁰ = 1, para qualquer b válido.'
                                        },
                                        {
                                            title: 'log na própria base',
                                            desc: 'O logaritmo de b na base b é sempre 1.',
                                            formula: 'log_b(b) = 1',
                                            color: '#8b5cf6',
                                            proof: 'Pois b¹ = b, por definição.'
                                        },
                                        {
                                            title: 'Logaritmo de produto',
                                            desc: 'Log de produto vira soma dos logaritmos.',
                                            formula: 'log_b(M·N) = log_b(M) + log_b(N)',
                                            color: '#f59e0b',
                                            proof: 'Ex: log₁₀(100) = log₁₀(10) + log₁₀(10) = 2'
                                        },
                                        {
                                            title: 'Logaritmo de quociente',
                                            desc: 'Log de divisão vira subtração dos logaritmos.',
                                            formula: 'log_b(M/N) = log_b(M) − log_b(N)',
                                            color: '#f43f5e',
                                            proof: 'Ex: log₂(8/4) = log₂(8) − log₂(4) = 3 − 2 = 1'
                                        },
                                        {
                                            title: 'Logaritmo de potência',
                                            desc: 'O expoente desce e multiplica o logaritmo.',
                                            formula: 'log_b(Mⁿ) = n · log_b(M)',
                                            color: '#06b6d4',
                                            proof: 'Ex: log₂(8) = log₂(2³) = 3 · log₂(2) = 3'
                                        },
                                        {
                                            title: 'Mudança de base',
                                            desc: 'Converte logaritmo de qualquer base para outra.',
                                            formula: 'log_b(x) = log_c(x) / log_c(b)',
                                            color: '#ec4899',
                                            proof: 'Ex: log₃(9) = log₁₀(9) / log₁₀(3) ≈ 2'
                                        },
                                    ].map(({ title, desc, formula, color, proof }) => (
                                        <div key={title} className="rounded-xl p-4 border bg-slate-900/40 hover:bg-slate-800/60 transition-all duration-200"
                                            style={{ borderColor: `${color}30` }}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                                                <p className="text-sm font-semibold text-slate-200">{title}</p>
                                            </div>
                                            <p className="text-xs text-slate-400 mb-2 leading-relaxed">{desc}</p>
                                            <div className="font-mono text-sm rounded-lg px-3 py-2 bg-slate-800/80 border border-slate-700/50 mb-2"
                                                style={{ color }}>
                                                {formula}
                                            </div>
                                            <p className="text-[10px] text-slate-500 italic">{proof}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Bases especiais */}
                                <div className="rounded-xl p-5 border border-slate-700/50 bg-slate-900/40">
                                    <p className="text-sm font-semibold text-slate-300 mb-3">📌 Bases Especiais</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="rounded-lg p-4 bg-slate-800/50 border border-amber-500/20">
                                            <p className="font-mono text-lg text-amber-300 font-bold">log(x) = log₁₀(x)</p>
                                            <p className="text-xs text-slate-400 mt-1">Logaritmo decimal (base 10). Muito usado em engenharia, decibéis, pH.</p>
                                        </div>
                                        <div className="rounded-lg p-4 bg-slate-800/50 border border-emerald-500/20">
                                            <p className="font-mono text-lg text-emerald-300 font-bold">ln(x) = logₑ(x)</p>
                                            <p className="text-xs text-slate-400 mt-1">Logaritmo natural (base e ≈ 2.718). Fundamental em cálculo e crescimento exponencial.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─────── TAB: Leis Operatórias ─────── */}
                        {tab === 'leis' && (
                            <div className="space-y-6">
                                {/* Comparativo visual */}
                                <div className="rounded-xl p-5 border border-emerald-500/20 bg-emerald-500/5">
                                    <p className="text-sm font-semibold text-emerald-300 mb-3">🔄 Logaritmo é a operação inversa da exponenciação</p>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="border-b border-slate-700/50">
                                                    <th className="text-left py-2 px-3 text-slate-400">Exponenciação</th>
                                                    <th className="text-center py-2 px-3 text-slate-500">↔</th>
                                                    <th className="text-left py-2 px-3 text-emerald-400">Logaritmo</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-700/30">
                                                {[
                                                    ['2³ = 8', 'log₂(8) = 3'],
                                                    ['10² = 100', 'log₁₀(100) = 2'],
                                                    ['e¹ = e', 'ln(e) = 1'],
                                                    ['5⁰ = 1', 'log₅(1) = 0'],
                                                    ['3⁻¹ = 1/3', 'log₃(1/3) = −1'],
                                                ].map(([exp, log]) => (
                                                    <tr key={exp}>
                                                        <td className="py-2 px-3 font-mono text-amber-300">{exp}</td>
                                                        <td className="py-2 px-3 text-center text-slate-600">⟺</td>
                                                        <td className="py-2 px-3 font-mono text-emerald-300">{log}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Leis */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <LawCard
                                        law="log_b(M·N) = log_b(M) + log_b(N)"
                                        desc="Produto vira soma. Permite simplificar log de multiplicações grandes."
                                        example="log₂(32) = log₂(8 × 4) = log₂(8) + log₂(4) = 3 + 2 = 5"
                                        color="#10b981"
                                    />
                                    <LawCard
                                        law="log_b(M/N) = log_b(M) − log_b(N)"
                                        desc="Quociente vira subtração. Útil para simplificar divisões."
                                        example="log₁₀(1000/10) = log₁₀(1000) − log₁₀(10) = 3 − 1 = 2"
                                        color="#8b5cf6"
                                    />
                                    <LawCard
                                        law="log_b(Mⁿ) = n · log_b(M)"
                                        desc="Expoente desce como fator multiplicativo."
                                        example="log₂(64) = log₂(2⁶) = 6 · log₂(2) = 6 · 1 = 6"
                                        color="#f59e0b"
                                    />
                                    <LawCard
                                        law="log_b(ⁿ√M) = log_b(M) / n"
                                        desc="Raiz vira divisão do logaritmo."
                                        example="log₁₀(√100) = log₁₀(100) / 2 = 2/2 = 1"
                                        color="#f43f5e"
                                    />
                                    <LawCard
                                        law="log_b(x) = log_c(x) / log_c(b)"
                                        desc="Mudança de base: útil para calcular logs em qualquer base."
                                        example="log₃(81) = log₁₀(81) / log₁₀(3) ≈ 1.908 / 0.477 ≈ 4"
                                        color="#06b6d4"
                                    />
                                    <LawCard
                                        law="b^(log_b(x)) = x"
                                        desc="Identidade fundamental: exponenciação e log se cancelam."
                                        example="2^(log₂(8)) = 8  ✓    10^(log₁₀(500)) = 500  ✓"
                                        color="#ec4899"
                                    />
                                </div>

                                {/* Resumo memorização */}
                                <div className="rounded-xl p-5 border border-slate-700/50 bg-slate-900/40">
                                    <p className="text-sm font-semibold text-slate-300 mb-3">💡 Dica de Memorização</p>
                                    <div className="text-sm text-slate-400 space-y-2 leading-relaxed">
                                        <p>As leis do logaritmo são <strong className="text-slate-200">análogas às leis dos expoentes</strong>, mas "invertidas":</p>
                                        <ul className="list-disc pl-5 space-y-1 text-xs">
                                            <li>Multiplicar dentro do log → <span className="text-emerald-400">Somar</span> os logs separados</li>
                                            <li>Dividir dentro do log → <span className="text-purple-400">Subtrair</span> os logs</li>
                                            <li>Elevar a uma potência → <span className="text-amber-400">Multiplicar</span> o log pelo expoente</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─────── TAB: Videoaulas ─────── */}
                        {tab === 'videos' && (
                            <div className="space-y-4">
                                <p className="text-sm text-slate-400">
                                    Videoaulas selecionadas para aprofundar o tema de logaritmos:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {VIDEOS.map(v => <VideoCard key={v.id} {...v} />)}
                                </div>
                                <p className="text-xs text-slate-600 text-center mt-2">
                                    Clique em um vídeo para abrir no YouTube ↗
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
