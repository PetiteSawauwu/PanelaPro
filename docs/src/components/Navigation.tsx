import React from 'react';
import { 
  LayoutDashboard, 
  Factory, 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Code2,
  AlertCircle
} from 'lucide-react';
import { ModuleType } from '../types';

interface NavigationProps {
  activeModule: ModuleType;
  onSelectModule: (module: ModuleType) => void;
  lowStockCount: number;
  isMobileLayout?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeModule,
  onSelectModule,
  lowStockCount,
  isMobileLayout = false
}) => {
  const navItems = [
    { id: 'dashboard' as ModuleType, label: 'Inicio', icon: LayoutDashboard },
    { id: 'production' as ModuleType, label: 'Producción', icon: Factory },
    { id: 'inventory' as ModuleType, label: 'Inventario', icon: Package, badge: lowStockCount },
    { id: 'clients' as ModuleType, label: 'Clientes', icon: Users },
    { id: 'sales' as ModuleType, label: 'Ventas', icon: ShoppingCart },
    { id: 'reports' as ModuleType, label: 'Reportes', icon: BarChart3 },
    { id: 'settings' as ModuleType, label: 'Ajustes', icon: Settings },
    { id: 'code_export' as ModuleType, label: 'Código', icon: Code2 }
  ];

  if (isMobileLayout) {
    // Bottom Navigation Bar MD3 Style for Mobile Smartphone Frame
    return (
      <nav className="bg-white border-t border-[#A7B0D6]/30 px-1 py-1.5 flex items-center justify-around shadow-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`relative flex flex-col items-center py-1.5 px-2.5 rounded-[30px] transition ${
                isActive 
                  ? 'bg-[#8893C2] text-white font-bold' 
                  : 'text-black hover:bg-[#A7B0D6]/20'
              }`}
            >
              <div className="p-0.5">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#8893C2]'}`} />
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight font-bold ${isActive ? 'text-white' : 'text-black'}`}>
                {item.label}
              </span>

              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF0000] text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
    );
  }

  // Desktop Sidebar MD3 Navigation Rail / Navigation Drawer
  return (
    <aside className="w-64 bg-white text-black border-r border-[#A7B0D6]/30 p-4 flex flex-col justify-between hidden md:flex shrink-0">
      <div className="space-y-2">
        <div className="px-3 py-2 text-xs font-bold text-black uppercase tracking-wider font-mono">
          Navegación Principal
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-[30px] text-sm font-bold transition ${
                isActive
                  ? 'bg-[#8893C2] text-white shadow-md'
                  : 'text-black hover:bg-[#A7B0D6]/20'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#8893C2]'}`} />
                <span className={isActive ? 'text-white' : 'text-black'}>{item.label}</span>
              </div>

              {item.badge && item.badge > 0 ? (
                <span className="bg-[#FF0000] text-white text-xs font-extrabold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Info Card Footer */}
      <div className="bg-[#A7B0D6]/15 p-4 rounded-[20px] border border-[#A7B0D6]/30 text-xs text-black space-y-1.5">
        <div className="flex items-center space-x-2 font-bold text-black">
          <AlertCircle className="w-4 h-4 text-[#8893C2]" />
          <span>PanelaPró Mobile App</span>
        </div>
        <p className="text-[11px] leading-relaxed text-black/70">
          Módulo con soporte para exportación completa a Android Studio (Kotlin, Room DB, Jetpack Compose).
        </p>
      </div>
    </aside>
  );
};
