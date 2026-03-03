import React, { useState, useMemo } from 'react';
import { Activity, BookOpen, Scaling, Clock, Hash, ArrowLeftRight, Link2, RefreshCw, Triangle } from 'lucide-react';
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

// ─── Identity Formula Card ────────────────────────────────────────────────────
interface IdentityCardProps {
    formula: string;
    description: string;
    color: string;
    derivation: string;
}
function IdentityCard({ formula, description, color, derivation }: IdentityCardProps) {
    return (
        <div className="glass-panel rounded-xl p-5 flex flex-col gap-3 border" style={{ borderColor: `${color}30` }}>
            <p className="font-mono text-base text-center py-2 px-3 rounded-lg bg-slate-900/50 border border-slate-700/40" style={{ color }}>
                {formula}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
            <p className="text-xs font-mono text-slate-500 bg-slate-800/60 px-3 py-1.5 rounded-lg">{derivation}</p>
        </div>
    );
}

// ─── Interactive Triangle SVG ─────────────────────────────────────────────────
function TrigTriangleDiagram({ angleDeg }: { angleDeg: number }) {
    const W = 420, H = 420;
    const cx = 175, cy = 210, R = 140; // circle center and radius

    const a = (angleDeg * Math.PI) / 180;
    const sinA = Math.sin(a);
    const cosA = Math.cos(a);

    // Guard: avoid division by zero near 0, 90, 180, 270 deg
    const safeAngle = Math.abs(cosA) < 0.05 || Math.abs(sinA) < 0.05;

    // Points in SVG space (y-axis is inverted)
    const px = cx + R * cosA;           // point on circle
    const py = cy - R * sinA;

    const cosProj = cx + R * cosA;      // foot of perpendicular to x-axis = (cos,0)
    const cosProjY = cy;

    // Tangent triangle: at x = 1 (SVG: cx + R), line from origin to (1, tan)
    const tanPtX = cx + R;
    const tanPtY = cy - R * (sinA / cosA); // tan(a) in SVG coords

    // Cotangent triangle: at y = 1 (SVG: cy - R), line from origin to (cot, 1)
    const cotPtX = cx + R * (cosA / sinA); // cot(a)
    const cotPtY = cy - R;

    const fmt = (v: number) => Math.abs(v) > 99 ? '∞' : v.toFixed(3);

    const sinVal = sinA;
    const cosVal = cosA;
    const tanVal = Math.abs(cosA) > 0.01 ? sinA / cosA : NaN;
    const cotVal = Math.abs(sinA) > 0.01 ? cosA / sinA : NaN;
    const secVal = Math.abs(cosA) > 0.01 ? 1 / cosA : NaN;
    const cscVal = Math.abs(sinA) > 0.01 ? 1 / sinA : NaN;

    const tanVisible = Math.abs(cosA) > 0.06 && tanPtY > -200 && tanPtY < 600;
    const cotVisible = Math.abs(sinA) > 0.06 && cotPtX > -200 && cotPtX < 800;

    return (
        <div className="flex flex-col gap-4">
            <svg viewBox={`-20 -20 ${W + 80} ${H + 20}`} className="w-full max-w-[480px] mx-auto">
                {/* Grid */}
                <line x1={cx - R - 20} y1={cy} x2={cx + R + 90} y2={cy} stroke="#334155" strokeWidth={1} />
                <line x1={cx} y1={cy + R + 20} x2={cx} y2={cy - R - 20} stroke="#334155" strokeWidth={1} />

                {/* Unit circle */}
                <circle cx={cx} cy={cy} r={R} fill="none" stroke="#475569" strokeWidth={1.5} strokeDasharray="4 3" />

                {/* ── Triangle 1 (PURPLE): cos & sin — main right triangle ── */}
                {/* Hypotenuse = 1 (radius): origin → point on circle */}
                <line x1={cx} y1={cy} x2={px} y2={py} stroke="#8b5cf6" strokeWidth={2.5} />
                {/* cos leg: origin → (cos, 0) */}
                <line x1={cx} y1={cy} x2={cosProj} y2={cosProjY} stroke="#8b5cf6" strokeWidth={2} strokeDasharray="none" />
                {/* sin leg: (cos, 0) → point on circle */}
                <line x1={cosProj} y1={cosProjY} x2={px} y2={py} stroke="#22d3ee" strokeWidth={2.5} />
                {/* Right angle marker at foot */}
                {Math.abs(sinA) > 0.05 && Math.abs(cosA) > 0.05 && (
                    <>
                        <line x1={cosProj - 7 * Math.sign(cosA)} y1={cosProjY} x2={cosProj - 7 * Math.sign(cosA)} y2={cosProjY - 7 * Math.sign(sinA)} stroke="#64748b" strokeWidth={1} />
                        <line x1={cosProj - 7 * Math.sign(cosA)} y1={cosProjY - 7 * Math.sign(sinA)} x2={cosProj} y2={cosProjY - 7 * Math.sign(sinA)} stroke="#64748b" strokeWidth={1} />
                    </>
                )}

                {/* ── Triangle 2 (CYAN): tan & sec — tangent line at x=1 ── */}
                {tanVisible && (
                    <>
                        {/* sec: origin → tangent point */}
                        <line x1={cx} y1={cy} x2={tanPtX} y2={tanPtY} stroke="#22d3ee" strokeWidth={2} strokeDasharray="5 3" />
                        {/* tan: (1,0) → tangent point */}
                        <line x1={tanPtX} y1={cy} x2={tanPtX} y2={tanPtY} stroke="#f59e0b" strokeWidth={2.5} />
                        {/* base (=1): origin → (1,0) */}
                        <line x1={cx} y1={cy} x2={tanPtX} y2={cy} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3 3" />
                        {/* right angle at (1,0) */}
                        <rect x={tanPtX - 6} y={cy - 6} width={6} height={6} fill="none" stroke="#64748b" strokeWidth={1} />
                        {/* tangent label */}
                        <text x={tanPtX + 8} y={(cy + tanPtY) / 2} fill="#f59e0b" fontSize={11} fontFamily="monospace">
                            tan={fmt(tanVal)}
                        </text>
                        {/* sec label */}
                        <text x={(cx + tanPtX) / 2 - 10} y={(cy + tanPtY) / 2 - 10} fill="#22d3ee" fontSize={10} fontFamily="monospace">
                            sec={fmt(secVal)}
                        </text>
                    </>
                )}

                {/* ── Triangle 3 (GREEN): cot & csc — cotangent line at y=1 ── */}
                {cotVisible && (
                    <>
                        {/* csc: origin → cotangent point */}
                        <line x1={cx} y1={cy} x2={cotPtX} y2={cotPtY} stroke="#10b981" strokeWidth={2} strokeDasharray="5 3" />
                        {/* cot: (0,1) → cotangent point */}
                        <line x1={cx} y1={cotPtY} x2={cotPtX} y2={cotPtY} stroke="#fb923c" strokeWidth={2.5} />
                        {/* right angle at (0,1) */}
                        <rect x={cx} y={cotPtY} width={6} height={6} fill="none" stroke="#64748b" strokeWidth={1} />
                        {/* cot label */}
                        <text x={(cx + cotPtX) / 2 - 10} y={cotPtY - 7} fill="#fb923c" fontSize={11} fontFamily="monospace">
                            cot={fmt(cotVal)}
                        </text>
                        {/* csc label */}
                        <text x={(cx + cotPtX) / 2 + 10} y={(cy + cotPtY) / 2 + 5} fill="#10b981" fontSize={10} fontFamily="monospace">
                            csc={fmt(cscVal)}
                        </text>
                    </>
                )}

                {/* ── Labels for triangle 1 ── */}
                {/* cos label below the leg */}
                <text x={(cx + cosProj) / 2} y={cy + 16} fill="#8b5cf6" fontSize={11} textAnchor="middle" fontFamily="monospace">
                    cos={fmt(cosVal)}
                </text>
                {/* sin label right of the leg */}
                <text x={cosProj + (cosA >= 0 ? 6 : -60)} y={(cy + py) / 2 + 4} fill="#22d3ee" fontSize={11} fontFamily="monospace">
                    sin={fmt(sinVal)}
                </text>
                {/* hypotenuse = 1 label */}
                <text x={(cx + px) / 2 - 14} y={(cy + py) / 2 - 6} fill="#8b5cf6" fontSize={10} fontFamily="monospace" opacity={0.8}>
                    1
                </text>

                {/* ── Arc for angle θ ── */}
                {Math.abs(a) > 0.05 && (
                    <path
                        d={`M ${cx + 28} ${cy} A 28 28 0 ${angleDeg > 180 ? 1 : 0} ${sinA >= 0 ? 1 : 0} ${cx + 28 * cosA} ${cy - 28 * sinA}`}
                        fill="none" stroke="#fbbf24" strokeWidth={1.5}
                    />
                )}
                <text x={cx + 34 * Math.cos(a / 2)} y={cy - 34 * Math.sin(a / 2) + 3}
                    fill="#fbbf24" fontSize={11} fontFamily="monospace">
                    θ
                </text>

                {/* ── Point on circle ── */}
                <circle cx={px} cy={py} r={5} fill="#8b5cf6" />
                <circle cx={cx} cy={cy} r={3} fill="#94a3b8" />

                {/* Axis labels */}
                <text x={cx + R + 95} y={cy + 4} fill="#64748b" fontSize={11}>x</text>
                <text x={cx + 3} y={cy - R - 8} fill="#64748b" fontSize={11}>y</text>
            </svg>

            {/* Live values mini-table */}
            {safeAngle ? (
                <p className="text-center text-amber-400 text-xs">⚠ Neste ângulo algumas funções tendem ao infinito</p>
            ) : (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs font-mono">
                    {[
                        { label: 'sen', val: sinVal, color: '#22d3ee' },
                        { label: 'cos', val: cosVal, color: '#8b5cf6' },
                        { label: 'tan', val: tanVal, color: '#f59e0b' },
                        { label: 'cot', val: cotVal, color: '#fb923c' },
                        { label: 'sec', val: secVal, color: '#22d3ee' },
                        { label: 'csc', val: cscVal, color: '#10b981' },
                    ].map(({ label, val, color }) => (
                        <div key={label} className="bg-slate-800/60 rounded-lg p-2 border border-slate-700/40">
                            <p className="font-semibold" style={{ color }}>{label}</p>
                            <p className="text-slate-300">{isNaN(val) ? '—' : fmt(val)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Tab definitions ─────────────────────────────────────────────────────────
type Tab = 'primary' | 'reciprocal' | 'relations';

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TrigProperties() {
    const [activeTab, setActiveTab] = useState<Tab>('primary');
    const [angleDeg, setAngleDeg] = useState(35);

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
                <div className="flex flex-wrap gap-2 mt-5 w-fit p-1 rounded-xl bg-slate-800/60 border border-slate-700/50">
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
                    <button
                        onClick={() => setActiveTab('relations')}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'relations'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <Triangle className="w-4 h-4" />
                        Relações e Triângulos
                        <span className="text-xs opacity-60 font-mono">tan=sin/cos…</span>
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

            {/* ── Relations Tab ────────────────────────────────────────────── */}
            {activeTab === 'relations' && (
                <>
                    {/* Interactive diagram + angle slider */}
                    <div className="glass-panel rounded-2xl p-6 border border-amber-500/20">
                        <h3 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
                            <Triangle className="w-6 h-6 text-amber-400" />
                            Os 3 Triângulos do Círculo Unitário
                        </h3>
                        <p className="text-slate-400 mb-4 text-sm leading-relaxed max-w-2xl">
                            Cada par de funções forma um triângulo retângulo a partir do mesmo ângulo θ. Mova o controle para ver como os segmentos se transformam.
                        </p>

                        {/* Legend */}
                        <div className="flex flex-wrap gap-4 mb-5 text-xs font-mono">
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-violet-500 inline-block" />Triângulo principal (cos, sin, r=1)</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />Triângulo da tangente (tan, 1, sec)</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-400 inline-block" />Triângulo da cotangente (cot, 1, csc)</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            <div>
                                <TrigTriangleDiagram angleDeg={angleDeg} />
                                <div className="mt-4">
                                    <label className="block text-sm text-slate-400 mb-2 font-medium">
                                        Ângulo θ = <span className="text-amber-400 font-mono">{angleDeg}°</span>
                                        <span className="text-slate-500 ml-2">({(angleDeg * Math.PI / 180).toFixed(3)} rad)</span>
                                    </label>
                                    <input
                                        type="range"
                                        min={5} max={355} step={1}
                                        value={angleDeg}
                                        onChange={e => setAngleDeg(Number(e.target.value))}
                                        style={{
                                            width: '100%', accentColor: '#f59e0b',
                                            background: `linear-gradient(to right, #f59e0b ${((angleDeg - 5) / 350) * 100}%, #334155 ${((angleDeg - 5) / 350) * 100}%)`,
                                            height: '6px', borderRadius: '9999px', outline: 'none', cursor: 'pointer'
                                        }}
                                    />
                                    <div className="flex justify-between text-xs text-slate-500 mt-1 font-mono">
                                        <span>5°</span><span>90°</span><span>180°</span><span>270°</span><span>355°</span>
                                    </div>
                                </div>
                            </div>

                            {/* Geometric explanation */}
                            <div className="flex flex-col gap-3">
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-violet-500/20">
                                    <p className="text-xs text-violet-400 font-semibold uppercase tracking-wide mb-2">Triângulo Principal</p>
                                    <p className="font-mono text-sm text-slate-200 mb-1">Hipotenusa = raio = 1</p>
                                    <p className="font-mono text-sm text-cyan-300">Cateto vertical = sen(θ)</p>
                                    <p className="font-mono text-sm text-violet-300">Cateto horizontal = cos(θ)</p>
                                    <p className="text-xs text-slate-500 mt-2">→ sen²(θ) + cos²(θ) = 1²</p>
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-amber-500/20">
                                    <p className="text-xs text-amber-400 font-semibold uppercase tracking-wide mb-2">Triângulo da Tangente (fora do círculo, x = 1)</p>
                                    <p className="font-mono text-sm text-slate-300">Cateto base = 1</p>
                                    <p className="font-mono text-sm text-amber-300">Cateto vertical = tan(θ) = sen/cos</p>
                                    <p className="font-mono text-sm text-cyan-300">Hipotenusa = sec(θ) = 1/cos</p>
                                    <p className="text-xs text-slate-500 mt-2">→ 1 + tan²(θ) = sec²(θ)</p>
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-orange-500/20">
                                    <p className="text-xs text-orange-400 font-semibold uppercase tracking-wide mb-2">Triângulo da Cotangente (fora do círculo, y = 1)</p>
                                    <p className="font-mono text-sm text-slate-300">Cateto base = 1</p>
                                    <p className="font-mono text-sm text-orange-300">Cateto horizontal = cot(θ) = cos/sen</p>
                                    <p className="font-mono text-sm text-emerald-300">Hipotenusa = csc(θ) = 1/sen</p>
                                    <p className="text-xs text-slate-500 mt-2">→ 1 + cot²(θ) = csc²(θ)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Identity cards */}
                    <div className="glass-panel rounded-2xl p-6 border border-slate-700/40">
                        <h3 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
                            <Link2 className="w-6 h-6 text-slate-400" />
                            Identidades de Quociente e Pitagóricas
                        </h3>
                        <p className="text-slate-400 text-sm mb-6">Todas as 6 funções trigonométricas podem ser expressas em termos de sen e cos.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <IdentityCard
                                formula="tan(x) = sen(x) / cos(x)"
                                description="A tangente é a razão entre a projeção vertical e horizontal do ponto no círculo unitário."
                                color="#f59e0b"
                                derivation="Triângulo tan: cateto_oposto / cateto_adjacente"
                            />
                            <IdentityCard
                                formula="cot(x) = cos(x) / sen(x)"
                                description="A cotangente inverte essa razão. É o oposto da tangente: cot = 1/tan."
                                color="#fb923c"
                                derivation="cot = cos/sin = 1/tan"
                            />
                            <IdentityCard
                                formula="sec(x) = 1 / cos(x)"
                                description="A secante é a hipotenusa do triângulo externo ao círculo no eixo x."
                                color="#22d3ee"
                                derivation="Triângulo sec: hipotenusa / base = 1/cos"
                            />
                            <IdentityCard
                                formula="csc(x) = 1 / sen(x)"
                                description="A cossecante é a hipotenusa do triângulo externo ao círculo no eixo y."
                                color="#10b981"
                                derivation="Triângulo csc: hipotenusa / lado = 1/sin"
                            />
                            <IdentityCard
                                formula="1 + tan²(x) = sec²(x)"
                                description="Pitágoras aplicado ao triângulo externo em x=1. Obtida dividindo sen²+cos²=1 por cos²."
                                color="#f59e0b"
                                derivation="(sin²+cos²)/cos² = 1/cos² → tan²+1=sec²"
                            />
                            <IdentityCard
                                formula="1 + cot²(x) = csc²(x)"
                                description="Pitágoras aplicado ao triângulo externo em y=1. Obtida dividindo sen²+cos²=1 por sen²."
                                color="#10b981"
                                derivation="(sin²+cos²)/sin² = 1/sin² → 1+cot²=csc²"
                            />
                        </div>
                    </div>

                    {/* Summary table */}
                    <div className="glass-panel rounded-2xl p-6 border border-slate-700/40">
                        <h3 className="text-lg font-bold text-slate-100 mb-4">Resumo das Relações</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm font-mono">
                                <thead>
                                    <tr className="border-b border-slate-700">
                                        <th className="text-left py-2 px-3 text-slate-400">Função</th>
                                        <th className="text-left py-2 px-3 text-slate-400">Definição</th>
                                        <th className="text-left py-2 px-3 text-slate-400">Via sen/cos</th>
                                        <th className="text-left py-2 px-3 text-slate-400">Identidade Pitagórica</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { fn: 'tan(x)', color: '#f59e0b', def: 'oposto / adjacente', expr: 'sen(x) / cos(x)', pyth: 'tan²+ 1 = sec²' },
                                        { fn: 'cot(x)', color: '#fb923c', def: 'adjacente / oposto', expr: 'cos(x) / sen(x)', pyth: 'cot²+ 1 = csc²' },
                                        { fn: 'sec(x)', color: '#22d3ee', def: 'hipotenusa / adjacente', expr: '1 / cos(x)', pyth: 'sec²− tan²= 1' },
                                        { fn: 'csc(x)', color: '#10b981', def: 'hipotenusa / oposto', expr: '1 / sen(x)', pyth: 'csc²− cot²= 1' },
                                    ].map(row => (
                                        <tr key={row.fn} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                                            <td className="py-2.5 px-3 font-bold" style={{ color: row.color }}>{row.fn}</td>
                                            <td className="py-2.5 px-3 text-slate-400">{row.def}</td>
                                            <td className="py-2.5 px-3 text-slate-300">{row.expr}</td>
                                            <td className="py-2.5 px-3 text-slate-400">{row.pyth}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
