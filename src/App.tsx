import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Tooltip, ReferenceDot } from 'recharts';
import { Activity, RotateCcw, Circle as CircleIcon } from 'lucide-react';

type FunctionType = 'Seno' | 'Cosseno' | 'Tangente';

interface Parameters {
    A: number;
    B: number;
    C: number;
    D: number;
}

const DEFAULT_PARAMS: Parameters = { A: 1, B: 1, C: 0, D: 0 };

export default function App() {
    const [funcType, setFuncType] = useState<FunctionType>('Seno');
    const [params, setParams] = useState<Parameters>(DEFAULT_PARAMS);
    const [animProgress, setAnimProgress] = useState(0);

    // Animation loop for the tracing point
    useEffect(() => {
        let animationFrameId: number;

        const animate = (time: number) => {
            // Speed factor: completes one full cycle of the domain every 4 seconds
            const speed = 0.00025;
            setAnimProgress((time * speed) % 1);
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const handleParamChange = (key: keyof Parameters, value: number) => {
        setParams(prev => ({ ...prev, [key]: value }));
    };

    const resetParams = () => setParams(DEFAULT_PARAMS);

    const calculateY = (x: number, A: number, B: number, C: number, D: number, type: FunctionType) => {
        const angle = B * x + C;
        switch (type) {
            case 'Seno':
                return A * Math.sin(angle) + D;
            case 'Cosseno':
                return A * Math.cos(angle) + D;
            case 'Tangente': {
                const y = A * Math.tan(angle) + D;
                // Cap the tangent value to avoid breaking the chart with huge asymptotes
                if (y > 10) return null;
                if (y < -10) return null;
                return y;
            }
        }
    };

    const data = useMemo(() => {
        const points = [];
        const step = 0.05;
        const minX = -2 * Math.PI;
        const maxX = 2 * Math.PI;

        for (let x = minX; x <= maxX; x += step) {
            const y = calculateY(x, params.A, params.B, params.C, params.D, funcType);

            // We format x nicely for the tooltip
            points.push({
                x: x,
                xLabel: (x / Math.PI).toFixed(2) + 'π',
                y: y !== null ? Number(y.toFixed(3)) : null, // Handle nulls for Tangent breaks
            });
        }
        return points;
    }, [params, funcType]);

    // Calculate coordinates for the animated tracing dot
    const animatedDotConfig = useMemo(() => {
        const x = -2 * Math.PI + animProgress * (4 * Math.PI);
        const y = calculateY(x, params.A, params.B, params.C, params.D, funcType);
        return { x, y };
    }, [animProgress, params, funcType]);

    const getThemeColor = () => {
        switch (funcType) {
            case 'Seno': return '#06b6d4'; // Cyan-500
            case 'Cosseno': return '#8b5cf6'; // Violet-500
            case 'Tangente': return '#f43f5e'; // Rose-500
        }
    };

    const getEquationString = () => {
        const { A, B, C, D } = params;
        const funcStr = funcType === 'Seno' ? 'sin' : funcType === 'Cosseno' ? 'cos' : 'tan';

        // Formatting logic to make it look clean (e.g., handle 1, 0, negatives)
        const formatA = A === 1 ? '' : A === -1 ? '-' : A;
        const formatB = B === 1 ? 'x' : B === -1 ? '-x' : `${B}x`;
        const formatC = C === 0 ? '' : C > 0 ? ` + ${C.toFixed(1)}` : ` - ${Math.abs(C).toFixed(1)}`;
        const formatD = D === 0 ? '' : D > 0 ? ` + ${D.toFixed(1)}` : ` - ${Math.abs(D).toFixed(1)}`;

        return `f(x) = ${formatA}${funcStr}(${formatB}${formatC})${formatD}`;
    };

    const getPhysicalMeaning = () => {
        switch (funcType) {
            case 'Seno':
                return "A função Seno frequentemente representa oscilações que começam do equilíbrio, como ondas sonoras puras, pêndulos simples ou corrente alternada (AC).";
            case 'Cosseno':
                return "A função Cosseno é similar ao seno mas deslocada no tempo. Modela sistemas que começam na amplitude máxima, como uma mola esticada e solta.";
            case 'Tangente':
                return "A função Tangente descreve taxas de variação, projeções e fenômenos com assíntotas pontuais. Menos comum em ondas puras, mas vital em óptica e eletromagnetismo.";
        }
    };

    const getYoutubeVideoId = () => {
        switch (funcType) {
            case 'Seno':
                return "gPlVow1nJPo"; // Khan Academy Brasil - Seno
            case 'Cosseno':
                return "Nb7sbAP1nb8"; // Khan Academy Brasil - Cosseno
            case 'Tangente':
                return "FtDpbILOx_Y"; // Khan Academy - Tangente
        }
    };
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans transition-colors duration-500">

            {/* Header */}
            <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                        MathWave
                    </h1>
                </div>
                <div className="text-sm font-medium text-slate-400 px-4 py-1.5 rounded-full border border-slate-700/50 bg-slate-800/30">
                    Laboratório Interativo
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Left Column: Graph and Physics Panel */}
                <div className="lg:col-span-3 flex flex-col gap-6">

                    {/* Main Graph Area */}
                    <div className="glass-panel rounded-2xl p-6 relative flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Activity className={`w-5 h-5 ${funcType === 'Seno' ? 'text-cyan-400' : funcType === 'Cosseno' ? 'text-violet-400' : 'text-rose-400'}`} />
                                Visualização do Gráfico
                            </h2>

                            {/* Function Selectors */}
                            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-700/50">
                                {(['Seno', 'Cosseno', 'Tangente'] as FunctionType[]).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setFuncType(type)}
                                        className={`
                                px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300
                                ${funcType === type
                                                ? type === 'Seno' ? 'bg-cyan-500/20 text-cyan-300' : type === 'Cosseno' ? 'bg-violet-500/20 text-violet-300' : 'bg-rose-500/20 text-rose-300'
                                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}
                    `}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-[400px] w-full">
                            {/* Flex container for Unit Circle and LineChart */}
                            <div className="flex flex-col md:flex-row gap-6 w-full h-[350px]">

                                {/* Animated Unit Circle */}
                                <div className="w-[150px] md:w-[200px] h-full flex-shrink-0 flex items-center justify-center relative bg-slate-900/40 rounded-xl border border-slate-700/50">
                                    <svg viewBox="-1.2 -1.2 2.4 2.4" className="w-[80%] h-[80%] overflow-visible">
                                        {/* Axes */}
                                        <line x1="-1.2" y1="0" x2="1.2" y2="0" stroke="#475569" strokeWidth="0.02" />
                                        <line x1="0" y1="-1.2" x2="0" y2="1.2" stroke="#475569" strokeWidth="0.02" />

                                        {/* The Circle */}
                                        <circle cx="0" cy="0" r="1" fill="transparent" stroke="#334155" strokeWidth="0.03" />

                                        {/* Dynamic Angle Vector */}
                                        <line
                                            x1="0"
                                            y1="0"
                                            x2={Math.cos(animatedDotConfig.x)}
                                            y2={-Math.sin(animatedDotConfig.x)}
                                            stroke={getThemeColor()}
                                            strokeWidth="0.04"
                                            strokeLinecap="round"
                                            className="transition-none"
                                        />

                                        {/* Tracing Dot on Circumference */}
                                        <circle
                                            cx={Math.cos(animatedDotConfig.x)}
                                            cy={-Math.sin(animatedDotConfig.x)}
                                            r="0.08"
                                            fill="#fff"
                                            stroke={getThemeColor()}
                                            strokeWidth="0.04"
                                            className="transition-none shadow-lg drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
                                        />

                                        {/* Projection Lines based on Function Type */}
                                        {funcType === 'Seno' && (
                                            <line
                                                x1={Math.cos(animatedDotConfig.x)}
                                                y1={-Math.sin(animatedDotConfig.x)}
                                                x2={Math.cos(animatedDotConfig.x)}
                                                y2="0"
                                                stroke="#06b6d4"
                                                strokeWidth="0.03"
                                                strokeDasharray="0.05,0.05"
                                                className="opacity-70"
                                            />
                                        )}
                                        {funcType === 'Cosseno' && (
                                            <line
                                                x1={Math.cos(animatedDotConfig.x)}
                                                y1={-Math.sin(animatedDotConfig.x)}
                                                x2="0"
                                                y2={-Math.sin(animatedDotConfig.x)}
                                                stroke="#8b5cf6"
                                                strokeWidth="0.03"
                                                strokeDasharray="0.05,0.05"
                                                className="opacity-70"
                                            />
                                        )}
                                    </svg>

                                    <div className="absolute top-2 left-2 text-[10px] text-slate-500 font-mono">
                                        Círculo Unitário
                                    </div>
                                </div>

                                {/* Recharts Graph */}
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={data}
                                        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                                    >        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={true} horizontal={true} />

                                        {/* Customizing Ticks for PI */}
                                        <XAxis
                                            dataKey="x"
                                            type="number"
                                            domain={[-2 * Math.PI, 2 * Math.PI]}
                                            ticks={[-2 * Math.PI, -Math.PI, 0, Math.PI, 2 * Math.PI]}
                                            tickFormatter={(val) => {
                                                if (val === 0) return '0';
                                                const piRatio = val / Math.PI;
                                                if (piRatio === 1) return 'π';
                                                if (piRatio === -1) return '-π';
                                                return `${piRatio}π`;
                                            }}
                                            stroke="#64748b"
                                            angle={0}
                                            dy={10}
                                        />

                                        <YAxis
                                            domain={[-5, 5]}
                                            allowDataOverflow
                                            stroke="#64748b"
                                            dx={-10}
                                        />

                                        <ReferenceLine y={0} stroke="#94a3b8" opacity={0.5} strokeWidth={2} />
                                        <ReferenceLine x={0} stroke="#94a3b8" opacity={0.5} strokeWidth={2} />

                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                                            itemStyle={{ color: getThemeColor() }}
                                            labelFormatter={(label) => `x: ${(Number(label) / Math.PI).toFixed(2)}π`}
                                        />

                                        <Line
                                            type="monotone"
                                            dataKey="y"
                                            stroke={getThemeColor()}
                                            strokeWidth={3}
                                            dot={false}
                                            isAnimationActive={true}
                                            animationDuration={600}
                                            connectNulls={false} // Crucial for breaking the line on Tangent asymptotes
                                            activeDot={{ r: 6, fill: getThemeColor(), stroke: '#0f172a', strokeWidth: 2 }}
                                        />

                                        {/* Animated Tracing Dot */}
                                        {animatedDotConfig.y !== null && (
                                            <ReferenceDot
                                                x={animatedDotConfig.x}
                                                y={animatedDotConfig.y as number}
                                                r={6}
                                                fill="#fff"
                                                stroke={getThemeColor()}
                                                strokeWidth={3}
                                                isFront={true}
                                                className="transition-none shadow-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                            />
                                        )}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Equation Display Overlay */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2  glass-panel px-6 py-3 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                            <p className="font-mono text-xl tracking-wider text-slate-200">
                                {getEquationString()}
                            </p>
                        </div>
                    </div>

                    {/* Educational Physics Panel */}
                    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                            <CircleIcon className="w-32 h-32" />
                        </div>
                        <h3 className="text-lg font-semibold mb-3 text-slate-200">Significado Físico</h3>
                        <p className="text-slate-400 leading-relaxed max-w-3xl relative z-10 transition-all duration-300">
                            {getPhysicalMeaning()}
                        </p>
                    </div>

                    {/* YouTube Video Panel */}
                    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                            Mergulhe Fundo (Videoaula Khan Academy)
                        </h3>
                        <div className="relative w-full overflow-hidden rounded-xl border border-slate-700/50" style={{ paddingTop: '56.25%' }}>
                            <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${getYoutubeVideoId()}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen>
                            </iframe>
                        </div>
                    </div>

                </div>

                {/* Right Column: Controls */}
                <div className="lg:col-span-1 glass-panel rounded-2xl p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700/50">
                        <h2 className="text-lg font-semibold text-slate-200">Parâmetros</h2>
                        <button
                            onClick={resetParams}
                            className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors group"
                            title="Resetar parâmetros"
                        >
                            <RotateCcw className="w-4 h-4 group-hover:-rotate-90 transition-transform duration-300" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-6 flex-grow">

                        {/* Control Variable A */}
                        <ControlSlider
                            label="Amplitude (A)"
                            value={params.A}
                            min={0.1} max={5} step={0.1}
                            onChange={(v) => handleParamChange('A', v)}
                            themeColor={getThemeColor()}
                            description="Estica ou comprime verticalmente. Intensidade da onda."
                        />

                        {/* Control Variable B */}
                        <ControlSlider
                            label="Frequência (B)"
                            value={params.B}
                            min={0.5} max={5} step={0.5}
                            onChange={(v) => handleParamChange('B', v)}
                            themeColor={getThemeColor()}
                            description="Comprime horizontalmente. Quantidade de ciclos."
                        />

                        {/* Control Variable C */}
                        <ControlSlider
                            label="Fase (C)"
                            value={params.C}
                            min={-Math.PI} max={Math.PI} step={Math.PI / 4}
                            onChange={(v) => handleParamChange('C', v)}
                            themeColor={getThemeColor()}
                            description="Desloca a onda horizontalmente (no tempo)."
                            formatValue={(v) => `${(v / Math.PI).toFixed(2)}π`}
                        />

                        {/* Control Variable D */}
                        <ControlSlider
                            label="Desloc. Vertical (D)"
                            value={params.D}
                            min={-3} max={3} step={0.5}
                            onChange={(v) => handleParamChange('D', v)}
                            themeColor={getThemeColor()}
                            description="Desloca a onda verticalmente (bias)."
                        />

                    </div>
                </div>

            </div>
        </div >
    );
}

// Sub-component for Sliders to keep things neat
interface ControlSliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (val: number) => void;
    themeColor: string;
    description: string;
    formatValue?: (val: number) => string;
}

function ControlSlider({ label, value, min, max, step, onChange, themeColor, description, formatValue }: ControlSliderProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
                <label className="text-sm font-medium text-slate-300">{label}</label>
                <span className="text-xs font-mono px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">
                    {formatValue ? formatValue(value) : value.toFixed(1)}
                </span>
            </div>

            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-700"
                style={{
                    background: `linear-gradient(to right, ${themeColor} 0%, ${themeColor} ${((value - min) / (max - min)) * 100}%, #334155 ${((value - min) / (max - min)) * 100}%, #334155 100%)`
                }}
            />
            <style dangerouslySetInnerHTML={{
                __html: `
            input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #fff;
            cursor: pointer;
            border: 2px solid ${themeColor};
            box-shadow: 0 0 10px ${themeColor}80;
            transition: transform 0.1s;
        }
            input[type=range]::-webkit-slider-thumb:hover {
                transform: scale(1.2);
        }
      `}} />
            <p className="text-[10px] text-slate-500 leading-tight mt-1">
                {description}
            </p>
        </div>
    );
}
