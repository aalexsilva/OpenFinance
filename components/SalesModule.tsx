import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Sale, SalesCategory, PaymentMethod } from '../types';
import { SALES_CATEGORIES, PAYMENT_METHODS, COLORS } from '../constants';

interface SalesModuleProps {
    sales: Sale[];
    setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
}

const SalesModule: React.FC<SalesModuleProps> = ({ sales, setSales }) => {
    const [newSale, setNewSale] = useState<Partial<Sale>>({
        date: new Date().toISOString().split('T')[0],
        category: SalesCategory.LANCHE,
        paymentMethod: PaymentMethod.PIX,
        value: 0,
        attendant: ''
    });

    const handleAddSale = () => {
        if (!newSale.product || !newSale.value || !newSale.attendant) return;
        
        const sale: Sale = {
            id: Date.now().toString(),
            date: newSale.date!,
            product: newSale.product!,
            category: newSale.category as SalesCategory,
            paymentMethod: newSale.paymentMethod as PaymentMethod,
            value: Number(newSale.value),
            attendant: newSale.attendant!
        };

        setSales([...sales, sale]);
        setNewSale({
            ...newSale,
            product: '',
            value: 0,
            attendant: ''
        });
    };

    const handleDelete = (id: string) => {
        setSales(sales.filter(s => s.id !== id));
    };

    return (
        <div className="p-6 w-full max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <span className="text-green-500">●</span> Registro de Vendas
            </h2>

            {/* Input Form */}
            <div className="bg-cardDark p-6 rounded-lg shadow-lg mb-8 border border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-400 mb-1">Data</label>
                        <input 
                            type="date" 
                            value={newSale.date} 
                            onChange={e => setNewSale({...newSale, date: e.target.value})}
                            className="bg-bgDark border border-gray-700 rounded p-2 text-white focus:border-primary outline-none"
                        />
                    </div>
                    <div className="flex flex-col lg:col-span-2">
                        <label className="text-xs text-gray-400 mb-1">Produto</label>
                        <input 
                            type="text" 
                            placeholder="Ex: X-Salada"
                            value={newSale.product || ''} 
                            onChange={e => setNewSale({...newSale, product: e.target.value})}
                            className="bg-bgDark border border-gray-700 rounded p-2 text-white focus:border-primary outline-none"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-400 mb-1">Categoria</label>
                        <select 
                            value={newSale.category}
                            onChange={e => setNewSale({...newSale, category: e.target.value as SalesCategory})}
                            className="bg-bgDark border border-gray-700 rounded p-2 text-white focus:border-primary outline-none"
                        >
                            {SALES_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-400 mb-1">Pagamento</label>
                        <select 
                            value={newSale.paymentMethod}
                            onChange={e => setNewSale({...newSale, paymentMethod: e.target.value as PaymentMethod})}
                            className="bg-bgDark border border-gray-700 rounded p-2 text-white focus:border-primary outline-none"
                        >
                            {PAYMENT_METHODS.map(pm => <option key={pm} value={pm}>{pm}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-400 mb-1">Valor (R$)</label>
                        <input 
                            type="number" 
                            step="0.01"
                            value={newSale.value} 
                            onChange={e => setNewSale({...newSale, value: parseFloat(e.target.value)})}
                            className="bg-bgDark border border-gray-700 rounded p-2 text-white focus:border-primary outline-none"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-400 mb-1">Atendente</label>
                        <input 
                            type="text" 
                            placeholder="Nome"
                            value={newSale.attendant || ''} 
                            onChange={e => setNewSale({...newSale, attendant: e.target.value})}
                            className="bg-bgDark border border-gray-700 rounded p-2 text-white focus:border-primary outline-none"
                        />
                    </div>
                    <div className="lg:col-span-6 flex justify-end mt-4">
                         <button 
                            onClick={handleAddSale}
                            className="bg-success hover:bg-green-600 text-white font-bold py-2 px-6 rounded flex items-center gap-2 transition-colors"
                        >
                            <Plus size={18} /> Adicionar Venda
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-cardDark rounded-lg shadow-lg overflow-hidden border border-gray-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#222222] text-gray-400 text-sm uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Data</th>
                                <th className="p-4">Produto</th>
                                <th className="p-4">Categoria</th>
                                <th className="p-4">Pagamento</th>
                                <th className="p-4">Atendente</th>
                                <th className="p-4 text-right">Valor</th>
                                <th className="p-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-sm">
                            {sales.map(sale => (
                                <tr key={sale.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-gray-300">{new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                                    <td className="p-4 font-medium text-white">{sale.product}</td>
                                    <td className="p-4">
                                        <span className="bg-blue-900/50 text-blue-200 px-2 py-1 rounded text-xs border border-blue-800">
                                            {sale.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-300">{sale.paymentMethod}</td>
                                    <td className="p-4 text-gray-300">{sale.attendant}</td>
                                    <td className="p-4 text-right font-bold text-success">
                                        R$ {sale.value.toFixed(2)}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => handleDelete(sale.id)}
                                            className="text-gray-500 hover:text-danger transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {sales.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        Nenhuma venda registrada ainda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesModule;
