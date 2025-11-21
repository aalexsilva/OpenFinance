import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { InventoryItem } from '../types';

interface InventoryModuleProps {
    inventory: InventoryItem[];
    setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

const InventoryModule: React.FC<InventoryModuleProps> = ({ inventory, setInventory }) => {
    const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
        quantity: 0,
        unitCost: 0,
        product: '',
        supplier: ''
    });

    const handleAddItem = () => {
        if (!newItem.product || !newItem.quantity || !newItem.unitCost) return;
        
        const item: InventoryItem = {
            id: Date.now().toString(),
            product: newItem.product!,
            quantity: Number(newItem.quantity),
            unitCost: Number(newItem.unitCost),
            supplier: newItem.supplier || 'N/A'
        };

        setInventory([...inventory, item]);
        setNewItem({
            product: '',
            quantity: 0,
            unitCost: 0,
            supplier: ''
        });
    };

    const handleDelete = (id: string) => {
        setInventory(inventory.filter(i => i.id !== id));
    };

    return (
        <div className="p-6 w-full max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <span className="text-blue-500">●</span> Estoque
            </h2>

            {/* Input Form */}
            <div className="bg-cardDark p-6 rounded-lg shadow-lg mb-8 border border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div className="flex flex-col lg:col-span-1">
                        <label className="text-xs text-gray-400 mb-1">Produto</label>
                        <input 
                            type="text" 
                            placeholder="Ex: Farinha de Trigo"
                            value={newItem.product || ''} 
                            onChange={e => setNewItem({...newItem, product: e.target.value})}
                            className="bg-bgDark border border-gray-700 rounded p-2 text-white focus:border-primary outline-none"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-400 mb-1">Quantidade</label>
                        <input 
                            type="number" 
                            value={newItem.quantity} 
                            onChange={e => setNewItem({...newItem, quantity: parseFloat(e.target.value)})}
                            className="bg-bgDark border border-gray-700 rounded p-2 text-white focus:border-primary outline-none"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-400 mb-1">Custo Unit. (R$)</label>
                        <input 
                            type="number" 
                            step="0.01"
                            value={newItem.unitCost} 
                            onChange={e => setNewItem({...newItem, unitCost: parseFloat(e.target.value)})}
                            className="bg-bgDark border border-gray-700 rounded p-2 text-white focus:border-primary outline-none"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-400 mb-1">Fornecedor</label>
                        <input 
                            type="text" 
                            placeholder="Nome do Fornecedor"
                            value={newItem.supplier || ''} 
                            onChange={e => setNewItem({...newItem, supplier: e.target.value})}
                            className="bg-bgDark border border-gray-700 rounded p-2 text-white focus:border-primary outline-none"
                        />
                    </div>
                    
                    <div className="flex justify-end">
                         <button 
                            onClick={handleAddItem}
                            className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-6 rounded flex items-center gap-2 transition-colors w-full justify-center"
                        >
                            <Plus size={18} /> Adicionar
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
                                <th className="p-4">Produto</th>
                                <th className="p-4 text-right">Quantidade</th>
                                <th className="p-4 text-right">Custo Unit.</th>
                                <th className="p-4 text-right">Valor Total</th>
                                <th className="p-4">Fornecedor</th>
                                <th className="p-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-sm">
                            {inventory.map(item => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-white">{item.product}</td>
                                    <td className="p-4 text-right text-gray-300">{item.quantity}</td>
                                    <td className="p-4 text-right text-gray-300">R$ {item.unitCost.toFixed(2)}</td>
                                    <td className="p-4 text-right font-bold text-primary">
                                        R$ {(item.quantity * item.unitCost).toFixed(2)}
                                    </td>
                                    <td className="p-4 text-gray-300">{item.supplier}</td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="text-gray-500 hover:text-danger transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {inventory.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        Estoque vazio.
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

export default InventoryModule;
