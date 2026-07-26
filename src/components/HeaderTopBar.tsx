import React from 'react';
import { 
  Sprout, 
  Smartphone, 
  Monitor, 
  Code2, 
  LogOut, 
  AlertTriangle,
  Building2
} from 'lucide-react';
import { User, ModuleType, TrapicheConfig } from '../types';

interface HeaderTopBarProps {
  user: User | null;
  config: TrapicheConfig;
  activeModule: ModuleType;
  onSelectModule: (module: ModuleType) => void;
  onLogout: () => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  lowStockCount: number;
}

export const HeaderTopBar: React.FC<HeaderTopBarProps> = ({
  user,
  config,
  activeModule,
  onSelectModule,
  onLogout,
  isMobileFrame,
  onToggleFrame,
  lowStockCount
}) => {
  const getModuleTitle = (mod: ModuleType) => {
    switch (mod) {
      case 'dashboard': return 'Panel Principal';
      case 'production': return 'Control de Producción (Lotes)';
      case 'inventory': return 'Gestión de Inventario y Stock';
      case 'clients': return 'Directorio de Clientes';
      case 'sales': return 'Registro y Control de Ventas';
      case 'reports': return 'Reportes y Estadísticas';
      case 'settings': return 'Configuración de Trapiche';
      case 'code_export': return 'Código Fuentes Kotlin / Android Studio';
      default: return 'PanelaPró';
    }
  };

  return (
    <header className="bg-white text-black shadow-xs border-b border-[#A7B0D6]/40 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand & Active Screen Title */}
        <div className="flex items-center space-x-3">
          <div 
            onClick={() => onSelectModule('dashboard')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-[30px] bg-[#8893C2] p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-[#A7B0D6] rounded-[30px] flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-black font-mono">
                  Panela<span className="text-[#8893C2]">Pró</span>
                </span>
                <span className="text-[10px] bg-[#A7B0D6]/30 text-black px-2 py-0.5 rounded-[30px] font-mono font-bold uppercase tracking-wider">
                  v1.0 MD3
                </span>
              </div>
              <p className="text-xs text-black/70 font-medium flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#8893C2]" />
                <span>{config.trapicheName}</span>
              </p>
            </div>
          </div>

          <div className="hidden md:block h-8 w-px bg-[#A7B0D6]/40 mx-2" />

          <div className="hidden md:block">
            <h1 className="text-sm font-bold text-black font-mono">
              {getModuleTitle(activeModule)}
            </h1>
          </div>
        </div>

        {/* Action Controls & User Info */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Low Stock Alert Badge */}
          {lowStockCount > 0 && (
            <button
              onClick={() => onSelectModule('inventory')}
              className="flex items-center space-x-1.5 bg-[#FF0000]/10 hover:bg-[#FF0000]/20 text-[#FF0000] border border-[#FF0000]/30 px-3 py-1.5 rounded-[30px] text-xs font-bold transition"
              title={`${lowStockCount} productos con stock bajo`}
            >
              <AlertTriangle className="w-4 h-4 text-[#FF0000] animate-pulse" />
              <span className="hidden sm:inline">Stock Bajo:</span>
              <span className="bg-[#FF0000] text-white px-2 py-0.2 rounded-full font-bold text-[11px]">
                {lowStockCount}
              </span>
            </button>
          )}

          {/* Device Frame View Toggle */}
          <button
            onClick={onToggleFrame}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-[30px] text-xs font-bold transition border ${
              isMobileFrame 
                ? 'bg-[#8893C2] text-white border-[#8893C2]' 
                : 'bg-[#A7B0D6]/20 hover:bg-[#A7B0D6]/40 text-black border-[#A7B0D6]/40'
            }`}
            title="Cambiar vista de marco de Smartphone Android / Pantalla Completa"
          >
            {isMobileFrame ? (
              <>
                <Smartphone className="w-4 h-4 text-white" />
                <span className="hidden sm:inline text-white">Vista Móvil Android</span>
              </>
            ) : (
              <>
                <Monitor className="w-4 h-4 text-[#8893C2]" />
                <span className="hidden sm:inline">Vista Escritorio</span>
              </>
            )}
          </button>

          {/* Android Studio Export Button */}
          <button
            onClick={() => onSelectModule('code_export')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-[30px] text-xs font-bold transition ${
              activeModule === 'code_export'
                ? 'bg-[#8893C2] text-white border border-[#8893C2]'
                : 'bg-[#8893C2] hover:bg-[#7782B1] text-white shadow-sm'
            }`}
          >
            <Code2 className="w-4 h-4 text-white" />
            <span className="hidden sm:inline text-white">Código Android (Kotlin)</span>
          </button>

          {/* User Profile */}
          {user && (
            <div className="flex items-center space-x-2 pl-2 border-l border-[#A7B0D6]/40">
              <div 
                onClick={() => onSelectModule('settings')}
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition"
              >
                <div className="w-8 h-8 rounded-full bg-[#8893C2] text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {user.fullName.charAt(0)}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-black leading-tight">{user.fullName}</p>
                  <p className="text-[10px] text-black/60 leading-tight">{user.role}</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-1.5 text-black/70 hover:text-[#FF0000] hover:bg-[#FF0000]/10 rounded-[30px] transition"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
