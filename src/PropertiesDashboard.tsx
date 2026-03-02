import React, { useMemo } from 'react';
import { Activity, BookOpen, Scaling, Clock, Hash, ArrowLeftRight, Link2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';

type FunctionType = 'Seno' | 'Cosseno' | 'Tangente';

interface PropertyCardProps {
    title: string;
    icon: React.ReactNode;
    sineValue: React.ReactNode;
    cosineValue: React.ReactNode;
    tangentValue: React.ReactNode;
}

function PropertyCard({ title, icon, sineValue, cosineValue, tangentValue }: PropertyCardProps) {
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
                    <span className="text-sm font-medium text-cyan-400">Seno</span>
                    <span className="text-sm text-slate-300 font-mono text-right">{sineValue}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
                    <span className="text-sm font-medium text-violet-400">Cosseno</span>
                    <span className="text-sm text-slate-300 font-mono text-right">{cosineValue}</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                    <span className="text-sm font-medium text-rose-400">Tangente</span>
                    <span className="text-sm text-slate-300 font-mono text-right">{tangentValue}</span>
                </div>
            </div>
        </div>
    );
}

export default function PropertiesDashboard() {
    const identityData = useMemo(() => {
        const data = [];
        for (let x = -2 * Math.PI; x <= 2 * Math.PI; x += 0.1) {
            const sinVal = Math.sin(x);
            const cosVal = Math.cos(x);
            data.push({
                x: x,
                sin2: sinVal * sinVal,
                cos2: cosVal * cosVal,
                sum: sinVal * sinVal + cosVal * cosVal
            });
        }
        return data;
    }, []);

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <BookOpen className="w-32 h-32" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Propriedades Matemáticas das Curvas</h2>
                <p className="text-slate-400 max-w-3xl relative z-10">
                    Neste painel, você encontra o resumo das propriedades fundamentais que definem e diferenciam o Seno, Cosseno e a Tangente, baseados na função mãe pura <code className="bg-slate-800 px-1 rounded">f(x)</code>.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <PropertyCard
                    title="Domínio"
                    icon={<ArrowLeftRight className="w-5 h-5 text-slate-400" />}
                    sineValue="ℝ (Todos os Reais)"
                    cosineValue="ℝ (Todos os Reais)"
                    tangentValue={<>x ≠ π/2 + kπ</>}
                />

                <PropertyCard
                    title="Imagem"
                    icon={<Scaling className="w-5 h-5 text-slate-400" />}
                    sineValue="[-1, 1]"
                    cosineValue="[-1, 1]"
                    tangentValue="ℝ (Todos os Reais)"
                />

                <PropertyCard
                    title="Período"
                    icon={<Clock className="w-5 h-5 text-slate-400" />}
                    sineValue="2π (~6.28)"
                    cosineValue="2π (~6.28)"
                    tangentValue="π (~3.14)"
                />

                <PropertyCard
                    title="Paridade"
                    icon={<Activity className="w-5 h-5 text-slate-400" />}
                    sineValue="Ímpar: f(-x) = -f(x)"
                    cosineValue="Par: f(-x) = f(x)"
                    tangentValue="Ímpar: f(-x) = -f(x)"
                />

                <PropertyCard
                    title="Raízes Principais"
                    icon={<Hash className="w-5 h-5 text-slate-400" />}
                    sineValue="0, π, 2π..."
                    cosineValue="π/2, 3π/2..."
                    tangentValue="0, π, 2π..."
                />

                <PropertyCard
                    title="Assíntotas"
                    icon={<Scaling className="w-5 h-5 text-slate-400 rotate-90" />}
                    sineValue="Nenhuma"
                    cosineValue="Nenhuma"
                    tangentValue={<>Sim, em x = π/2 + kπ</>}
                />

            </div>

            {/* Fundamental Identity Section */}
            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden mt-2 border border-amber-500/20">
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
                            Esta é a identidade mais importante da trigonometria. Ela é uma consequência direta do <strong>Teorema de Pitágoras</strong> aplicado ao círculo unitário.
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            Como o raio do círculo unitário é sempre 1, e as coordenadas de qualquer ponto na borda são <code className="text-slate-300 bg-slate-800 px-1 rounded">(cos(x), sen(x))</code>, a soma dos quadrados dos catetos sempre resultará no quadrado da hipotenusa (1² = 1).
                        </p>
                    </div>

                    <div className="lg:col-span-2 h-[300px] bg-slate-900/30 rounded-xl p-4 border border-slate-700/30">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={identityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                                <YAxis domain={[0, 1.2]} stroke="#64748b" ticks={[0, 0.5, 1]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                                    labelFormatter={(label) => `x: ${(Number(label) / Math.PI).toFixed(2)}π`}
                                    formatter={(value: number) => value.toFixed(2)}
                                />
                                <Legend />
                                <Line
                                    name="sen²(x)"
                                    type="monotone"
                                    dataKey="sin2"
                                    stroke="#22d3ee"
                                    strokeWidth={3}
                                    dot={false}
                                    isAnimationActive={true}
                                />
                                <Line
                                    name="cos²(x)"
                                    type="monotone"
                                    dataKey="cos2"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={false}
                                    isAnimationActive={true}
                                />
                                <Line
                                    name="Soma (= 1)"
                                    type="monotone"
                                    dataKey="sum"
                                    stroke="#fbbf24"
                                    strokeWidth={3}
                                    strokeDasharray="5 5"
                                    dot={false}
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
