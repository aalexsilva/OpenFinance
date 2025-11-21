import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingCart, DollarSign, Package, Menu, LogOut } from 'lucide-react';
import Dashboard from './components/Dashboard';
import SalesModule from './components/SalesModule';
import ExpensesModule from './components/ExpensesModule';
import InventoryModule from './components/InventoryModule';
import Auth from './components/Auth';
import { Sale, Expense, InventoryItem, Tab, CompanyProfile } from './types';
import { MOCK_SALES, MOCK_EXPENSES, MOCK_INVENTORY } from './constants';

const App: React.FC = () => {
  // User Session
  const [currentUser, setCurrentUser] = useState<CompanyProfile | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Critical for preventing overwrite

  const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Data State
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // 1. Check for logged in user on boot
  useEffect(() => {
    const savedUser = localStorage.getItem('gastro_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsAuthChecking(false);
  }, []);

  // 2. Load Data SPECIFIC to the logged-in user
  useEffect(() => {
    if (currentUser) {
      // Prevent saving while loading to avoid race conditions
      setIsDataLoaded(false); 

      // Construct unique key based on User ID
      const dataKey = `gastro_data_${currentUser.id}`;
      const storedData = localStorage.getItem(dataKey);
      
      console.log(`[App] Loading data for company: ${currentUser.name} (ID: ${currentUser.id})`);

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setSales(parsedData.sales || []);
        setExpenses(parsedData.expenses || []);
        setInventory(parsedData.inventory || []);
      } else {
        // If it's the demo user (legacy support/testing)
        if (currentUser.email === 'demo@demo.com') {
            setSales(MOCK_SALES as any);
            setExpenses(MOCK_EXPENSES as any);
            setInventory(MOCK_INVENTORY);
        } else {
            // Fresh user or no data found: initialize empty
            setSales([]);
            setExpenses([]);
            setInventory([]);
        }
      }
      // Enable auto-saving only after data is fully loaded into state
      setIsDataLoaded(true);
    } else {
        setIsDataLoaded(false);
    }
  }, [currentUser]);

  // 3. Auto-save Data when it changes - Only if data has been loaded
  useEffect(() => {
    if (currentUser && isDataLoaded) {
      const dataKey = `gastro_data_${currentUser.id}`;
      const dataToSave = {
        sales,
        expenses,
        inventory
      };
      
      localStorage.setItem(dataKey, JSON.stringify(dataToSave));
      // console.log(`[App] Auto-saved data for ${currentUser.name}`);
    }
  }, [sales, expenses, inventory, currentUser, isDataLoaded]);

  const handleLogin = (user: CompanyProfile) => {
    localStorage.setItem('gastro_current_user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('gastro_current_user');
    
    // Critical: Disable save and clear user before clearing state to prevent empty save
    setIsDataLoaded(false); 
    setCurrentUser(null);
    
    // Reset local state
    setSales([]);
    setExpenses([]);
    setInventory([]);
    setActiveTab('DASHBOARD');
  };

  // --- RENDER LOGIC ---

  if (isAuthChecking) {
    return <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'DASHBOARD':
        return <Dashboard sales={sales} expenses={expenses} inventory={inventory} company={currentUser} />;
      case 'SALES':
        return <SalesModule sales={sales} setSales={setSales} />;
      case 'EXPENSES':
        return <ExpensesModule expenses={expenses} setExpenses={setExpenses} />;
      case 'INVENTORY':
        return <InventoryModule inventory={inventory} setInventory={setInventory} />;
      default:
        return <Dashboard sales={sales} expenses={expenses} inventory={inventory} company={currentUser} />;
    }
  };

  const NavButton = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 w-full px-6 py-4 transition-all duration-200 border-l-4 ${
        activeTab === tab 
          ? 'bg-[#2C2C2C] border-[#2962FF] text-white' 
          : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-bgDark text-white flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-cardDark p-4 flex justify-between items-center border-b border-gray-800">
         <h1 className="font-bold text-xl text-primary">Open Finance</h1>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
            <Menu />
         </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:static top-14 left-0 bottom-0 z-20 w-64 bg-[#1a1a1a] border-r border-gray-800 flex flex-col 
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:h-screen shadow-xl
      `}>
        <div className="p-8 border-b border-gray-800 hidden md:block">
           <h1 className="text-2xl font-bold text-white tracking-wider">
             Open <span className="text-primary">Finance</span>
           </h1>
           <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-600">
                {currentUser.logoUrl ? (
                    <img src={currentUser.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-xs font-bold">{currentUser.name.substring(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                    <p className="text-xs text-gray-400">Online</p>
                  </div>
              </div>
           </div>
        </div>

        <nav className="flex-1 py-6">
          <NavButton tab="DASHBOARD" icon={LayoutDashboard} label="Resumo Financeiro" />
          <NavButton tab="SALES" icon={ShoppingCart} label="Vendas" />
          <NavButton tab="EXPENSES" icon={DollarSign} label="Gastos" />
          <NavButton tab="INVENTORY" icon={Package} label="Estoque" />
        </nav>

        <div className="p-4 border-t border-gray-800">
           <button 
             onClick={handleLogout}
             className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-danger hover:bg-white/5 rounded transition-all"
           >
              <LogOut size={18} />
              <span className="font-medium">Sair do Sistema</span>
           </button>
           <div className="mt-4 text-xs text-gray-600 text-center">
             v2.0.1 Open Finance
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen bg-[#1E1E1E] relative">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#2962ff10] to-transparent opacity-40"></div>
        {renderContent()}
      </main>

    </div>
  );
};

export default App;