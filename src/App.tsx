import React, { useState, useEffect } from 'react';
import { ModuleType, User, ProductionBatch, InventoryItem, Client, Sale, TrapicheConfig, TransactionType } from './types';
import { storageService } from './services/storage';
import { HeaderTopBar } from './components/HeaderTopBar';
import { Navigation } from './components/Navigation';
import { LoginModule } from './components/LoginModule';
import { DashboardModule } from './components/DashboardModule';
import { ProductionModule } from './components/ProductionModule';
import { InventoryModule } from './components/InventoryModule';
import { ClientsModule } from './components/ClientsModule';
import { SalesModule } from './components/SalesModule';
import { ReportsModule } from './components/ReportsModule';
import { SettingsModule } from './components/SettingsModule';
import { AndroidCodeExportModal } from './components/AndroidCodeExportModal';
import { Smartphone, Signal, Wifi, Battery, WifiOff } from 'lucide-react';

export default function App() {
  // Authentication State
  const [user, setUser] = useState<User | null>(null);

  // Active Screen / Module State
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');

  // Mobile Frame Viewport Toggle State
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Data Collections State
  const [config, setConfig] = useState<TrapicheConfig>(storageService.getConfig());
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  // Load Initial Data on Mount
  useEffect(() => {
    const savedUser = storageService.getStoredUser();
    if (savedUser) {
      setUser(savedUser);
    }

    setBatches(storageService.getBatches());
    setInventory(storageService.getInventory());
    setClients(storageService.getClients());
    setSales(storageService.getSales());
  }, []);

  // Handlers for Login / Logout
  const handleLoginSuccess = (loggedInUser: User, remember: boolean) => {
    setUser(loggedInUser);
    storageService.saveUser(loggedInUser, remember);
    setActiveModule('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    storageService.clearUser();
    setActiveModule('dashboard');
  };

  // Batches (Producción) Handlers
  const handleSaveBatch = (batch: ProductionBatch) => {
    const existingIndex = batches.findIndex(b => b.id === batch.id);
    let updated: ProductionBatch[];
    if (existingIndex >= 0) {
      updated = [...batches];
      updated[existingIndex] = batch;
    } else {
      updated = [batch, ...batches];
    }
    setBatches(updated);
    storageService.saveBatches(updated);
  };

  const handleDeleteBatch = (batchId: string) => {
    const updated = batches.filter(b => b.id !== batchId);
    setBatches(updated);
    storageService.saveBatches(updated);
  };

  // Inventory Handlers
  const handleSaveInventoryItem = (item: InventoryItem) => {
    const existingIndex = inventory.findIndex(i => i.id === item.id);
    let updated: InventoryItem[];
    if (existingIndex >= 0) {
      updated = [...inventory];
      updated[existingIndex] = item;
    } else {
      updated = [item, ...inventory];
    }
    setInventory(updated);
    storageService.saveInventory(updated);
  };

  const handleDeleteInventoryItem = (itemId: string) => {
    const updated = inventory.filter(i => i.id !== itemId);
    setInventory(updated);
    storageService.saveInventory(updated);
  };

  const handleRegisterInventoryTransaction = (
    itemId: string, 
    type: TransactionType, 
    amount: number, 
    reason: string
  ) => {
    const updated = inventory.map(item => {
      if (item.id === itemId) {
        const newQty = type === 'Entrada' 
          ? item.quantity + amount 
          : Math.max(0, item.quantity - amount);
        return {
          ...item,
          quantity: newQty,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    });
    setInventory(updated);
    storageService.saveInventory(updated);
  };

  // Clients Handlers
  const handleSaveClient = (client: Client) => {
    const existingIndex = clients.findIndex(c => c.id === client.id);
    let updated: Client[];
    if (existingIndex >= 0) {
      updated = [...clients];
      updated[existingIndex] = client;
    } else {
      updated = [client, ...clients];
    }
    setClients(updated);
    storageService.saveClients(updated);
  };

  const handleDeleteClient = (clientId: string) => {
    const updated = clients.filter(c => c.id !== clientId);
    setClients(updated);
    storageService.saveClients(updated);
  };

  // Sales Handlers (with Automatic Inventory Stock Deduction!)
  const handleRegisterSale = (newSale: Sale, updatedInventoryList: InventoryItem[]) => {
    const updatedSales = [newSale, ...sales];
    setSales(updatedSales);
    storageService.saveSales(updatedSales);

    setInventory(updatedInventoryList);
    storageService.saveInventory(updatedInventoryList);
  };

  // Config Handlers
  const handleSaveConfig = (newConfig: TrapicheConfig) => {
    setConfig(newConfig);
    storageService.saveConfig(newConfig);
  };

  const handleSaveUser = (updatedUser: User) => {
    setUser(updatedUser);
    storageService.saveUser(updatedUser, true);
  };

  // Count low stock items for badges
  const lowStockCount = inventory.filter(i => i.quantity <= i.minStock).length;

  // Render Active Screen Component
  const renderCurrentModule = () => {
    if (!user) {
      return <LoginModule onLoginSuccess={handleLoginSuccess} />;
    }

    switch (activeModule) {
      case 'dashboard':
        return (
          <DashboardModule
            onSelectModule={setActiveModule}
            onLogout={handleLogout}
            batches={batches}
            inventory={inventory}
            sales={sales}
            clients={clients}
            config={config}
          />
        );
      case 'production':
        return (
          <ProductionModule
            batches={batches}
            onSaveBatch={handleSaveBatch}
            onDeleteBatch={handleDeleteBatch}
          />
        );
      case 'inventory':
        return (
          <InventoryModule
            inventory={inventory}
            onSaveItem={handleSaveInventoryItem}
            onDeleteItem={handleDeleteInventoryItem}
            onRegisterTransaction={handleRegisterInventoryTransaction}
          />
        );
      case 'clients':
        return (
          <ClientsModule
            clients={clients}
            onSaveClient={handleSaveClient}
            onDeleteClient={handleDeleteClient}
          />
        );
      case 'sales':
        return (
          <SalesModule
            sales={sales}
            clients={clients}
            inventory={inventory}
            onRegisterSale={handleRegisterSale}
          />
        );
      case 'reports':
        return (
          <ReportsModule
            batches={batches}
            inventory={inventory}
            sales={sales}
            clients={clients}
            config={config}
          />
        );
      case 'settings':
        return (
          <SettingsModule
            user={user}
            config={config}
            onSaveConfig={handleSaveConfig}
            onSaveUser={handleSaveUser}
            onLogout={handleLogout}
          />
        );
      case 'code_export':
        return <AndroidCodeExportModal />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col antialiased selection:bg-[#A7B0D6]/30 selection:text-black">
      
      {/* Top Application Bar */}
      <HeaderTopBar
        user={user}
        config={config}
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        onLogout={handleLogout}
        isMobileFrame={isMobileFrame}
        onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
        lowStockCount={lowStockCount}
      />

      {/* Main View Wrapper */}
      {isMobileFrame ? (
        /* Android Smartphone Viewport Simulation Frame */
        <div className="flex-1 py-6 px-2 flex items-center justify-center bg-[#A7B0D6]/20 overflow-y-auto">
          <div className="w-full max-w-[420px] h-[840px] bg-white rounded-[44px] shadow-2xl border-[8px] border-[#8893C2] flex flex-col relative overflow-hidden ring-1 ring-black/5">
            
            {/* Smartphone Top Notch / Camera & Android Status Bar */}
            <div className="bg-[#8893C2] text-white text-[11px] px-6 py-2 flex items-center justify-between select-none z-30 shrink-0 font-mono">
              <span>09:41</span>
              
              {/* Camera Hole Punch */}
              <div className="w-16 h-3 bg-[#6974A5] rounded-full" />

              <div className="flex items-center space-x-1.5">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Smartphone Scrollable Screen Area */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-4 bg-white">
              {renderCurrentModule()}
            </div>

            {/* Smartphone Bottom Android Navigation Pill Bar */}
            {user && (
              <div className="shrink-0 bg-white border-t border-[#A7B0D6]/30">
                <Navigation
                  activeModule={activeModule}
                  onSelectModule={setActiveModule}
                  lowStockCount={lowStockCount}
                  isMobileLayout={true}
                />
                {/* Android Home Gesture Indicator Bar */}
                <div className="py-1 flex justify-center bg-white">
                  <div className="w-28 h-1 bg-[#8893C2]/60 rounded-full" />
                </div>
              </div>
            )}

          </div>
        </div>
      ) : (
        /* Standard Full-Screen Responsive Layout */
        <div className="flex-1 flex max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-6 py-6 bg-white">
          
          {user && (
            <Navigation
              activeModule={activeModule}
              onSelectModule={setActiveModule}
              lowStockCount={lowStockCount}
              isMobileLayout={false}
            />
          )}

          <main className="flex-1 min-w-0 md:pl-6 bg-white">
            {renderCurrentModule()}
          </main>

        </div>
      )}

      {/* Footer Branding */}
      <footer className="bg-white border-t border-[#A7B0D6]/30 text-black text-xs py-3 text-center font-mono">
        <p className="font-bold">PanelaPró &bull; <span className="text-[#8893C2]">Sistema de Gestión Integral para la Industria Panelera</span> &bull; Material Design 3</p>
      </footer>

    </div>
  );
}
