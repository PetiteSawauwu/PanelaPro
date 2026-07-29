import React from 'react';
import { 
  Factory, 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  LogOut,
  TrendingUp,
  AlertTriangle,
  Flame,
  ArrowRight,
  Sprout,
  Code2
} from 'lucide-react';
import { ModuleType, ProductionBatch, InventoryItem, Sale, Client, TrapicheConfig } from '../types';
import { storageService } from '../services/storage';

interface DashboardModuleProps {
  onSelectModule: (module: ModuleType) => void;
  onLogout: () => void;
  batches: ProductionBatch[];
  inventory: InventoryItem[];
  sales: Sale[];
  clients: Client[];
  config: TrapicheConfig;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  onSelectModule,
  onLogout,
  batches,
  inventory,
  sales,
  clients,
  config
}) => {
  // Calculated KPI statistics
  const totalPanelaKg = batches.reduce((acc, b) => acc + b.panelaProducedKg, 0);
  const avgYield = batches.length > 0
    ? (batches.reduce((acc, b) => acc + b.rendimientoPercentage, 0) / batches.length).toFixed(1)
    : '11.2';
  
  const totalSalesCOP = sales.reduce((acc, s) => acc + s.total, 0);
  const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);

  const menuCards = [
    {
      id: 'production' as ModuleType,
      title: 'Producción (Lotes)',
      desc: 'Molienda, clarificación, punteo y empaque de lotes de panela.',
      icon: Factory,
      badge: `${batches.length} Lotes`,
      stat: `${totalPanelaKg.toLocaleString()} kg Producidos`,
      subText: `Rendimiento prom: ${avgYield}%`
    },
    {
      id: 'inventory' as ModuleType,
      title: 'Inventario',
      desc: 'Materia prima, empaques, insumos y producto terminado.',
      icon: Package,
      badge: lowStockItems.length > 0 ? `${lowStockItems.length} Alertas` : 'Stock Normal',
      badgeAlert: lowStockItems.length > 0,
      stat: `${inventory.length} Ítems registrados`,
      subText: `${lowStockItems.length} con stock bajo el mínimo`
    },
    {
      id: 'sales' as ModuleType,
      title: 'Ventas',
      desc: 'Registro de facturas, deducción de stock y métodos de pago.',
      icon: ShoppingCart,
      badge: `${sales.length} Ventas`,
      stat: storageService.formatCurrency(totalSalesCOP),
      subText: 'Total facturado'
    },
    {
      id: 'clients' as ModuleType,
      title: 'Clientes',
      desc: 'Directorio de distribuidores, tiendas y clientes mayoristas.',
      icon: Users,
      badge: `${clients.length} Clientes`,
      stat: `${clients.length} Registrados`,
      subText: 'Directorio comercial'
    },
    {
      id: 'reports' as ModuleType,
      title: 'Reportes y Exportación',
      desc: 'Gráficos de rendimiento, balances y exportación PDF/Excel.',
      icon: BarChart3,
      badge: 'PDF / Excel',
      stat: 'Análisis Integral',
      subText: 'Indicadores de gestión'
    },
    {
      id: 'settings' as ModuleType,
      title: 'Configuración',
      desc: 'Datos del trapiche, parámetros de producción y contraseña.',
      icon: Settings,
      badge: 'Ajustes',
      stat: config.trapicheName,
      subText: `${config.municipality}, ${config.department}`
    }
  ];

  return (
    <div className="space-y-6 bg-white p-2 sm:p-4">
      
      {/* Trapiche Header Welcome Banner */}
      <div className="bg-[#A7B0D6]/20 border border-[#A7B0D6]/40 rounded-[30px] p-6 text-black shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-[#8893C2] text-white px-3.5 py-1 rounded-[30px] text-xs font-bold shadow-xs">
              <Sprout className="w-3.5 h-3.5 text-white" />
              <span>{config.trapicheName} &bull; NIT: {config.nit}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-black font-mono tracking-tight">
              Bienvenido a Panela<span className="text-[#8893C2]">Pró</span>
            </h1>
            <p className="text-xs sm:text-sm text-black/70 max-w-xl leading-relaxed font-medium">
              Sistema de control operativo y comercial. Administre lotes de molienda, controle su stock de caña e insumos y registre sus ventas en tiempo real.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => onSelectModule('code_export')}
              className="px-5 py-2.5 bg-[#8893C2] hover:bg-[#7782B1] text-white font-bold text-xs rounded-[30px] transition shadow-md flex items-center space-x-2"
            >
              <Code2 className="w-4 h-4 text-white" />
              <span className="text-white">Ver Código Kotlin</span>
            </button>
            <button
              onClick={onLogout}
              className="px-5 py-2.5 bg-[#FF0000] hover:bg-[#DD0000] text-white font-bold text-xs rounded-[30px] transition shadow-md flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4 text-white" />
              <span className="text-white">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-[24px] border border-[#A7B0D6]/40 shadow-xs flex items-center space-x-3">
          <div className="p-3 rounded-[30px] bg-[#8893C2] text-white">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-black/60">Panela Producida</p>
            <p className="text-lg font-black text-black font-mono">{totalPanelaKg.toLocaleString()} kg</p>
            <p className="text-[11px] text-[#8893C2] font-bold">Rendimiento: {avgYield}%</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[24px] border border-[#A7B0D6]/40 shadow-xs flex items-center space-x-3">
          <div className="p-3 rounded-[30px] bg-[#A7B0D6] text-white">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-black/60">Ventas Totales</p>
            <p className="text-lg font-black text-black font-mono">{storageService.formatCurrency(totalSalesCOP)}</p>
            <p className="text-[11px] text-black/60 font-medium">{sales.length} facturas emitidas</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[24px] border border-[#A7B0D6]/40 shadow-xs flex items-center space-x-3">
          <div className="p-3 rounded-[30px] bg-[#FF0000]/10 text-[#FF0000]">
            <AlertTriangle className="w-6 h-6 text-[#FF0000]" />
          </div>
          <div>
            <p className="text-xs font-bold text-black/60">Stock Crítico</p>
            <p className="text-lg font-black text-black font-mono">{lowStockItems.length} ítems</p>
            <p className={`text-[11px] font-bold ${lowStockItems.length > 0 ? 'text-[#FF0000]' : 'text-[#8893C2]'}`}>
              {lowStockItems.length > 0 ? 'Requiere reabastecimiento' : 'Inventario óptimo'}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[24px] border border-[#A7B0D6]/40 shadow-xs flex items-center space-x-3">
          <div className="p-3 rounded-[30px] bg-[#8893C2] text-white">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-black/60">Clientes Activos</p>
            <p className="text-lg font-black text-black font-mono">{clients.length}</p>
            <p className="text-[11px] text-black/60 font-medium">Directorio al día</p>
          </div>
        </div>

      </div>

      {/* Main Menu Module Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-black flex items-center gap-2">
            <span>Módulos de Gestión</span>
            <span className="text-xs bg-[#A7B0D6]/30 text-black font-mono font-bold px-2.5 py-1 rounded-[30px]">
              Material Design
            </span>
          </h2>
          <span className="text-xs font-bold text-black/60">Seleccione un módulo para operar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {menuCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onSelectModule(card.id)}
                className="group bg-white rounded-[24px] p-6 border border-[#A7B0D6]/40 shadow-xs hover:border-[#8893C2] hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden transform hover:-translate-y-0.5"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#8893C2]" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3.5 rounded-[30px] bg-[#8893C2] text-white shadow-xs group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <span className={`text-[11px] font-bold px-3 py-1 rounded-[30px] ${
                      card.badgeAlert 
                        ? 'bg-[#FF0000]/10 text-[#FF0000] border border-[#FF0000]/30 animate-pulse' 
                        : 'bg-[#A7B0D6]/30 text-black border border-[#A7B0D6]/40'
                    }`}>
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-black group-hover:text-[#8893C2] transition">
                    {card.title}
                  </h3>
                  <p className="text-xs text-black/70 mt-1.5 leading-relaxed font-medium">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#A7B0D6]/30 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-black">{card.stat}</p>
                    <p className="text-[10px] font-medium text-black/50">{card.subText}</p>
                  </div>

                  <div className="w-9 h-9 rounded-[30px] bg-[#A7B0D6]/30 text-black flex items-center justify-center group-hover:bg-[#8893C2] group-hover:text-white transition">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Table Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        
        {/* Recent Batches */}
        <div className="bg-white rounded-[24px] p-6 border border-[#A7B0D6]/40 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-black flex items-center gap-2">
              <Factory className="w-5 h-5 text-[#8893C2]" />
              <span>Últimos Lotes de Producción</span>
            </h3>
            <button
              onClick={() => onSelectModule('production')}
              className="px-3.5 py-1.5 bg-[#8893C2] hover:bg-[#7782B1] text-white font-bold text-xs rounded-[30px] transition shadow-xs"
            >
              Ver Todos &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {batches.slice(0, 3).map((b) => (
              <div key={b.id} className="p-3.5 bg-[#A7B0D6]/10 rounded-[20px] border border-[#A7B0D6]/20 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-black">{b.code}</span>
                    <span className="text-[10px] bg-[#8893C2] text-white px-2.5 py-0.5 rounded-[30px] font-bold">
                      {b.status}
                    </span>
                  </div>
                  <p className="text-xs text-black/70 mt-1 font-medium">
                    Caña: {b.caneAmountKg} kg &bull; Panela: {b.panelaProducedKg} kg ({b.panelaType})
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-black block">{b.rendimientoPercentage.toFixed(1)}%</span>
                  <span className="text-[10px] text-black/50 font-medium">{b.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-[24px] p-6 border border-[#A7B0D6]/40 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-black flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#8893C2]" />
              <span>Ventas Recientes</span>
            </h3>
            <button
              onClick={() => onSelectModule('sales')}
              className="px-3.5 py-1.5 bg-[#8893C2] hover:bg-[#7782B1] text-white font-bold text-xs rounded-[30px] transition shadow-xs"
            >
              Ver Todas &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {sales.slice(0, 3).map((s) => (
              <div key={s.id} className="p-3.5 bg-[#A7B0D6]/10 rounded-[20px] border border-[#A7B0D6]/20 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-black">{s.invoiceCode}</span>
                    <span className="text-[10px] bg-[#A7B0D6] text-white px-2.5 py-0.5 rounded-[30px] font-bold">
                      {s.paymentMethod}
                    </span>
                  </div>
                  <p className="text-xs text-black font-semibold mt-1">{s.clientName}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-black block">
                    {storageService.formatCurrency(s.total)}
                  </span>
                  <span className="text-[10px] text-black/50 font-medium">{s.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
