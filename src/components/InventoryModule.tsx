import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Edit3, 
  Trash2, 
  X
} from 'lucide-react';
import { InventoryItem, InventoryCategory, TransactionType } from '../types';
import { storageService } from '../services/storage';

interface InventoryModuleProps {
  inventory: InventoryItem[];
  onSaveItem: (item: InventoryItem) => void;
  onDeleteItem: (itemId: string) => void;
  onRegisterTransaction: (itemId: string, type: TransactionType, amount: number, reason: string) => void;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  inventory,
  onSaveItem,
  onDeleteItem,
  onRegisterTransaction
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | InventoryCategory | 'LOW_STOCK'>('ALL');

  // Modal State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<InventoryItem>>({});
  const [selectedStockItem, setSelectedStockItem] = useState<InventoryItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields for Item
  const [itemFormData, setItemFormData] = useState({
    code: '',
    name: '',
    category: 'MateriaPrima' as InventoryCategory,
    quantity: 100,
    unit: 'kg' as InventoryItem['unit'],
    minStock: 20,
    costPerUnit: 1000,
    sellPricePerUnit: 1500,
    location: 'Bodega Principal'
  });

  // Stock Movement Form Data
  const [stockFormData, setStockFormData] = useState({
    type: 'Entrada' as TransactionType,
    amount: 10,
    reason: 'Compra Materia Prima'
  });

  const [formError, setFormError] = useState<string | null>(null);

  const lowStockItems = inventory.filter(i => i.quantity <= i.minStock);

