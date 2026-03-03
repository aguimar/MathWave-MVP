import React, { useState, useMemo } from 'react';
import { Activity, BookOpen, Scaling, Clock, Hash, ArrowLeftRight, Link2, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// ─── Generic Property Card ───────────────────────────────────────────────────
interface FnValue {
    name: string;
    color: string;
    content: React.ReactNode;
}

interface PropertyCardProps {
    title: string;
    icon: React.ReactNode;
    values: FnValue[];
}

function PropertyCard({ title, icon, values }: PropertyCardProps) {
    return (
        <div className="glass-panel rounded-2xl p-6 flex flex-col hover:border-cyan-500/30 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                    {icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
            </div>
            <div className="flex flex-col gap-3 mt-1">
                {values.map((v, i) => (
                    <div
                        key={v.name}
                        className={`flex justify-between items-center pb-2.5 ${i < values.length - 1 ? 'border-b border-slate-700/50' : ''}`}
                    >
                        <span className="text-sm font-medium" style={{ color: v.color }}>{v.name}</span>
                        <span className="text-sm text-slate-300 font-mono text-right">{v.content}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Tab definitions ─────────────────────────────────────────────────────────
type Tab = 'primary' | 'reciprocal';

// ─── Main Component ──────────────────────────────────────────────────────────
export default function TrigProperties() {
    const [activeTab, setActiveTab] = useState<Tab>('primary');

    // Chart data: sen²+cos²=1
    const primaryIdentityData = useMemo(() => {
        const data = [];
        for (let x = -2 * Math.PI; x <= 2 * Math.PI; x += 0.1) {
            const s = Math.sin(x), c = Math.cos(x);
            data.push({ x, sin2: s * s, cos2: c * c, sum: s * s + c * c });
        }
        return data;
    }, []);

    // Chart data: sec²−tan²=1
    const reciprocalIdentityData = useMemo(() => {
        const data = [];
        for (let x = -2 * Math.PI; x <= 2 * Math.PI; x += 0.05) {
            const cosVal = Math.cos(x);
            if (Math.abs(cosVal) > 0.1) {
                const sec = 1 / cosVal, tan = Math.tan(x);
                data.push({ x, sec2: sec * sec, tan2: tan * tan, diff: sec * sec - tan * tan });
            } else {
                data.push({ x, sec2: null, tan2: null, diff: null });
            }
        }
        return data;
    }, []);

    const piTickFormatter = (val: number) => {
        if (Math.abs(val) < 0.1) return '0';
        return `${(val / Math.PI).toFixed(1)}π`;
    };

    // ── Primary tab cards ───────────────────────────────────────────────────
    const primaryCards: { title: string; icon: React.ReactNode; values: FnValue[] }[] = [
        {
            title: 'Domínio',
            icon: <ArrowLeftRight className="w-5 h-5 text-slate-400" />,
            values: [
                { name: 'Seno', color: '#22d3ee', content: 'ℝ (Todos os Reais)' },
                { name: 'Cosseno', color: '#8b5cf6', content: 'ℝ (Todos os Reais)' },
                { name: 'Tangente', color: '#f43f5e', content: <>x ≠ π/2 + kπ</> },
            ],
        },
        {
            title: 'Imagem',
            icon: <Scaling className="w-5 h-5 text-slate-400" />,
            values: [
                { name: 'Seno', color: '#22d3ee', content: '[-1, 1]' },
                { name: 'Cosseno', color: '#8b5cf6', content: '[-1, 1]' },
                { name: 'Tangente', color: '#f43f5e', content: 'ℝ (Todos os Reais)' },
            ],
        },
        {
            title: 'Período',
            icon: <Clock className="w-5 h-5 text-slate-400" />,
            values: [
                { name: 'Seno', color: '#22d3ee', content: '2π (~6.28)' },
                { name: 'Cosseno', color: '#8b5cf6', content: '2π (~6.28)' },
                { name: 'Tangente', color: '#f43f5e', content: 'π (~3.14)' },
            ],
        },
        {
            title: 'Paridade',
            icon: <Activity className="w-5 h-5 text-slate-400" />,
            values: [
                { name: 'Seno', color: '#22d3ee', content: 'Ímpar: f(-x) = -f(x)' },
                { name: 'Cosseno', color: '#8b5cf6', content: 'Par: f(-x) = f(x)' },
                { name: 'Tangente', color: '#f43f5e', content: 'Ímpar: f(-x) = -f(x)' },
            ],
        },
        {
            title: 'Raízes Principais',
            icon: <Hash className="w-5 h-5 text-slate-400" />,
            values: [
                { name: 'Seno', color: '#22d3ee', content: '0, π, 2π…' },
                { name: 'Cosseno', color: '#8b5cf6', content: 'π/2, 3π/2…' },
                { name: 'Tangente', color: '#f43f5e', content: '0, π, 2π…' },
            ],
        },
        {
            title: 'Assíntotas',
            icon: <Scaling className="w-5 h-5 text-slate-400 rotate-90" />,
            values: [
                { name: 'Seno', color: '#22d3ee', content: 'Nenhuma' },
                { name: 'Cosseno', color: '#8b5cf6', content: 'Nenhuma' },
                { name: 'Tangente', color: '#f43f5e', content: <>Sim, em x = π/2 + kπ</> },
            ],
        },
    ];

    // ── Reciprocal tab cards ────────────────────────────────────────────────
    const reciprocalCards: { title: string; icon: React.ReactNode; values: FnValue[] }[] = [
        {
            title: 'Domínio',
            icon: <ArrowLeftRight className="w-5 h-5 text-slate-400" />,
            values: [
                { name: 'Secante', color: '#22d3ee', content: <>x ≠ π/2 + kπ</> },
                { name: 'Cossecante', color: '#8b5cf6', content: <>x ≠ kπ</> },
                { name: 'Cotangente', color: '#10b981', content: <>x ≠ kπ</> },
            ],
        },
        {
            title: 'Imagem',
            icon: <Scaling className="w-5 h-5 text-slate-400" />,
            values: [
                { name: 'Secante', color: '#22d3ee', content: '(-∞, -1] ∪ [1, ∞)' },
                { name: 'Cossecante', color: '#8b5cf6', content: '(-∞, -1] ∪ [1, ∞)' },
                { name: 'Cotangente', color: '#10b981', content: 'ℝ (Todos os Reais)' },
            ],
        },
        {
            title: 'Período',
            icon: <Clock className="w-5 h-5 text-slate-400" />,
            values: [
                { name: 'Secante', color: '#22d3ee', content: '2π (~6.28)' },
                { name: 'Cossecante', color: '#8b5cf6', content: '2π (~6.28)' },
                { name: 'Cotangente', color: '#10b981', content: 'π (~3.14)' },
            ],
        },
        {
            title: 'Paridade',
            icon: <Activity className="w-5 h-5 text-slate-400" />,
            values: [
                { name: 'Secante', color: '#22d3ee', content: 'Par: f(-x) = f(x)' },
                { name: 'Cossecante', color: '#8b5cf6', content: 'Ímpar: f(-x) = -f(x)' },
                { name: 'Cotangente', color: '#10b981', content: 'Ímpar: f(-x) = -f(x)' },
            ],
        },
        {
            title: 'Assíntotas',
            icon: <Scaling className="w-5 h-5 text-slate-400 rotate-90" />,
            values: [
                { name: 'Secante', color: '#22d3ee', content: <>x = π/2 + kπ</> },
                { name: 'Cossecante', color: '#8b5cf6', content: <>x = kπ</> },
                { name: 'Cotangente', color: '#10b981', content: <>x = kπ</> },
            ],
        },
        {
            title: 'Raízes Principais',
            icon: <Hash className="w-5 h-5 text-slate-400" />,
            values: [
                { name: 'Secante', color: '#22d3ee', content: 'Nenhuma' },
                { name: 'Cossecante', color: '#8b5cf6', content: 'Nenhuma' },
                { name: 'Cotangente', color: '#10b981', content: 'π/2, 3π/2…' },
            ],
        },
    ];

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <BookOpen className="w-32 h-32" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">
                    Propriedades das Funções Trigonométricas
                </h2>
                <p className="text-slate-400 max-w-3xl relative z-10">
                    Explore as propriedades matemáticas das 6 funções trigonométricas — as{' '}
                    <span className="text-cyan-400 font-medium">primárias</span> (sen, cos, tan) e suas{' '}
                    <span className="text-emerald-400 font-medium">recíprocas</span> (sec, csc, cot).
                </p>

                {/* ── Tab Switcher ─────────────────────────────────────── */}
                <div className="flex gap-2 mt-5 w-fit p-1 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <button
                        onClick={() => setActiveTab('primary')}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'primary'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <Activity className="w-4 h-4" />
                        Funções Primárias
                        <span className="text-xs opacity-60 font-mono">sen · cos · tan</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('reciprocal')}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'reciprocal'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <RefreshCw className="w-4 h-4" />
                        Funções Recíprocas
                        <span className="text-xs opacity-60 font-mono">sec · csc · cot</span>
                    </button>
                </div>
            </div>

            {/* ── Primary Tab ─────────────────────────────────────────────── */}
            {activeTab === 'primary' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {primaryCards.map(card => (
                            <PropertyCard key={card.title} {...card} />
                        ))}
                    </div>

                    {/* Identity: sen²+cos²=1 */}
                    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-amber-500/20">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Link2 className="w-32 h-32" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-amber-400" />
                            Relação Fundamental da Trigonometria
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                            <div className="lg:col-span-1 flex flex-col justify-center gap-4">
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                    <p className="font-mono text-lg text-center tracking-wider text-amber-400">
                                        sen²(x) + cos²(x) = 1
                                    </p>
                                </div>
                                <p className="text-slate-400 leading-relaxed">
                                    Consequência direta do <strong>Teorema de Pitágoras</strong> aplicado ao círculo unitário.
                                    O raio é sempre 1 e as coordenadas de qualquer ponto na borda são{' '}
                                    <code className="text-slate-300 bg-slate-800 px-1 rounded">(cos(x), sen(x))</code>.
                                </p>
                                <p className="text-slate-400 leading-relaxed">
                                    No gráfico abaixo você vê que sen²+cos² é sempre a linha horizontal = 1,
                                    enquanto cada parcela oscila de forma complementar.
                                </p>
                            </div>
                            <div className="lg:col-span-2 h-[300px] bg-slate-900/30 rounded-xl p-4 border border-slate-700/30">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={primaryIdentityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                        <XAxis dataKey="x" type="number"
                                            domain={[-2 * Math.PI, 2 * Math.PI]}
                                            tickFormatter={piTickFormatter}
                                            ticks={[-2 * Math.PI, -Math.PI, 0, Math.PI, 2 * Math.PI]}
                                            stroke="#64748b" />
                                        <YAxis domain={[0, 1.2]} stroke="#64748b" ticks={[0, 0.5, 1]} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                                            labelFormatter={(l) => `x: ${(Number(l) / Math.PI).toFixed(2)}π`}
                                            formatter={(v: number) => v.toFixed(3)} />
                                        <Legend />
                                        <Line name="sen²(x)" type="monotone" dataKey="sin2" stroke="#22d3ee" strokeWidth={3} dot={false} />
                                        <Line name="cos²(x)" type="monotone" dataKey="cos2" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                                        <Line name="Soma (= 1)" type="monotone" dataKey="sum" stroke="#fbbf24" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ── Reciprocal Tab ──────────────────────────────────────────── */}
            {activeTab === 'reciprocal' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reciprocalCards.map(card => (
                            <PropertyCard key={card.title} {...card} />
                        ))}
                    </div>

                    {/* Identity: sec²−tan²=1 */}
                    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-emerald-500/20">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Link2 className="w-32 h-32" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-emerald-400" />
                            Relação Pitagórica da Secante
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                            <div className="lg:col-span-1 flex flex-col justify-center gap-4">
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                    <p className="font-mono text-lg text-center tracking-wider text-emerald-400">
                                        sec²(x) − tan²(x) = 1
                                    </p>
                                </div>
                                <p className="text-slate-400 leading-relaxed">
                                    Obtida ao dividirmos a relação fundamental sen²+cos²=1 por{' '}
                                    <strong>cos²(x)</strong>. Apesar dos gráficos de{' '}
                                    <code className="text-slate-300 bg-slate-800 px-1 rounded">sec²</code> e{' '}
                                    <code className="text-slate-300 bg-slate-800 px-1 rounded">tan²</code> possuírem
                                    assíntotas, a diferença entre eles sempre resulta em 1.
                                </p>
                                <p className="text-slate-400 leading-relaxed">
                                    A linha tracejada verde no gráfico confirma isso visualmente — ela é constante = 1
                                    onde as funções estão definidas.
                                </p>
                            </div>
                            <div className="lg:col-span-2 h-[300px] bg-slate-900/30 rounded-xl p-4 border border-slate-700/30">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={reciprocalIdentityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                        <XAxis dataKey="x" type="number"
                                            domain={[-2 * Math.PI, 2 * Math.PI]}
                                            tickFormatter={piTickFormatter}
                                            ticks={[-2 * Math.PI, -Math.PI, 0, Math.PI, 2 * Math.PI]}
                                            stroke="#64748b" />
                                        <YAxis domain={[0, 15]} stroke="#64748b" ticks={[0, 5, 10, 15]} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                                            labelFormatter={(l) => `x: ${(Number(l) / Math.PI).toFixed(2)}π`}
                                            formatter={(v: number | null) => v !== null ? v.toFixed(3) : '—'} />
                                        <Legend />
                                        <Line name="sec²(x)" type="monotone" dataKey="sec2" stroke="#22d3ee" strokeWidth={3} dot={false} connectNulls={false} />
                                        <Line name="tan²(x)" type="monotone" dataKey="tan2" stroke="#f43f5e" strokeWidth={3} dot={false} connectNulls={false} />
                                        <Line name="Diferença (= 1)" type="monotone" dataKey="diff" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" dot={false} connectNulls={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
