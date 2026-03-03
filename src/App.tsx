import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Tooltip, ReferenceDot } from 'recharts';
import { Activity, RotateCcw, Circle as CircleIcon, LayoutDashboard, Calculator, Library, Triangle, Box } from 'lucide-react';
import TrigProperties from './TrigProperties';
import VolumeSimulator from './VolumeSimulator';
import TrigCircle from './TrigCircle';
import LogDashboard from './LogDashboard';
import Sidebar, { ViewType } from './Sidebar';

type FunctionType = 'Seno' | 'Cosseno' | 'Tangente' | 'Secante' | 'Cossecante' | 'Cotangente';

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
    const [currentView, setCurrentView] = useState<ViewType>('simulator');
    const [isManualMode, setIsManualMode] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Animation loop for the tracing point
    useEffect(() => {
        if (isManualMode || isDragging) return;

        let animationFrameId: number;
        let lastTime: number | null = null;

        const animate = (time: number) => {
            if (lastTime === null) {
                lastTime = time;
            }
            const deltaTime = time - lastTime;
            lastTime = time;

            // Speed factor: completes one full cycle of the domain roughly every 4 seconds
            const speed = 0.00025;
            setAnimProgress(prev => (prev + deltaTime * speed) % 1);
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isManualMode, isDragging]);

    const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
        setIsDragging(true);
        setIsManualMode(true);
        updateAngleFromEvent(e);
        (e.target as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!isDragging) return;
        updateAngleFromEvent(e);
    };

    const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
        setIsDragging(false);
        (e.target as Element).releasePointerCapture(e.pointerId);
    };

    const updateAngleFromEvent = (e: React.PointerEvent<SVGSVGElement>) => {
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        // SVG viewBox is "-1.2 -1.2 2.4 2.4", so center is essentially the middle of the rect
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate angle relative to center
        // Note: standard math angle goes counter-clockwise from right
        // screen Y goes down, so we flip the Y diff
        const dx = e.clientX - centerX;
        const dy = centerY - e.clientY;

        let angle = Math.atan2(dy, dx); // range -PI to PI

        // Ensure angle maps correctly to animProgress (0 to 1 domain across -2PI to 2PI)
        // Currently the dot goes from -2PI to 2PI as animProgress goes 0 to 1
        // meaning the circle completes 2 full revolutions.
        // The angle of the circle at any given `animProgress` is:
        // x = -2*PI + animProgress * 4*PI
        // We want to update `animProgress` based on dragging the angle.

        // Let's normalize the dragged angle to 0 -> 2PI range
        if (angle < 0) {
            angle += 2 * Math.PI;
        }

        // To map this back smoothly, we should figure out which revolution we are currently in
        // animProgress = 0.5 is x=0 (angle 0)
        // animProgress < 0.5 is negative revolution
        // animProgress > 0.5 is positive revolution

        let currentTotalAngle = -2 * Math.PI + animProgress * (4 * Math.PI);
        let currentRevolutions = Math.floor(currentTotalAngle / (2 * Math.PI));

        // The new total angle we want is preserving the revolution count but using the dragged offset
        let newTotalAngle = (currentRevolutions * 2 * Math.PI) + angle;

        // Keep it bounded within the simulator's domain [-2PI, 2PI]
        if (newTotalAngle < -2 * Math.PI) newTotalAngle = -2 * Math.PI;
        if (newTotalAngle > 2 * Math.PI) newTotalAngle = 2 * Math.PI;

        // Convert back to progress percent
        const newProgress = (newTotalAngle - (-2 * Math.PI)) / (4 * Math.PI);

        setAnimProgress(newProgress);
    };

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
                if (y > 15 || y < -15) return null;
                return y;
            }
            case 'Secante': {
                const cosVal = Math.cos(angle);
                if (Math.abs(cosVal) < 0.05) return null;
                const y = A * (1 / cosVal) + D;
                if (y > 15 || y < -15) return null;
                return y;
            }
            case 'Cossecante': {
                const sinVal = Math.sin(angle);
                if (Math.abs(sinVal) < 0.05) return null;
                const y = A * (1 / sinVal) + D;
                if (y > 15 || y < -15) return null;
                return y;
            }
            case 'Cotangente': {
                const tanVal = Math.tan(angle);
                if (Math.abs(tanVal) < 0.05) return null; // asymptotes
                const y = A * (1 / tanVal) + D;
                if (y > 15 || y < -15) return null;
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
            case 'Secante': return '#10b981'; // Emerald-500
            case 'Cossecante': return '#f59e0b'; // Amber-500
            case 'Cotangente': return '#d946ef'; // Fuchsia-500
        }
    };

    const getEquationString = () => {
        const { A, B, C, D } = params;

        let funcStr = '';
        switch (funcType) {
            case 'Seno': funcStr = 'sin'; break;
            case 'Cosseno': funcStr = 'cos'; break;
            case 'Tangente': funcStr = 'tan'; break;
            case 'Secante': funcStr = 'sec'; break;
            case 'Cossecante': funcStr = 'csc'; break;
            case 'Cotangente': funcStr = 'cot'; break;
        }

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
            case 'Secante':
                return "A Secante (inversa do cosseno) é vital para resolver equações diferenciais e modelar comprimentos que escapam do centro. Seu gráfico foge da faixa [-1, 1], criando \"vales\" em U infinitos.";
            case 'Cossecante':
                return "A Cossecante (inversa do seno) modela comportamentos que disparam para o infinito sempre que a onda principal cruza o zero na origem, formando vales abertos desfasados da secante.";
            case 'Cotangente':
                return "A Cotangente exibe transições e taxas inversas da tangente, descendo de forma suave antes de sumir no infinito de cada período inteiro de π.";
        }
    };

    const getMathMeaning = () => {
        switch (funcType) {
            case 'Seno':
                return "O Seno representa a projeção no eixo vertical (Y). É a razão entre o Cateto Oposto e a Hipotenusa do triângulo retângulo formado pelo ângulo.";
            case 'Cosseno':
                return "O Cosseno representa a projeção no eixo horizontal (X). É a razão entre o Cateto Adjacente e a Hipotenusa do triângulo retângulo.";
            case 'Tangente':
                return "A Tangente geométricamente é o segmento da reta perpendicular ao eixo X que toca o círculo e vai até o prolongamento do raio. É a razão Cateto Oposto / Cateto Adjacente (sen/cos).";
            case 'Secante':
                return "A Secante (1/cos) é a hipotenusa estendida que corta o círculo até atingir a reta vertical da tangente (no eixo X). Representa Hipotenusa / Cateto Adjacente.";
            case 'Cossecante':
                return "A Cossecante (1/sen) é a hipotenusa estendida que corta o círculo até atingir a reta horizontal da cotangente (no eixo Y). Representa Hipotenusa / Cateto Oposto.";
            case 'Cotangente':
                return "A Cotangente (1/tan) geométricamente é o segmento da reta perpendicular ao eixo Y que toca o topo do círculo e vai até o prolongamento do raio. É a razão Cateto Adjacente / Cateto Oposto (cos/sen).";
        }
    };

    // ── Videos: 2 verified YT videos per trig function ────────────────
    const getVideos = () => {
        const map: Record<FunctionType, { id: string; title: string; channel: string }[]> = {
            Seno: [
                { id: 'FwTbL4hewlY', title: 'FUNÇÃO SENO | RÁPIDO E FÁCIL', channel: 'Dicasdemat Sandro Curió' },
                { id: 'vUvWnRDcBrc', title: 'FUNÇÃO COSSENO | RÁPIDO E FÁCIL', channel: 'Dicasdemat Sandro Curió' },
            ],
            Cosseno: [
                { id: 'vUvWnRDcBrc', title: 'FUNÇÃO COSSENO | RÁPIDO E FÁCIL', channel: 'Dicasdemat Sandro Curió' },
                { id: 'FwTbL4hewlY', title: 'FUNÇÃO SENO | RÁPIDO E FÁCIL', channel: 'Dicasdemat Sandro Curió' },
            ],
            Tangente: [
                { id: 'aZwiSteCpck', title: 'FUNÇÃO TANGENTE (Domínio, Imagem, Período e Paridade)', channel: 'Equaciona Com Paulo Pereira' },
                { id: 'Q3GU5qWQUT0', title: 'COTANGENTE, SECANTE E COSSECANTE (c/ Exemplos)', channel: 'Equaciona Com Paulo Pereira' },
            ],
            Secante: [
                { id: 'Q3GU5qWQUT0', title: 'COTANGENTE, SECANTE E COSSECANTE (c/ Exemplos)', channel: 'Equaciona Com Paulo Pereira' },
                { id: 'aZwiSteCpck', title: 'FUNÇÃO TANGENTE — Domínio, Imagem, Período', channel: 'Equaciona Com Paulo Pereira' },
            ],
            Cossecante: [
                { id: 'Q3GU5qWQUT0', title: 'COTANGENTE, SECANTE E COSSECANTE (c/ Exemplos)', channel: 'Equaciona Com Paulo Pereira' },
                { id: 'a4r-6LbDl7A', title: 'TRIGONOMETRIA — FUNÇÃO COTANGENTE', channel: 'Pierre Goebel' },
            ],
            Cotangente: [
                { id: 'a4r-6LbDl7A', title: 'TRIGONOMETRIA — FUNÇÃO COTANGENTE', channel: 'Pierre Goebel' },
                { id: 'Q3GU5qWQUT0', title: 'COTANGENTE, SECANTE E COSSECANTE (c/ Exemplos)', channel: 'Equaciona Com Paulo Pereira' },
            ],
        };
        return map[funcType] ?? [];
    };

    return (
        <div className="flex h-screen bg-slate-900 text-slate-100 font-sans transition-colors duration-500 overflow-hidden">
            {/* Sidebar Navigation */}
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-4 md:p-8 overflow-y-auto no-scrollbar relative">

                {/* Mobile Header Fallback (Optional, but keeping simple for now)
                <header className="mb-6 md:hidden flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                        MathWave
                    </h1>
                </header > */}

                {currentView === 'simulator' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

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
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-700/50">
                                        {(['Seno', 'Cosseno', 'Tangente', 'Secante', 'Cossecante', 'Cotangente'] as FunctionType[]).map((type) => {
                                            let activeColors = '';
                                            if (funcType === type) {
                                                if (type === 'Seno') activeColors = 'bg-cyan-500/20 text-cyan-300';
                                                else if (type === 'Cosseno') activeColors = 'bg-violet-500/20 text-violet-300';
                                                else if (type === 'Tangente') activeColors = 'bg-rose-500/20 text-rose-300';
                                                else if (type === 'Secante') activeColors = 'bg-emerald-500/20 text-emerald-300';
                                                else if (type === 'Cossecante') activeColors = 'bg-amber-500/20 text-amber-300';
                                                else if (type === 'Cotangente') activeColors = 'bg-fuchsia-500/20 text-fuchsia-300';
                                            }

                                            return (
                                                <button
                                                    key={type}
                                                    onClick={() => setFuncType(type)}
                                                    className={`
                                                px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 text-center
                                                ${funcType === type ? activeColors : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}
                                                `}
                                                >
                                                    {type}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="h-[400px] w-full">
                                    {/* Flex container for Unit Circle and LineChart */}
                                    <div className="flex flex-col md:flex-row gap-6 w-full h-[350px]">

                                        {/* Animated Unit Circle */}
                                        <div className="w-[150px] md:w-[200px] h-full flex-shrink-0 flex items-center justify-center relative bg-slate-900/40 rounded-xl border border-slate-700/50 overflow-hidden group">

                                            {/* Interaction Overlay Banner */}
                                            <div className="absolute top-0 left-0 w-full p-2 bg-gradient-to-b from-slate-900/80 to-transparent z-10 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setIsManualMode(!isManualMode)}
                                                    className="text-[10px] font-medium text-slate-300 hover:text-white bg-slate-800/80 px-2 py-1 rounded shadow"
                                                >
                                                    {isManualMode ? '▶ Auto' : '⏸ Pausar'}
                                                </button>
                                            </div>

                                            <svg
                                                viewBox="-1.2 -1.2 2.4 2.4"
                                                className={`w-[80%] h-[80%] overflow-visible ${isManualMode ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
                                                onPointerDown={handlePointerDown}
                                                onPointerMove={handlePointerMove}
                                                onPointerUp={handlePointerUp}
                                                onPointerLeave={handlePointerUp}
                                            >
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
                                                    className="transition-none pointer-events-none"
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
                                                {(() => {
                                                    const cosVal = Math.cos(animatedDotConfig.x);
                                                    const sinVal = Math.sin(animatedDotConfig.x);
                                                    // Cap the geometric extensions so SVG viewBox doesn't explode at asymptotes
                                                    let safeSec = Math.abs(cosVal) < 0.01 ? 100 * Math.sign(cosVal) : 1 / cosVal;
                                                    let safeCsc = Math.abs(sinVal) < 0.01 ? 100 * Math.sign(sinVal) : 1 / sinVal;

                                                    if (safeSec > 3.5) safeSec = 3.5;
                                                    if (safeSec < -3.5) safeSec = -3.5;

                                                    if (safeCsc > 3.5) safeCsc = 3.5;
                                                    if (safeCsc < -3.5) safeCsc = -3.5;

                                                    return (
                                                        <>
                                                            {funcType === 'Seno' && (
                                                                <line
                                                                    x1={cosVal} y1={-sinVal} x2={cosVal} y2="0"
                                                                    stroke="#06b6d4" strokeWidth="0.03" strokeDasharray="0.05,0.05" className="opacity-70"
                                                                />
                                                            )}
                                                            {funcType === 'Cosseno' && (
                                                                <line
                                                                    x1={cosVal} y1={-sinVal} x2="0" y2={-sinVal}
                                                                    stroke="#8b5cf6" strokeWidth="0.03" strokeDasharray="0.05,0.05" className="opacity-70"
                                                                />
                                                            )}
                                                            {funcType === 'Tangente' && (
                                                                <line
                                                                    x1={cosVal} y1={-sinVal} x2={safeSec} y2="0"
                                                                    stroke="#f43f5e" strokeWidth="0.03" strokeDasharray="0.05,0.05" className="opacity-70"
                                                                />
                                                            )}
                                                            {funcType === 'Secante' && (
                                                                <>
                                                                    <line x1={cosVal} y1={-sinVal} x2={safeSec} y2="0" stroke="#f43f5e" strokeWidth="0.015" strokeDasharray="0.05,0.05" className="opacity-40" />
                                                                    <line x1="0" y1="0" x2={safeSec} y2="0" stroke="#10b981" strokeWidth="0.04" strokeDasharray="0.05,0.05" className="opacity-90" />
                                                                </>
                                                            )}
                                                            {funcType === 'Cotangente' && (
                                                                <line
                                                                    x1={cosVal} y1={-sinVal} x2="0" y2={-safeCsc}
                                                                    stroke="#d946ef" strokeWidth="0.03" strokeDasharray="0.05,0.05" className="opacity-70"
                                                                />
                                                            )}
                                                            {funcType === 'Cossecante' && (
                                                                <>
                                                                    <line x1={cosVal} y1={-sinVal} x2="0" y2={-safeCsc} stroke="#d946ef" strokeWidth="0.015" strokeDasharray="0.05,0.05" className="opacity-40" />
                                                                    <line x1="0" y1="0" x2="0" y2={-safeCsc} stroke="#f59e0b" strokeWidth="0.04" strokeDasharray="0.05,0.05" className="opacity-90" />
                                                                </>
                                                            )}
                                                        </>
                                                    );
                                                })()}
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

                            {/* Educational Math Panel with Static Geometric Triangle */}
                            <div className="glass-panel rounded-2xl p-6 relative flex flex-col md:flex-row items-center gap-6 overflow-hidden">
                                <div className="flex-1 space-y-3 z-10">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-200">
                                        <Triangle className={`w-5 h-5`} style={{ color: getThemeColor() }} />
                                        Significado Matemático
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed transition-all duration-300">
                                        {getMathMeaning()}
                                    </p>
                                </div>

                                <div className="w-[180px] h-[180px] bg-slate-900/60 rounded-xl border border-slate-700/50 p-2 flex-shrink-0 relative overflow-hidden">
                                    <svg viewBox="-1.2 -1.2 2.4 2.4" className="w-full h-full overflow-visible">
                                        {/* Axes */}
                                        <line x1="-1.2" y1="0" x2="1.2" y2="0" stroke="#475569" strokeWidth="0.02" />
                                        <line x1="0" y1="-1.2" x2="0" y2="1.2" stroke="#475569" strokeWidth="0.02" />

                                        {/* The Circle */}
                                        <circle cx="0" cy="0" r="1" fill="transparent" stroke="#334155" strokeWidth="0.03" />

                                        {/* Static Angle for the Triangle (approx 45 degrees / pi/4) */}
                                        {(() => {
                                            const angle = Math.PI / 4;
                                            const cosA = Math.cos(angle);
                                            const sinA = Math.sin(angle);
                                            const tanA = Math.tan(angle);
                                            const secA = 1 / cosA;
                                            const cscA = 1 / sinA;
                                            const tc = getThemeColor();

                                            return (
                                                <>
                                                    {/* Base Triangle (Always faint) */}
                                                    <polygon points={`0,0 ${cosA},0 ${cosA},${-sinA}`} fill={`${tc}20`} stroke="none" />

                                                    {/* Angle Arc */}
                                                    <path d={`M 0.3 0 A 0.3 0.3 0 0 0 ${0.3 * cosA} ${-0.3 * sinA}`} fill="none" stroke="#94a3b8" strokeWidth="0.02" />

                                                    {/* Hypotenuse (Radius) */}
                                                    <line x1="0" y1="0" x2={cosA} y2={-sinA} stroke="#94a3b8" strokeWidth="0.03" />

                                                    {/* Highlights based on function */}
                                                    {funcType === 'Seno' && (
                                                        <>
                                                            <line x1="0" y1="0" x2={cosA} y2="0" stroke="#64748b" strokeWidth="0.04" /> {/* Adj */}
                                                            <line x1={cosA} y1={-sinA} x2={cosA} y2="0" stroke="#64748b" strokeWidth="0.03" strokeDasharray="0.05,0.05" />
                                                            <line x1={cosA} y1={0} x2={cosA} y2={-sinA} stroke={tc} strokeWidth="0.08" strokeLinecap="round" /> {/* Opp (Sine) */}
                                                        </>
                                                    )}
                                                    {funcType === 'Cosseno' && (
                                                        <>
                                                            <line x1={cosA} y1="0" x2={cosA} y2={-sinA} stroke="#64748b" strokeWidth="0.04" /> {/* Opp */}
                                                            <line x1="0" y1="0" x2={cosA} y2="0" stroke={tc} strokeWidth="0.08" strokeLinecap="round" /> {/* Adj (Cosine) */}
                                                        </>
                                                    )}
                                                    {funcType === 'Tangente' && (
                                                        <>
                                                            <line x1="0" y1="0" x2={1} y2={-tanA} stroke="#64748b" strokeWidth="0.03" strokeDasharray="0.05,0.05" /> {/* Extended Hyp */}
                                                            <polygon points={`0,0 1,0 1,${-tanA}`} fill={`${tc}10`} stroke="none" />
                                                            <line x1="1" y1="0" x2="1" y2={-tanA} stroke={tc} strokeWidth="0.08" strokeLinecap="round" /> {/* Tangent Line */}
                                                            <line x1="0" y1="0" x2="1" y2="0" stroke="#64748b" strokeWidth="0.04" /> {/* Adj (r=1) */}
                                                        </>
                                                    )}
                                                    {funcType === 'Secante' && (
                                                        <>
                                                            <line x1="0" y1="0" x2={secA} y2="0" stroke={tc} strokeWidth="0.08" strokeLinecap="round" /> {/* Secant Line */}
                                                            <line x1="1" y1="0" x2="1" y2={-tanA} stroke="#64748b" strokeWidth="0.04" /> {/* Tangent Op */}
                                                            <line x1="0" y1="0" x2={secA} y2="0" stroke={`${tc}40`} strokeWidth="0.1" />
                                                            <line x1="0" y1="0" x2={1} y2={-tanA} stroke="#94a3b8" strokeWidth="0.03" /> {/* Extended Hyp */}
                                                        </>
                                                    )}
                                                    {funcType === 'Cotangente' && (
                                                        <>
                                                            <line x1="0" y1="0" x2={1 / tanA} y2="-1" stroke="#64748b" strokeWidth="0.03" strokeDasharray="0.05,0.05" /> {/* Extended Hyp */}
                                                            <polygon points={`0,0 0,-1 ${1 / tanA},-1`} fill={`${tc}10`} stroke="none" />
                                                            <line x1="0" y1="-1" x2={1 / tanA} y2="-1" stroke={tc} strokeWidth="0.08" strokeLinecap="round" /> {/* Cotangent Line */}
                                                            <line x1="0" y1="0" x2="0" y2="-1" stroke="#64748b" strokeWidth="0.04" /> {/* Opp (r=1) */}
                                                        </>
                                                    )}
                                                    {funcType === 'Cossecante' && (
                                                        <>
                                                            <line x1="0" y1="0" x2="0" y2={-cscA} stroke={tc} strokeWidth="0.08" strokeLinecap="round" /> {/* Cosecant Line */}
                                                            <line x1="0" y1="-1" x2={1 / tanA} y2="-1" stroke="#64748b" strokeWidth="0.04" /> {/* Cotangent Adj */}
                                                            <line x1="0" y1="0" x2="0" y2={-cscA} stroke={`${tc}40`} strokeWidth="0.1" />
                                                            <line x1="0" y1="0" x2={1 / tanA} y2="-1" stroke="#94a3b8" strokeWidth="0.03" /> {/* Extended Hyp */}
                                                        </>
                                                    )}

                                                    {/* Point at the circle edge (always drawn) */}
                                                    <circle cx={cosA} cy={-sinA} r="0.06" fill="#fff" stroke={tc} strokeWidth="0.03" />
                                                </>
                                            );
                                        })()}
                                    </svg>
                                    <div className="absolute bottom-2 right-2 text-[9px] text-slate-500 font-mono bg-slate-900/80 px-1 rounded">
                                        θ = π/4
                                    </div>
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

                            {/* YouTube Video Cards */}
                            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col gap-4">
                                <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" /></svg>
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
                                            <div className="relative w-full aspect-video bg-black overflow-hidden">
                                                <img
                                                    src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                                                    alt={v.title}
                                                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${v.id}/mqdefault.jpg`; }}
                                                />
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                                                    <div className="w-14 h-14 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                                    </div>
                                                </div>
                                                <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">YT</span>
                                            </div>
                                            <div className="p-3 flex flex-col gap-1">
                                                <p className="text-sm font-medium text-slate-200 line-clamp-2 group-hover/card:text-white leading-snug">{v.title}</p>
                                                <p className="text-xs text-slate-500">{v.channel}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-600 text-center">Clique em um vídeo para abrir no YouTube ↗</p>
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
                ) : null
                }

                {currentView === 'properties' && <TrigProperties />}
                {currentView === 'volumes' && <VolumeSimulator />}
                {currentView === 'trigcircle' && <TrigCircle />}
                {currentView === 'logdash' && <LogDashboard />}

            </main>
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