  const filteredItems = inventory.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          i.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          i.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (categoryFilter === 'LOW_STOCK') {
      return matchesSearch && i.quantity <= i.minStock;
    }
    if (categoryFilter !== 'ALL') {
      return matchesSearch && i.category === categoryFilter;
    }
    return matchesSearch;
  });

  const handleOpenCreateModal = () => {
    const nextCode = `INV-${String(inventory.length + 1).padStart(3, '0')}`;
    setEditingItem({});
    setItemFormData({
      code: nextCode,
      name: '',
      category: 'MateriaPrima',
      quantity: 100,
      unit: 'kg',
      minStock: 50,
      costPerUnit: 1000,
      sellPricePerUnit: 0,
      location: 'Bodega Principal'
    });
    setFormError(null);
    setIsItemModalOpen(true);
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setItemFormData({
      code: item.code,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      minStock: item.minStock,
      costPerUnit: item.costPerUnit,
      sellPricePerUnit: item.sellPricePerUnit,
      location: item.location
    });
    setFormError(null);
    setIsItemModalOpen(true);
  };

  const handleSaveItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!itemFormData.name.trim()) {
      setFormError('El nombre del producto o insumo es obligatorio.');
      return;
    }
    if (itemFormData.quantity < 0) {
      setFormError('La cantidad en stock no puede ser negativa.');
      return;
    }

    const newItem: InventoryItem = {
      id: editingItem.id || `inv-${Date.now()}`,
      code: itemFormData.code.trim(),
      name: itemFormData.name.trim(),
      category: itemFormData.category,
      quantity: Number(itemFormData.quantity),
      unit: itemFormData.unit,
      minStock: Number(itemFormData.minStock),
      costPerUnit: Number(itemFormData.costPerUnit),
      sellPricePerUnit: Number(itemFormData.sellPricePerUnit),
      location: itemFormData.location,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    onSaveItem(newItem);
    setIsItemModalOpen(false);
  };

  const handleStockMovementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockItem) return;

    if (stockFormData.amount <= 0) {
      alert('La cantidad del movimiento debe ser mayor a 0.');
      return;
    }

    if (stockFormData.type === 'Salida' && stockFormData.amount > selectedStockItem.quantity) {
      alert('La cantidad a retirar supera el stock disponible en bodega.');
      return;
    }

    onRegisterTransaction(
      selectedStockItem.id,
      stockFormData.type,
      Number(stockFormData.amount),
      stockFormData.reason
    );

    setIsStockModalOpen(false);
  };

  return (
    <div className="space-y-6 bg-white p-2 sm:p-4">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[24px] border border-[#A7B0D6]/40 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-black flex items-center gap-2">
            <Package className="w-6 h-6 text-[#8893C2]" />
            <span>Módulo de Inventarios & Stock</span>
          </h2>
          <p className="text-xs text-black/70 mt-1 font-medium">
            Gestión de Materia Prima (caña, bagazo, cal, empaques) y Productos Terminados.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 bg-[#8893C2] hover:bg-[#7782B1] text-white font-bold text-xs rounded-[30px] transition shadow-md flex items-center justify-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-white" />
          <span className="text-white">Registrar Producto / Insumo</span>
        </button>
      </div>

      {/* LOW STOCK ALERT BANNER */}
      {lowStockItems.length > 0 && (
        <div className="bg-[#FF0000]/10 border border-[#FF0000]/30 rounded-[24px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#FF0000] text-white rounded-[30px] font-bold shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-black">
                ¡Alerta de Inventario Bajo! ({lowStockItems.length} {lowStockItems.length === 1 ? 'ítem' : 'ítems'})
              </h3>
              <p className="text-xs text-black/70 mt-0.5">
                Existen productos o materia prima por debajo del stock mínimo de seguridad.
              </p>
            </div>
          </div>

          <button
            onClick={() => setCategoryFilter('LOW_STOCK')}
            className="px-5 py-2 bg-[#FF0000] hover:bg-[#DD0000] text-white font-bold text-xs rounded-[30px] transition shadow-xs shrink-0"
          >
            <span className="text-white">Ver Ítems Críticos &rarr;</span>
          </button>
        </div>
      )}

      {/* Filters & Tabs */}
      <div className="flex flex-col md:flex-row gap-3">
        
        {/* Category Tabs */}
        <div className="flex items-center space-x-1.5 bg-[#A7B0D6]/15 p-1.5 rounded-[30px] border border-[#A7B0D6]/30 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-4 py-2 rounded-[30px] transition shrink-0 ${
              categoryFilter === 'ALL' ? 'bg-[#8893C2] text-white shadow-xs' : 'text-black hover:bg-[#A7B0D6]/20'
            }`}
          >
            Todos ({inventory.length})
          </button>
          <button
            onClick={() => setCategoryFilter('MateriaPrima')}
            className={`px-4 py-2 rounded-[30px] transition shrink-0 ${
              categoryFilter === 'MateriaPrima' ? 'bg-[#8893C2] text-white shadow-xs' : 'text-black hover:bg-[#A7B0D6]/20'
            }`}
          >
            Materia Prima
          </button>
          <button
            onClick={() => setCategoryFilter('ProductoTerminado')}
            className={`px-4 py-2 rounded-[30px] transition shrink-0 ${
              categoryFilter === 'ProductoTerminado' ? 'bg-[#8893C2] text-white shadow-xs' : 'text-black hover:bg-[#A7B0D6]/20'
            }`}
          >
            Productos Terminados
          </button>
          <button
            onClick={() => setCategoryFilter('LOW_STOCK')}
            className={`px-4 py-2 rounded-[30px] transition shrink-0 flex items-center space-x-1 ${
              categoryFilter === 'LOW_STOCK' ? 'bg-[#FF0000] text-white shadow-xs' : 'text-[#FF0000] hover:bg-[#FF0000]/10'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Stock Bajo ({lowStockItems.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black/40">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar insumo, panela, código o ubicación..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#A7B0D6]/40 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2] transition shadow-xs"
          />
        </div>

      </div>

      {/* Inventory Items Table / Cards */}
      <div className="bg-white rounded-[24px] border border-[#A7B0D6]/40 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#A7B0D6]/15 border-b border-[#A7B0D6]/30 text-black font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Código / Ítem</th>
                <th className="px-4 py-3.5">Categoría</th>
                <th className="px-4 py-3.5 text-center">Stock Actual</th>
                <th className="px-4 py-3.5 text-center">Mínimo</th>
                <th className="px-4 py-3.5 text-right">Costo U.</th>
                <th className="px-4 py-3.5 text-right">Venta U.</th>
                <th className="px-4 py-3.5">Ubicación</th>
                <th className="px-4 py-3.5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A7B0D6]/30 font-medium text-black">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-black/60">
                    No se encontraron elementos en el inventario.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLowStock = item.quantity <= item.minStock;
                  return (
                    <tr key={item.id} className="hover:bg-[#A7B0D6]/10 transition">
                      
                      {/* Name & Code */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-black text-[11px] bg-[#A7B0D6]/20 px-2.5 py-1 rounded-[30px] border border-[#A7B0D6]/30">
                            {item.code}
                          </span>
                          <div>
                            <p className="font-bold text-black">{item.name}</p>
                            <p className="text-[10px] text-black/60">Actualizado: {item.lastUpdated}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <span className={`px-3 py-1 rounded-[30px] text-[10px] font-bold ${
                          item.category === 'MateriaPrima' 
                            ? 'bg-[#A7B0D6]/30 text-black' 
                            : 'bg-[#8893C2] text-white'
                        }`}>
                          {item.category === 'MateriaPrima' ? 'Materia Prima' : 'Producto Terminado'}
                        </span>
                      </td>

                      {/* Stock Quantity */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="inline-flex items-center space-x-1.5 font-mono font-bold">
                          <span className={`text-sm ${isLowStock ? 'text-[#FF0000] font-black' : 'text-black'}`}>
                            {item.quantity.toLocaleString()} {item.unit}
                          </span>
                          {isLowStock && (
                            <span className="p-1 bg-[#FF0000]/10 text-[#FF0000] rounded-full" title="¡Stock debajo del mínimo!">
                              <AlertTriangle className="w-3.5 h-3.5 text-[#FF0000] animate-bounce" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Min Stock */}
                      <td className="px-4 py-3.5 text-center font-mono text-black/60">
                        {item.minStock} {item.unit}
                      </td>

                      {/* Cost */}
                      <td className="px-4 py-3.5 text-right font-mono text-black/80">
                        {storageService.formatCurrency(item.costPerUnit)}
                      </td>

                      {/* Sell Price */}
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-black">
                        {item.sellPricePerUnit > 0 ? storageService.formatCurrency(item.sellPricePerUnit) : 'N/A'}
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3.5 text-black/70 font-medium">
                        {item.location}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          
                          {/* Entrada/Salida Quick Button */}
                          <button
                            onClick={() => {
                              setSelectedStockItem(item);
                              setStockFormData({
                                type: 'Entrada',
                                amount: 10,
                                reason: item.category === 'MateriaPrima' ? 'Compra Materia Prima' : 'Entrada de Producción'
                              });
                              setIsStockModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-[#8893C2] text-white hover:bg-[#7782B1] font-bold rounded-[30px] text-[10px] flex items-center space-x-1 transition shadow-xs"
                            title="Registrar Movimiento de Entrada/Salida"
                          >
                            <ArrowUpRight className="w-3 h-3 text-white" />
                            <span className="text-white">Movimiento</span>
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-black hover:bg-[#A7B0D6]/20 rounded-[30px] transition"
                            title="Editar Ítem"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#8893C2]" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="p-1.5 text-black hover:bg-[#FF0000]/10 rounded-[30px] transition"
                            title="Eliminar Ítem"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-[#FF0000]" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT ITEM MODAL */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl border border-[#A7B0D6]/40 my-6">
            <div className="bg-[#8893C2] p-5 text-white flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2 text-white">
                <Package className="w-5 h-5 text-white" />
                <span className="text-white">{editingItem.id ? 'Editar Ítem de Inventario' : 'Registrar Nuevo Insumo / Producto'}</span>
              </h3>
              <button onClick={() => setIsItemModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-[30px]">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <form onSubmit={handleSaveItemSubmit} className="p-6 space-y-4 bg-white">
              {formError && (
                <div className="p-3.5 bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#FF0000] text-xs font-bold rounded-[20px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#FF0000]" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black mb-1">Código *</label>
                  <input
                    type="text"
                    value={itemFormData.code}
                    onChange={(e) => setItemFormData({...itemFormData, code: e.target.value})}
                    placeholder="INV-001"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-mono font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">Categoría</label>
                  <select
                    value={itemFormData.category}
                    onChange={(e) => setItemFormData({...itemFormData, category: e.target.value as InventoryCategory})}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
                  >
                    <option value="MateriaPrima">Materia Prima / Insumo</option>
                    <option value="ProductoTerminado">Producto Terminado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Nombre del Producto / Insumo *</label>
                <input
                  type="text"
                  value={itemFormData.name}
                  onChange={(e) => setItemFormData({...itemFormData, name: e.target.value})}
                  placeholder="Ej. Panela en Bloque 500g Tradicional"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black mb-1">Cantidad Inicial</label>
                  <input
                    type="number"
                    value={itemFormData.quantity}
                    onChange={(e) => setItemFormData({...itemFormData, quantity: Number(e.target.value)})}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-mono font-bold text-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">Unidad</label>
                  <select
                    value={itemFormData.unit}
                    onChange={(e) => setItemFormData({...itemFormData, unit: e.target.value as any})}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black"
                  >
                    <option value="kg">kg</option>
                    <option value="ton">toneladas</option>
                    <option value="unidades">unidades</option>
                    <option value="cajas">cajas</option>
                    <option value="litros">litros</option>
                    <option value="bultos">bultos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#FF0000] mb-1">Stock Mínimo (Alerta)</label>
                  <input
                    type="number"
                    value={itemFormData.minStock}
                    onChange={(e) => setItemFormData({...itemFormData, minStock: Number(e.target.value)})}
                    className="w-full px-3.5 py-2.5 bg-[#FF0000]/10 border border-[#FF0000]/30 text-black font-mono font-bold rounded-[20px] text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black mb-1">Costo Unitario (COP)</label>
                  <input
                    type="number"
                    value={itemFormData.costPerUnit}
                    onChange={(e) => setItemFormData({...itemFormData, costPerUnit: Number(e.target.value)})}
                    placeholder="2100"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-mono text-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">Precio Venta Unitario (COP)</label>
                  <input
                    type="number"
                    value={itemFormData.sellPricePerUnit}
                    onChange={(e) => setItemFormData({...itemFormData, sellPricePerUnit: Number(e.target.value)})}
                    placeholder="3600"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-mono font-bold text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Ubicación en Trapiche / Bodega</label>
                <input
                  type="text"
                  value={itemFormData.location}
                  onChange={(e) => setItemFormData({...itemFormData, location: e.target.value})}
                  placeholder="Ej. Bodega Producto Terminado - Estante A"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black"
                />
              </div>

              <div className="pt-3 border-t border-[#A7B0D6]/30 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-5 py-2.5 bg-white border border-[#A7B0D6] text-black text-xs font-bold rounded-[30px] hover:bg-[#A7B0D6]/20 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#8893C2] hover:bg-[#7782B1] text-white text-xs font-bold rounded-[30px] shadow-md transition"
                >
                  <span className="text-white">Guardar Ítem</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STOCK MOVEMENT MODAL (ENTRADA / SALIDA) */}
      {isStockModalOpen && selectedStockItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-md w-full overflow-hidden shadow-2xl border border-[#A7B0D6]/40 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#A7B0D6]/30 pb-3">
              <div>
                <h3 className="text-sm font-bold text-black">Registrar Movimiento de Inventario</h3>
                <p className="text-xs text-black/60 font-medium">{selectedStockItem.name}</p>
              </div>
              <button onClick={() => setIsStockModalOpen(false)} className="text-black/60 hover:text-black p-1 rounded-[30px]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStockMovementSubmit} className="space-y-4">
              <div className="flex items-center justify-center space-x-2 bg-[#A7B0D6]/15 p-1.5 rounded-[30px] text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setStockFormData({...stockFormData, type: 'Entrada'})}
                  className={`flex-1 py-2 rounded-[30px] flex items-center justify-center space-x-1 transition ${
                    stockFormData.type === 'Entrada' ? 'bg-[#8893C2] text-white shadow-xs' : 'text-black'
                  }`}
                >
                  <ArrowUpRight className={`w-4 h-4 ${stockFormData.type === 'Entrada' ? 'text-white' : 'text-[#8893C2]'}`} />
                  <span className={stockFormData.type === 'Entrada' ? 'text-white' : 'text-black'}>Entrada de Stock</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStockFormData({...stockFormData, type: 'Salida'})}
                  className={`flex-1 py-2 rounded-[30px] flex items-center justify-center space-x-1 transition ${
                    stockFormData.type === 'Salida' ? 'bg-[#FF0000] text-white shadow-xs' : 'text-black'
                  }`}
                >
                  <ArrowDownRight className={`w-4 h-4 ${stockFormData.type === 'Salida' ? 'text-white' : 'text-[#FF0000]'}`} />
                  <span className={stockFormData.type === 'Salida' ? 'text-white' : 'text-black'}>Salida / Retiro</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Cantidad ({selectedStockItem.unit}) *
                </label>
                <input
                  type="number"
                  value={stockFormData.amount}
                  onChange={(e) => setStockFormData({...stockFormData, amount: Number(e.target.value)})}
                  min="1"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-sm font-mono font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Causa / Motivo del Movimiento</label>
                <select
                  value={stockFormData.reason}
                  onChange={(e) => setStockFormData({...stockFormData, reason: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black"
                >
                  <option value="Compra Materia Prima">Compra de Materia Prima</option>
                  <option value="Entrada de Producción">Entrada por Producción de Lote</option>
                  <option value="Venta Comercial">Despacho por Venta Comercial</option>
                  <option value="Consumo Interno">Consumo Interno en Trapiche</option>
                  <option value="Ajuste Stock">Ajuste de Inventario / Conteo</option>
                  <option value="Merma">Merma o Daño</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-5 py-2 bg-white border border-[#A7B0D6] text-black text-xs font-bold rounded-[30px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white text-xs font-bold rounded-[30px] shadow-sm ${
                    stockFormData.type === 'Entrada' ? 'bg-[#8893C2] hover:bg-[#7782B1]' : 'bg-[#FF0000] hover:bg-[#DD0000]'
                  }`}
                >
                  <span className="text-white">Aplicar Movimiento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-[#A7B0D6]/40">
            <div className="w-12 h-12 bg-[#FF0000]/10 text-[#FF0000] rounded-[30px] flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-[#FF0000]" />
            </div>
            <h3 className="text-base font-bold text-black">¿Eliminar ítem del inventario?</h3>
            <p className="text-xs text-black/70 font-medium">Se eliminará este producto o insumo de los registros de stock.</p>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2 bg-white border border-[#A7B0D6] text-black text-xs font-bold rounded-[30px] hover:bg-[#A7B0D6]/20"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteItem(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-5 py-2 bg-[#FF0000] hover:bg-[#DD0000] text-white text-xs font-bold rounded-[30px] shadow-sm"
              >
                <span className="text-white">Confirmar</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
