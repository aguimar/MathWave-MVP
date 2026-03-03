import { Activity, LayoutDashboard, Calculator, Library, Box, Layers, Binary, CircleDot, TrendingUp } from 'lucide-react';

export type ViewType = 'simulator' | 'properties' | 'volumes' | 'trigcircle' | 'logdash';

interface SidebarProps {
    currentView: ViewType;
    setCurrentView: (view: ViewType) => void;
}

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
    return (
        <aside className="w-64 fixed left-0 top-0 h-screen bg-slate-900/80 backdrop-blur-md border-r border-slate-700/50 flex flex-col transition-all duration-300 z-50">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3 border-b border-slate-700/50">
                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    <Activity className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                    MathWave
                </h1>
            </div>

            {/* Navigation Menus */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar">

                {/* Trig Group */}
                <div>
                    <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Activity className="w-3 h-3" />
                        Trigonometria
                    </h3>
                    <div className="space-y-1">
                        <button
                            onClick={() => setCurrentView('simulator')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${currentView === 'simulator'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transparent border border-transparent'
                                }`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Simulador de Ondas
                        </button>

                        <button
                            onClick={() => setCurrentView('properties')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${currentView === 'properties'
                                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transparent border border-transparent'
                                }`}
                        >
                            <Calculator className="w-4 h-4" />
                            Propriedades
                        </button>


                        <button
                            onClick={() => setCurrentView('trigcircle')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${currentView === 'trigcircle'
                                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transparent border border-transparent'
                                }`}
                        >
                            <CircleDot className="w-4 h-4" />
                            Círculo Trigonométrico
                        </button>
                    </div>
                </div>

                {/* Spatial Group */}
                <div>
                    <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Box className="w-3 h-3" />
                        Geometria Espacial
                    </h3>
                    <div className="space-y-1">
                        <button
                            onClick={() => setCurrentView('volumes')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${currentView === 'volumes'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transparent border border-transparent'
                                }`}
                        >
                            <Layers className="w-4 h-4" />
                            Volume dos Sólidos
                        </button>
                    </div>
                </div>

                {/* Algebra Group */}
                <div>
                    <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <TrendingUp className="w-3 h-3" />
                        Álgebra
                    </h3>
                    <div className="space-y-1">
                        <button
                            onClick={() => setCurrentView('logdash')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${currentView === 'logdash'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transparent border border-transparent'
                                }`}
                        >
                            <TrendingUp className="w-4 h-4" />
                            Logaritmos & Exponenciais
                        </button>
                    </div>
                </div>

            </div>

            {/* Bottom Config/Info Area */}
            <div className="p-4 border-t border-slate-700/50">
                <div className="flex items-center gap-3 px-2 py-2 text-slate-500 text-xs">
                    <Binary className="w-4 h-4" />
                    <span>v1.0.0 Experimental</span>
                </div>
            </div>
        </aside>
    );
}
