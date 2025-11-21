import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Expense, ExpenseCategory, ExpenseType } from '../types';
import { EXPENSE_CATEGORIES, EXPENSE_TYPES, COLORS } from '../constants';

interface ExpensesModuleProps {
    expenses: Expense[];
    setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

const ExpensesModule: React.FC<ExpensesModuleProps> = ({ expenses, setExpenses }) => {
    const [newExpense, setNewExpense] = useState<Partial<Expense>>({
        date: new Date().toISOString().split('T')[0],
        category: ExpenseCategory.MERCADORIA,
        type: ExpenseType.VARIAVEL,
        value: 0,
        description: ''
    });

    const handleAddExpense = () => {
        if (!newExpense.description || !newExpense.value) return;
        
        const expense: Expense = {
            id: Date.now().toString(),
            date: newExpense.date!,
            description: newExpense.description!,
            category: newExpense.category as ExpenseCategory,
            type: newExpense.type as ExpenseType,
            value: Number(newExpense.value)
        };

        setExpenses([...expenses, expense]);
        setNewExpense({
            ...newExpense,
            description: '',
            value: 0
        });
    };

    const handleDelete = (id: string) => {
        setExpenses(expenses.filter(e => e.id !== id));
    };

    return (
        <div className="p-6 w-full max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <span className="text-red-500">●</span> Controle de Gastos
            </h2>

            {/* Input Form */}
            <div className="bg-cardDark p-6 rounded-lg shadow-lg mb-8 border border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-400 mb-1">Data</label>
                        <input 
                            type="date" 
                            value={newExpense.date} 
                            onChange={e => setNewExpense({...newExpense, date: e.target.value})}
                            className="bg-bgDark border border-gray-700 rounded p-2 text-white focus:border-primary outline-none"
                        />
                    </div>
                    <div className="flex flex-col lg:col-span-2">
                        <label className="text-xs text-gray-400 mb-1">Descrição</label>
                        <input 
                            type="text" 
                            placeholder="Ex: Conta de Luz"
                            value={newExpense.description || ''} 
                            onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                            className="bg-bgDark border border-gray-700 rounded p-2 text-white focus:border-primary outline-none"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-400 mb-1">Categoria</label>
                        <select 
                            value={newExpense.category}
                            onChange={e => setNewExpense({...newExpense, category: e.target.value as ExpenseCategory})}
                            className="bg-bgDark border border-gray-700 rounded p-2 text-white focus:border-primary outline-none"
                        >
                            {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                     <div className="flex flex-col">
                        <label className="text-xs text-gray-400 mb-1">Tipo</label>
                        <select 
                            value={newExpense.type}
                            onChange={e => setNewExpense({...newExpense, type: e.target.value as ExpenseType})}
                            className="bg-bgDark border border-gray-700 rounded p-2 text-white focus:border-primary outline-none"
                        >
                            {EXPENSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-400 mb-1">Valor (R$)</label>
                        <input 
                            type="number" 
                            step="0.01"
                            value={newExpense.value} 
                            onChange={e => setNewExpense({...newExpense, value: parseFloat(e.target.value)})}
                            className="bg-bgDark border border-gray-700 rounded p-2 text-white focus:border-primary outline-none"
                        />
                    </div>
                    
                    <div className="lg:col-span-6 flex justify-end mt-4">
                         <button 
                            onClick={handleAddExpense}
                            className="bg-danger hover:bg-red-700 text-white font-bold py-2 px-6 rounded flex items-center gap-2 transition-colors"
                        >
                            <Plus size={18} /> Registrar Gasto
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
                                <th className="p-4">Descrição</th>
                                <th className="p-4">Categoria</th>
                                <th className="p-4">Tipo</th>
                                <th className="p-4 text-right">Valor</th>
                                <th className="p-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-sm">
                            {expenses.map(expense => (
                                <tr key={expense.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-gray-300">{new Date(expense.date).toLocaleDateString('pt-BR')}</td>
                                    <td className="p-4 font-medium text-white">{expense.description}</td>
                                    <td className="p-4">
                                        <span className="bg-red-900/30 text-red-200 px-2 py-1 rounded text-xs border border-red-900">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-300">{expense.type}</td>
                                    <td className="p-4 text-right font-bold text-danger">
                                        - R$ {expense.value.toFixed(2)}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => handleDelete(expense.id)}
                                            className="text-gray-500 hover:text-danger transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {expenses.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        Nenhum gasto registrado ainda.
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

export default ExpensesModule;
