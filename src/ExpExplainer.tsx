import React, { useState, useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    ResponsiveContainer, ReferenceLine, ReferenceDot, Tooltip
} from 'recharts';

// ── Types ───────────────────────────────────────────────────────────────────
type Tab = 'definicao' | 'propriedades' | 'aplicacoes' | 'videos';

// ── Helpers ─────────────────────────────────────────────────────────────────
function expVal(base: number, x: number): number {
    return Math.pow(base, x);
}

// ── Chart data ───────────────────────────────────────────────────────────────
function buildExpData(base: number) {
    const pts: { x: number; y: number }[] = [];
    for (let x = -5; x <= 5; x += 0.1) {
        const y = expVal(base, x);
        if (y < 20) pts.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(4)) });
    }
    return pts;
}

// ── Video cards (verified IDs – Exponential functions) ───────────────────────
const VIDEOS = [
    { id: 'gMGz-dB9few', title: 'FUNÇÃO EXPONENCIAL | FÁCIL e RÁPIDO', channel: 'Dicasdemat Sandro Curió' },
    { id: 'AJG6_CCISE8', title: 'Função Exponencial — Crescimento e Decrescimento', channel: 'Professor Boaro' },
    { id: 'gMGz-dB9few', title: 'Gráfico da Função Exponencial', channel: 'Dicasdemat Sandro Curió' },
    { id: 'AJG6_CCISE8', title: 'Função Exponencial — Parte 1 | Matemática do Zero', channel: 'Professor Boaro' },
];

