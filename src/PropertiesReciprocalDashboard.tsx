import React, { useMemo } from 'react';
import { Activity, BookOpen, Scaling, Clock, Hash, ArrowLeftRight, Link2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PropertyCardProps {
    title: string;
    icon: React.ReactNode;
    secantValue: React.ReactNode;
    cosecantValue: React.ReactNode;
    cotangentValue: React.ReactNode;
}

function PropertyCard({ title, icon, secantValue, cosecantValue, cotangentValue }: PropertyCardProps) {
    return (
        <div className="glass-panel rounded-2xl p-6 flex flex-col hover:border-cyan-500/30 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                    {icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
            </div>

            <div className="flex flex-col gap-4 mt-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
                    <span className="text-sm font-medium text-cyan-400">Secante</span>
                    <span className="text-sm text-slate-300 font-mono text-right">{secantValue}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
                    <span className="text-sm font-medium text-violet-400">Cossecante</span>
                    <span className="text-sm text-slate-300 font-mono text-right">{cosecantValue}</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                    <span className="text-sm font-medium text-rose-400">Cotangente</span>
                    <span className="text-sm text-slate-300 font-mono text-right">{cotangentValue}</span>
                </div>
            </div>
        </div>
    );
}

export default function PropertiesReciprocalDashboard() {
    const reciprocalIdentityData = useMemo(() => {
        const data = [];
        for (let x = -2 * Math.PI; x <= 2 * Math.PI; x += 0.05) {
            const cosVal = Math.cos(x);
            const secVal = 1 / cosVal;
            const tanVal = Math.tan(x);

            // Filter out asymptotes for a cleaner graph where cos(x) is close to 0
            if (Math.abs(cosVal) > 0.1) {
                data.push({
                    x: x,
                    sec2: secVal * secVal,
                    tan2: tanVal * tanVal,
                    diff: secVal * secVal - tanVal * tanVal
                });
            } else {
                data.push({
                    x: x,
                    sec2: null,
                    tan2: null,
                    diff: null
                });
            }
        }
        return data;
    }, []);

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <BookOpen className="w-32 h-32" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Propriedades das Curvas Recíprocas</h2>
                <p className="text-slate-400 max-w-3xl relative z-10">
                    Neste painel, exploramos as funções inversas multiplicativas fundamentais: Secante <code className="bg-slate-800 px-1 rounded">1/cos(x)</code>, Cossecante <code className="bg-slate-800 px-1 rounded">1/sen(x)</code> e Cotangente <code className="bg-slate-800 px-1 rounded">1/tan(x)</code>.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <PropertyCard
                    title="Domínio"
                    icon={<ArrowLeftRight className="w-5 h-5 text-slate-400" />}
                    secantValue={<>x ≠ π/2 + kπ</>}
                    cosecantValue={<>x ≠ kπ</>}
                    cotangentValue={<>x ≠ kπ</>}
                />

                <PropertyCard
                    title="Imagem"
                    icon={<Scaling className="w-5 h-5 text-slate-400" />}
                    secantValue="(-∞, -1] ∪ [1, ∞)"
                    cosecantValue="(-∞, -1] ∪ [1, ∞)"
                    cotangentValue="ℝ (Todos os Reais)"
                />

                <PropertyCard
                    title="Período"
                    icon={<Clock className="w-5 h-5 text-slate-400" />}
                    secantValue="2π (~6.28)"
                    cosecantValue="2π (~6.28)"
                    cotangentValue="π (~3.14)"
                />

                <PropertyCard
                    title="Paridade"
                    icon={<Activity className="w-5 h-5 text-slate-400" />}
                    secantValue="Par: f(-x) = f(x)"
                    cosecantValue="Ímpar: f(-x) = -f(x)"
                    cotangentValue="Ímpar: f(-x) = -f(x)"
                />

                <PropertyCard
                    title="Assíntotas"
                    icon={<Scaling className="w-5 h-5 text-slate-400 rotate-90" />}
                    secantValue={<>x = π/2 + kπ</>}
                    cosecantValue={<>x = kπ</>}
                    cotangentValue={<>x = kπ</>}
                />

                <PropertyCard
                    title="Raízes Principais"
                    icon={<Hash className="w-5 h-5 text-slate-400" />}
                    secantValue="Nenhuma"
                    cosecantValue="Nenhuma"
                    cotangentValue={<>π/2, 3π/2...</>}
                />

            </div>

            {/* Reciprocal Identity Section */}
            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden mt-2 border border-emerald-500/20">
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
                                sec²(x) - tan²(x) = 1
                            </p>
                        </div>
                        <p className="text-slate-400 leading-relaxed">
                            Assim como Seno e Cosseno, as funções recíprocas também obedecem a identidades pitagóricas. Ao dividirmos a Relação Fundamental original inteira por <strong>cos²(x)</strong>, ela se transforma nesta bela igualdade para a Secante.
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            Apesar dos gráficos de <code className="text-slate-300 bg-slate-800 px-1 rounded">sec²(x)</code> e <code className="text-slate-300 bg-slate-800 px-1 rounded">tan²(x)</code> possuírem assíntotas (explosões ao infinito), a diferença cravada entre a onda de um e de outro nas intersecções resultará perfeitamente em 1.
                        </p>
                    </div>

                    <div className="lg:col-span-2 h-[300px] bg-slate-900/30 rounded-xl p-4 border border-slate-700/30">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={reciprocalIdentityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis
                                    dataKey="x"
                                    type="number"
                                    domain={[-2 * Math.PI, 2 * Math.PI]}
                                    tickFormatter={(val) => {
                                        if (Math.abs(val) < 0.1) return '0';
                                        const piRatio = val / Math.PI;
                                        return `${piRatio.toFixed(1)}π`;
                                    }}
                                    stroke="#64748b"
                                    ticks={[-2 * Math.PI, -Math.PI, 0, Math.PI, 2 * Math.PI]}
                                />
                                <YAxis domain={[0, 15]} stroke="#64748b" ticks={[0, 5, 10, 15]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                                    labelFormatter={(label) => `x: ${(Number(label) / Math.PI).toFixed(2)}π`}
                                    formatter={(value: number | null) => value !== null ? value.toFixed(2) : '-'}
                                />
                                <Legend />
                                <Line
                                    name="sec²(x)"
                                    type="monotone"
                                    dataKey="sec2"
                                    stroke="#22d3ee"
                                    strokeWidth={3}
                                    dot={false}
                                    connectNulls={false}
                                    isAnimationActive={true}
                                />
                                <Line
                                    name="tan²(x)"
                                    type="monotone"
                                    dataKey="tan2"
                                    stroke="#f43f5e"
                                    strokeWidth={3}
                                    dot={false}
                                    connectNulls={false}
                                    isAnimationActive={true}
                                />
                                <Line
                                    name="Diferença (= 1)"
                                    type="monotone"
                                    dataKey="diff"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    strokeDasharray="5 5"
                                    dot={false}
                                    connectNulls={false}
                                    isAnimationActive={true}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
}
