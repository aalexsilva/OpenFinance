
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { Sparkles, TrendingUp, TrendingDown, Wallet, Loader2 } from 'lucide-react';
import { Sale, Expense, InventoryItem, CompanyProfile } from '../types';
import { COLORS } from '../constants';
import { generateFinancialInsights } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface DashboardProps {
    sales: Sale[];
    expenses: Expense[];
    inventory: InventoryItem[];
    company: CompanyProfile;
}

// --- Lazy Loader Component for Charts ---
// This component only renders the heavy chart when it enters the viewport
const LazyChartWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Stop observing once loaded
                }
            },
            { threshold: 0.1 } // Trigger when 10% visible
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full">
            {isVisible ? (
                children
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 rounded animate-pulse">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                    <span className="text-xs text-gray-500">Carregando gráfico...</span>
                </div>
            )}
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ sales, expenses, inventory, company }) => {
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [isLoadingAi, setIsLoadingAi] = useState(false);

    // Calculations wrapped in useMemo to prevent recalculation on every render
    const totalSales = useMemo(() => sales.reduce((acc, s) => acc + s.value, 0), [sales]);
    const totalExpenses = useMemo(() => expenses.reduce((acc, e) => acc + e.value, 0), [expenses]);
    const netProfit = totalSales - totalExpenses;

    // Data for Charts
    const flowData = useMemo(() => [
        { name: 'Entradas', valor: totalSales },
        { name: 'Saídas', valor: totalExpenses }
    ], [totalSales, totalExpenses]);

    const categoryData = useMemo(() => {
        const data: {[key: string]: number} = {};
        expenses.forEach(e => {
            data[e.category] = (data[e.category] || 0) + e.value;
        });
        return Object.keys(data).map(key => ({ name: key, value: data[key] }));
    }, [expenses]);

    const paymentData = useMemo(() => {
        const data: {[key: string]: number} = {};
        sales.forEach(s => {
            data[s.paymentMethod] = (data[s.paymentMethod] || 0) + s.value;
        });
        return Object.keys(data).map(key => ({ name: key, value: data[key] }));
    }, [sales]);

    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

    const handleGenerateInsights = async () => {
        setIsLoadingAi(true);
        const insight = await generateFinancialInsights(sales, expenses, inventory);
        setAiInsight(insight);
        setIsLoadingAi(false);
    };

    return (
        <div className="p-6 w-full max-w-7xl mx-auto space-y-6">
            
            {/* Company Header */}
            <div className="bg-cardDark p-8 rounded-lg border border-gray-700 flex flex-col items-center justify-center text-center mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
                
                <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400 shadow-lg border border-gray-600 overflow-hidden relative z-10">
                    {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-2xl font-bold text-white">{company.name.substring(0, 2).toUpperCase()}</span>
                    )}
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight relative z-10">{company.name}</h1>
                <p className="text-gray-400 mt-1 relative z-10">{company.type || 'Empresa de Alimentação'}</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-cardDark p-6 rounded-lg border-l-4 border-success shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm font-medium uppercase">Total de Vendas</p>
                        <h3 className="text-3xl font-bold text-white mt-1">R$ {totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    </div>
                    <div className="p-3 bg-green-900/20 rounded-full text-success">
                        <TrendingUp size={28} />
                    </div>
                </div>
                
                <div className="bg-cardDark p-6 rounded-lg border-l-4 border-danger shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm font-medium uppercase">Total de Gastos</p>
                        <h3 className="text-3xl font-bold text-white mt-1">R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    </div>
                    <div className="p-3 bg-red-900/20 rounded-full text-danger">
                        <TrendingDown size={28} />
                    </div>
                </div>

                <div className={`bg-cardDark p-6 rounded-lg border-l-4 shadow-lg flex items-center justify-between ${netProfit >= 0 ? 'border-primary' : 'border-orange-500'}`}>
                    <div>
                        <p className="text-gray-400 text-sm font-medium uppercase">Lucro Líquido</p>
                        <h3 className={`text-3xl font-bold mt-1 ${netProfit >= 0 ? 'text-primary' : 'text-orange-500'}`}>
                            R$ {netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className={`p-3 rounded-full ${netProfit >= 0 ? 'bg-blue-900/20 text-primary' : 'bg-orange-900/20 text-orange-500'}`}>
                        <Wallet size={28} />
                    </div>
                </div>
            </div>

            {/* Gemini AI Insights */}
            <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-6 rounded-lg border border-indigo-500/30">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="text-yellow-400" /> Insights Inteligentes (IA)
                    </h3>
                    <button 
                        onClick={handleGenerateInsights}
                        disabled={isLoadingAi}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                        {isLoadingAi ? 'Analisando...' : 'Gerar Análise'}
                    </button>
                </div>
                {aiInsight ? (
                    <div className="prose prose-invert max-w-none text-gray-200 text-sm">
                       <ReactMarkdown>{aiInsight}</ReactMarkdown>
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm italic">Clique em "Gerar Análise" para obter insights sobre seus dados financeiros usando inteligência artificial.</p>
                )}
            </div>

            {/* Charts Section - Optimized with Lazy Loading */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Sales vs Expenses */}
                <div className="bg-cardDark p-6 rounded-lg shadow-lg border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-6 border-b border-gray-700 pb-2">Entradas x Saídas</h3>
                    <div className="h-64 w-full">
                        <LazyChartWrapper>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={flowData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                                    <XAxis dataKey="name" stroke="#aaa" />
                                    <YAxis stroke="#aaa" />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#2C2C2C', borderColor: '#444', color: '#fff' }} 
                                        cursor={{ fill: '#ffffff10' }}
                                    />
                                    <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                                        {flowData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.success : COLORS.danger} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </LazyChartWrapper>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-cardDark p-6 rounded-lg shadow-lg border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-6 border-b border-gray-700 pb-2">Formas de Pagamento</h3>
                    <div className="h-64 w-full flex items-center justify-center">
                        <LazyChartWrapper>
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={paymentData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {paymentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#2C2C2C', borderColor: '#444', color: '#fff' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </LazyChartWrapper>
                    </div>
                </div>

                 {/* Expenses Category */}
                 <div className="bg-cardDark p-6 rounded-lg shadow-lg border border-gray-800 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-6 border-b border-gray-700 pb-2">Gastos por Categoria</h3>
                    <div className="h-64 w-full flex items-center justify-center">
                        <LazyChartWrapper>
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#2C2C2C', borderColor: '#444', color: '#fff' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </LazyChartWrapper>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