// ── Sub-components ───────────────────────────────────────────────────────────
function VideoCard({ id, title, channel }: { id: string; title: string; channel: string }) {
    return (
        <a
            href={`https://www.youtube.com/watch?v=${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group/card flex flex-col rounded-xl overflow-hidden border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] bg-slate-900/40 hover:bg-slate-800/60"
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

// ── Main Component ───────────────────────────────────────────────────────────
export default function ExpExplainer() {
    const [tab, setTab] = useState<Tab>('definicao');
    const [base, setBase] = useState(2);
    const [xVal, setXVal] = useState(2);

    const themeColor = '#f97316'; // orange-500

    const data = useMemo(() => buildExpData(base), [base]);
    const result = useMemo(() => expVal(base, xVal), [base, xVal]);

    const TABS: { key: Tab; label: string }[] = [
        { key: 'definicao', label: 'Definição & Gráfico' },
        { key: 'propriedades', label: 'Propriedades' },
        { key: 'aplicacoes', label: 'Aplicações' },
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
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Função Exponencial</h1>
                            <p className="text-slate-400 text-sm">Crescimento e decrescimento em potências de uma base</p>
                        </div>
                    </div>

                    {/* Definição central */}
                    <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
                        <p className="text-slate-300 text-sm leading-relaxed">
                            A <span className="text-orange-400 font-semibold">função exponencial</span> associa a cada valor de{' '}
                            <span className="font-mono text-amber-300">x</span> uma potência de uma base fixa{' '}
                            <span className="font-mono text-amber-300">b</span>:
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-4 justify-center">
                            <div className="font-mono text-2xl font-bold text-center">
                                <span className="text-slate-400">f(x) = </span>
                                <span className="text-amber-400">b</span>
                                <sup className="text-orange-400 text-base">x</sup>
                            </div>
                        </div>
                        <p className="text-center text-slate-500 text-xs mt-2">com b {'>'} 0, b ≠ 1, x ∈ ℝ</p>
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
                                        ? 'text-orange-300 border-b-2 border-orange-400 bg-orange-500/10'
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
                                            <span className="text-xs font-mono px-2 py-1 rounded bg-slate-900 text-orange-300 border border-slate-700">{base.toFixed(1)}</span>
                                        </div>
                                        <input type="range" min={0.1} max={5} step={0.1}
                                            value={base}
                                            onChange={e => {
                                                let v = parseFloat(e.target.value);
                                                if (v > 0.95 && v < 1.05) v = 1.1;
                                                setBase(parseFloat(v.toFixed(1)));
                                            }}
                                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                            style={{ background: `linear-gradient(to right, ${themeColor} 0%, ${themeColor} ${((base - 0.1) / (5 - 0.1)) * 100}%, #334155 ${((base - 0.1) / (5 - 0.1)) * 100}%, #334155 100%)` }}
                                        />
                                        <p className="text-[10px] text-slate-500">Precisa ser positiva e diferente de 1.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <label className="text-sm font-medium text-slate-300">Expoente (x)</label>
                                            <span className="text-xs font-mono px-2 py-1 rounded bg-slate-900 text-amber-300 border border-slate-700">{xVal.toFixed(1)}</span>
                                        </div>
                                        <input type="range" min={-5} max={5} step={0.1}
                                            value={xVal}
                                            onChange={e => setXVal(parseFloat(e.target.value))}
                                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                            style={{ background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${((xVal - (-5)) / (5 - (-5))) * 100}%, #334155 ${((xVal - (-5)) / (5 - (-5))) * 100}%, #334155 100%)` }}
                                        />
                                        <p className="text-[10px] text-slate-500">Domínio: todos os reais (−∞, +∞)</p>
                                    </div>

                                    {/* Result box */}
                                    <div className="rounded-xl p-4 border border-orange-500/30 bg-orange-500/10">
                                        <p className="text-xs text-slate-400 mb-1">Resultado calculado:</p>
                                        <div className="font-mono text-xl font-bold text-orange-300">
                                            f({xVal.toFixed(1)}) = {base.toFixed(1)}<sup>{xVal.toFixed(1)}</sup> =
                                        </div>
                                        <div className="font-mono text-3xl font-bold text-white mt-1">
                                            {result.toFixed(4)}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-2">
                                            {base.toFixed(1)} elevado a {xVal.toFixed(1)} = {result.toFixed(4)}
                                        </div>
                                    </div>

                                    {/* Behaviour */}
                                    <div className="rounded-xl p-4 border border-slate-700/50 bg-slate-800/40">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Comportamento</p>
                                        <div className="space-y-1.5 text-xs text-slate-400">
                                            <p><span className="text-orange-400 font-semibold">b {'>'} 1:</span> Crescente. Quanto maior x, maior f(x).</p>
                                            <p><span className="text-amber-400 font-semibold">0 {'<'} b {'<'} 1:</span> Decrescente. Quanto maior x, menor f(x).</p>
                                            <p><span className="text-slate-300 font-semibold">b⁰ = 1</span> sempre, independente da base.</p>
                                        </div>
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
                                                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[0, 'auto']}
                                                    label={{ value: 'b^x', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
                                                <Tooltip
                                                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                                                    labelStyle={{ color: '#94a3b8', fontSize: 11 }}
                                                    itemStyle={{ color: themeColor, fontSize: 11 }}
                                                    formatter={(v: number) => [v?.toFixed(4), `${base.toFixed(1)}^x`]}
                                                    labelFormatter={(l: number) => `x = ${l}`}
                                                />
                                                <ReferenceLine y={1} stroke="#475569" strokeDasharray="4 4" label={{ value: 'y=1', fill: '#94a3b8', fontSize: 9 }} />
                                                <ReferenceLine x={0} stroke="#475569" strokeDasharray="4 4" />
                                                <Line type="monotone" dataKey="y" stroke={themeColor}
                                                    strokeWidth={2.5} dot={false} connectNulls={false} />
                                                {result < 20 && (
                                                    <ReferenceDot x={xVal} y={result}
                                                        r={6} fill={themeColor} stroke="#fff" strokeWidth={2} />
                                                )}
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="rounded-lg p-3 bg-slate-800/50 border border-slate-700/40 text-xs text-slate-400">
                                            <span className="text-orange-400 font-semibold">Assíntota horizontal:</span> y = 0 (o eixo x). A curva se aproxima mas nunca toca.
                                        </div>
                                        <div className="rounded-lg p-3 bg-slate-800/50 border border-slate-700/40 text-xs text-slate-400">
                                            <span className="text-amber-400 font-semibold">Ponto notável:</span> Toda exponencial passa por (0, 1), pois b⁰ = 1.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─────── TAB: Propriedades ─────── */}
                        {tab === 'propriedades' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { label: 'Domínio', value: 'ℝ (−∞, +∞)', color: '#f97316', desc: 'x pode ser qualquer número real.' },
                                        { label: 'Imagem', value: '(0, +∞)', color: '#8b5cf6', desc: 'f(x) sempre positivo, nunca zero.' },
                                        { label: 'Restrição da base', value: 'b > 0, b ≠ 1', color: '#f59e0b', desc: 'Base positiva e diferente de um.' },
                                    ].map(({ label, value, color, desc }) => (
                                        <div key={label} className="rounded-xl p-4 border bg-slate-900/50 text-center" style={{ borderColor: `${color}40` }}>
                                            <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">{label}</p>
                                            <p className="font-mono text-xl font-bold" style={{ color }}>{value}</p>
                                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { title: 'Produto de potências', formula: 'b^m · b^n = b^(m+n)', desc: 'Multiplicar = somar expoentes.', example: '2³ · 2² = 2⁵ = 32', color: '#f97316' },
                                        { title: 'Quociente de potências', formula: 'b^m / b^n = b^(m−n)', desc: 'Dividir = subtrair expoentes.', example: '2⁵ / 2² = 2³ = 8', color: '#8b5cf6' },
                                        { title: 'Potência de potência', formula: '(b^m)^n = b^(m·n)', desc: 'Elevar ao cubo = multiplicar expoentes.', example: '(2²)³ = 2⁶ = 64', color: '#f59e0b' },
                                        { title: 'Expoente zero', formula: 'b⁰ = 1', desc: 'Qualquer base elevada a zero é 1.', example: '5⁰ = 1    100⁰ = 1', color: '#10b981' },
                                        { title: 'Expoente negativo', formula: 'b^(−n) = 1/bⁿ', desc: 'Expoente negativo inverte a fração.', example: '2⁻³ = 1/8 = 0.125', color: '#06b6d4' },
                                        { title: 'Expoente fracionário', formula: 'b^(1/n) = ⁿ√b', desc: 'Raiz n-ésima equivale a 1/n.', example: '8^(1/3) = ³√8 = 2', color: '#ec4899' },
                                    ].map(({ title, desc, formula, color, example }) => (
                                        <div key={title} className="rounded-xl p-4 border bg-slate-900/40 hover:bg-slate-800/60 transition-all duration-200"
                                            style={{ borderColor: `${color}30` }}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                                                <p className="text-sm font-semibold text-slate-200">{title}</p>
                                            </div>
                                            <p className="text-xs text-slate-400 mb-2 leading-relaxed">{desc}</p>
                                            <div className="font-mono text-sm rounded-lg px-3 py-2 bg-slate-800/80 border border-slate-700/50 mb-2"
                                                style={{ color }}>{formula}</div>
                                            <p className="text-[10px] text-slate-500 italic">{example}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Crescimento vs Decrescimento */}
                                <div className="rounded-xl p-5 border border-slate-700/50 bg-slate-900/40">
                                    <p className="text-sm font-semibold text-slate-300 mb-3">📊 Crescimento vs. Decrescimento</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="rounded-lg p-4 bg-slate-800/50 border border-orange-500/20">
                                            <p className="font-semibold text-orange-300 text-sm mb-1">b {'>'} 1 → Crescente</p>
                                            <p className="text-xs text-slate-400">Cresce sem limite quando x → +∞. Aproxima-se de 0 quando x → −∞.</p>
                                            <p className="text-xs text-slate-500 mt-1 font-mono">Ex: 2^x, 3^x, 10^x</p>
                                        </div>
                                        <div className="rounded-lg p-4 bg-slate-800/50 border border-amber-500/20">
                                            <p className="font-semibold text-amber-300 text-sm mb-1">0 {'<'} b {'<'} 1 → Decrescente</p>
                                            <p className="text-xs text-slate-400">Parte de +∞ quando x → −∞ e se aproxima de 0 quando x → +∞.</p>
                                            <p className="text-xs text-slate-500 mt-1 font-mono">Ex: (1/2)^x, (0.5)^x</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─────── TAB: Aplicações ─────── */}
                        {tab === 'aplicacoes' && (
                            <div className="space-y-4">
                                <p className="text-sm text-slate-400">A função exponencial aparece em muitos fenômenos do mundo real:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        {
                                            icon: '🦠', title: 'Crescimento Populacional / Vírus',
                                            formula: 'N(t) = N₀ · e^(rt)',
                                            desc: 'Populações e epidemias crescem exponencialmente no início. r é a taxa de crescimento, t o tempo.',
                                            example: 'Se r = 0.3 e t = 5: N = N₀ · e^1.5 ≈ 4.5 × N₀',
                                            color: '#f97316'
                                        },
                                        {
                                            icon: '☢️', title: 'Decaimento Radioativo',
                                            formula: 'A(t) = A₀ · (1/2)^(t/T½)',
                                            desc: 'A quantidade de material radioativo cai pela metade a cada período T½ (meia-vida).',
                                            example: 'C-14 tem T½ ≈ 5730 anos → usado em datação',
                                            color: '#10b981'
                                        },
                                        {
                                            icon: '💰', title: 'Juros Compostos',
                                            formula: 'M = C · (1 + i)^t',
                                            desc: 'Capital cresce exponencialmente com juros compostos ao longo do tempo.',
                                            example: 'R$1000 a 10% a.a. por 5 anos: M = 1000 · 1.1⁵ ≈ R$1.611',
                                            color: '#8b5cf6'
                                        },
                                        {
                                            icon: '🔊', title: 'Escala de Decibéis',
                                            formula: 'dB = 10 · log₁₀(I/I₀)',
                                            desc: 'O volume sonoro usa escala logarítmica, que é a inversa da exponencial.',
                                            example: 'Dobrar a intensidade sonora = +3 dB',
                                            color: '#f59e0b'
                                        },
                                        {
                                            icon: '🌡️', title: 'Resfriamento de Newton',
                                            formula: 'T(t) = T_amb + (T₀ − T_amb)·e^(−kt)',
                                            desc: 'A temperatura de um corpo se aproxima exponencialmente da temperatura ambiente.',
                                            example: 'Um café a 90°C esfria para ambiente (~25°C)',
                                            color: '#06b6d4'
                                        },
                                        {
                                            icon: '💻', title: 'Lei de Moore',
                                            formula: 'Transistores ≈ 2^(t/2)',
                                            desc: 'O número de transistores em chips dobra aproximadamente a cada 2 anos.',
                                            example: 'Crescimento exponencial de capacidade computacional',
                                            color: '#ec4899'
                                        },
                                    ].map(({ icon, title, formula, desc, example, color }) => (
                                        <div key={title} className="rounded-xl p-4 border bg-slate-900/40 hover:bg-slate-800/60 transition-all duration-200"
                                            style={{ borderColor: `${color}30` }}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xl">{icon}</span>
                                                <p className="text-sm font-semibold text-slate-200">{title}</p>
                                            </div>
                                            <div className="font-mono text-sm rounded-lg px-3 py-1.5 bg-slate-800/80 border border-slate-700/50 mb-2"
                                                style={{ color }}>{formula}</div>
                                            <p className="text-xs text-slate-400 leading-relaxed mb-2">{desc}</p>
                                            <p className="text-[10px] text-slate-500 italic">{example}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ─────── TAB: Videoaulas ─────── */}
                        {tab === 'videos' && (
                            <div className="space-y-4">
                                <p className="text-sm text-slate-400">Videoaulas selecionadas sobre funções exponenciais:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {VIDEOS.map(v => <VideoCard key={v.id + v.title} {...v} />)}
                                </div>
                                <p className="text-xs text-slate-600 text-center mt-2">Clique em um vídeo para abrir no YouTube ↗</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
