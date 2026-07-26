import React, { useState } from 'react';
import { 
  Factory, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  AlertCircle,
  X,
  Filter,
  Calculator,
  Calendar,
  UserCheck
} from 'lucide-react';
import { ProductionBatch, BatchStatus } from '../types';

interface ProductionModuleProps {
  batches: ProductionBatch[];
  onSaveBatch: (batch: ProductionBatch) => void;
  onDeleteBatch: (batchId: string) => void;
}

export const ProductionModule: React.FC<ProductionModuleProps> = ({
  batches,
  onSaveBatch,
  onDeleteBatch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<ProductionBatch | null>(null);
  const [editingBatch, setEditingBatch] = useState<Partial<ProductionBatch>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    code: '',
    date: new Date().toISOString().split('T')[0],
    caneAmountKg: 5000,
    panelaProducedKg: 550,
    panelaType: 'Bloque 500g',
    status: 'Molienda' as BatchStatus,
    operatorName: 'Don José Ramos',
    observations: ''
  });

  const [formError, setFormError] = useState<string | null>(null);

  // Filtered Batches
  const filteredBatches = batches.filter(b => {
    const matchesSearch = b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.panelaType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.operatorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatusFilter === 'ALL' || b.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreateModal = () => {
    const nextCodeNumber = batches.length + 1;
    const autoCode = `LOT-2026-${String(nextCodeNumber).padStart(3, '0')}`;
    
    setEditingBatch({});
    setFormData({
      code: autoCode,
      date: new Date().toISOString().split('T')[0],
      caneAmountKg: 5000,
      panelaProducedKg: 550,
      panelaType: 'Bloque 500g',
      status: 'Molienda',
      operatorName: 'Don José Ramos',
      observations: 'Molienda estándar de caña limpia.'
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (batch: ProductionBatch) => {
    setEditingBatch(batch);
    setFormData({
      code: batch.code,
      date: batch.date,
      caneAmountKg: batch.caneAmountKg,
      panelaProducedKg: batch.panelaProducedKg,
      panelaType: batch.panelaType,
      status: batch.status,
      operatorName: batch.operatorName,
      observations: batch.observations
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formData.code.trim()) {
      setFormError('El código del lote es obligatorio.');
      return;
    }
    if (formData.caneAmountKg <= 0) {
      setFormError('La cantidad de caña debe ser un número positivo.');
      return;
    }
    if (formData.panelaProducedKg < 0) {
      setFormError('La cantidad de panela producida no puede ser negativa.');
      return;
    }

    const caneKg = Number(formData.caneAmountKg);
    const panelaKg = Number(formData.panelaProducedKg);
    const rendimiento = caneKg > 0 ? (panelaKg / caneKg) * 100 : 0;

    const newOrUpdatedBatch: ProductionBatch = {
      id: editingBatch.id || `batch-${Date.now()}`,
      code: formData.code.trim(),
      date: formData.date,
      caneAmountKg: caneKg,
      panelaProducedKg: panelaKg,
      panelaType: formData.panelaType,
      status: formData.status,
      operatorName: formData.operatorName,
      observations: formData.observations,
      rendimientoPercentage: Number(rendimiento.toFixed(2)),
      createdAt: editingBatch.createdAt || new Date().toISOString()
    };

    onSaveBatch(newOrUpdatedBatch);
    setIsModalOpen(false);
  };

  const calculateLiveYield = () => {
    if (formData.caneAmountKg > 0) {
      return ((formData.panelaProducedKg / formData.caneAmountKg) * 100).toFixed(2);
    }
    return '0.00';
  };

  const getStatusBadge = (status: BatchStatus) => {
    switch (status) {
      case 'Molienda':
        return 'bg-[#A7B0D6]/30 text-black border-[#A7B0D6]';
      case 'Clarificación':
        return 'bg-[#A7B0D6]/40 text-black border-[#A7B0D6]';
      case 'Punteo':
        return 'bg-[#8893C2]/20 text-black border-[#8893C2]';
      case 'Moldeo':
        return 'bg-[#8893C2]/30 text-black border-[#8893C2]';
      case 'Empacado':
        return 'bg-[#8893C2]/40 text-black border-[#8893C2]';
      case 'Finalizado':
        return 'bg-[#8893C2] text-white border-[#8893C2]';
      default:
        return 'bg-gray-100 text-black';
    }
  };

  return (
    <div className="space-y-6 bg-white p-2 sm:p-4">
      
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[24px] border border-[#A7B0D6]/40 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-black flex items-center gap-2">
            <Factory className="w-6 h-6 text-[#8893C2]" />
            <span>Módulo de Producción (Lotes)</span>
          </h2>
          <p className="text-xs text-black/70 mt-1 font-medium">
            Registro, control de proceso y rendimiento % de conversión de caña a panela.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 bg-[#8893C2] hover:bg-[#7782B1] text-white font-bold text-xs rounded-[30px] transition shadow-md flex items-center justify-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-white" />
          <span className="text-white">Registrar Nuevo Lote</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Search */}
        <div className="relative md:col-span-2">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black/40">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código de lote, tipo de panela o maestro paila..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#A7B0D6]/40 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2] transition shadow-xs"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black/40">
            <Filter className="w-4 h-4" />
          </div>
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-white border border-[#A7B0D6]/40 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2] transition shadow-xs appearance-none"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="Molienda">Molienda</option>
            <option value="Clarificación">Clarificación</option>
            <option value="Punteo">Punteo</option>
            <option value="Moldeo">Moldeo</option>
            <option value="Empacado">Empacado</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>

      </div>

      {/* Production Batches Grid */}
      {filteredBatches.length === 0 ? (
        <div className="bg-white rounded-[24px] p-8 text-center border border-[#A7B0D6]/40 shadow-xs text-black/60">
          <Factory className="w-12 h-12 text-[#A7B0D6] mx-auto mb-3" />
          <p className="text-sm font-bold text-black">No se encontraron lotes de producción</p>
          <p className="text-xs text-black/60 mt-1">Intente cambiar los filtros o registre un nuevo lote.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBatches.map((batch) => (
            <div 
              key={batch.id} 
              className="bg-white rounded-[24px] p-5 border border-[#A7B0D6]/40 shadow-xs hover:border-[#8893C2] hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Top Badge & Code */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-black text-sm text-black bg-[#A7B0D6]/20 px-3 py-1 rounded-[30px] border border-[#A7B0D6]/40">
                    {batch.code}
                  </span>
                  <span className={`text-[11px] font-bold px-3 py-0.5 rounded-[30px] border ${getStatusBadge(batch.status)}`}>
                    {batch.status}
                  </span>
                </div>

                <div className="text-xs text-black/70 space-y-1 mt-3">
                  <p className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#8893C2]" />
                    <span>Fecha: <strong className="text-black">{batch.date}</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5 font-medium">
                    <UserCheck className="w-3.5 h-3.5 text-[#8893C2]" />
                    <span>Maestro Paila: <strong className="text-black">{batch.operatorName}</strong></span>
                  </p>
                </div>

                <div className="mt-4 p-3.5 bg-[#A7B0D6]/15 rounded-[20px] space-y-1.5 border border-[#A7B0D6]/30">
                  <div className="flex justify-between text-xs">
                    <span className="text-black/70 font-medium">Caña Molida:</span>
                    <span className="font-bold text-black">{batch.caneAmountKg.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-black/70 font-medium">Panela Obtenida:</span>
                    <span className="font-bold text-black">{batch.panelaProducedKg.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1.5 border-t border-[#A7B0D6]/30">
                    <span className="text-black font-bold">Rendimiento:</span>
                    <span className="font-mono font-black text-white bg-[#8893C2] px-2 py-0.5 rounded-[30px]">
                      {batch.rendimientoPercentage}%
                    </span>
                  </div>
                </div>

                {batch.observations && (
                  <p className="text-xs text-black/60 italic mt-3 line-clamp-2">
                    "{batch.observations}"
                  </p>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-[#A7B0D6]/30 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setCurrentBatch(batch);
                    setIsDetailModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-[#8893C2] text-white hover:bg-[#7782B1] rounded-[30px] font-bold flex items-center space-x-1 transition shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5 text-white" />
                  <span className="text-white">Consultar</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(batch)}
                    className="p-2 text-black hover:bg-[#A7B0D6]/20 rounded-[30px] transition"
                    title="Editar Lote"
                  >
                    <Edit3 className="w-4 h-4 text-[#8893C2]" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(batch.id)}
                    className="p-2 text-black hover:bg-[#FF0000]/10 rounded-[30px] transition"
                    title="Eliminar Lote"
                  >
                    <Trash2 className="w-4 h-4 text-[#FF0000]" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl border border-[#A7B0D6]/40 my-8">
            
            <div className="bg-[#8893C2] p-5 text-white flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2 text-white">
                <Factory className="w-5 h-5 text-white" />
                <span className="text-white">{editingBatch.id ? 'Editar Lote de Producción' : 'Registrar Nuevo Lote'}</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-[30px] text-white hover:bg-white/20 transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="p-6 space-y-4 bg-white">
              
              {formError && (
                <div className="p-3.5 bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#FF0000] text-xs font-bold rounded-[20px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#FF0000] shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black mb-1">Código del Lote *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="LOT-2026-001"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-mono font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">Fecha de Molienda *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black mb-1">Cantidad de Caña (kg) *</label>
                  <input
                    type="number"
                    value={formData.caneAmountKg}
                    onChange={(e) => setFormData({...formData, caneAmountKg: Number(e.target.value)})}
                    placeholder="5000"
                    min="1"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-mono font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">Panela Producida (kg) *</label>
                  <input
                    type="number"
                    value={formData.panelaProducedKg}
                    onChange={(e) => setFormData({...formData, panelaProducedKg: Number(e.target.value)})}
                    placeholder="550"
                    min="0"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-mono font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
                    required
                  />
                </div>
              </div>

              {/* Live Yield Calculation Indicator */}
              <div className="p-3.5 bg-[#A7B0D6]/20 rounded-[20px] border border-[#A7B0D6]/40 flex items-center justify-between text-xs">
                <span className="font-bold text-black flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-[#8893C2]" />
                  Rendimiento Estimado:
                </span>
                <span className="font-mono font-black text-sm text-white bg-[#8893C2] px-3 py-1 rounded-[30px]">
                  {calculateLiveYield()}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black mb-1">Tipo / Presentación de Panela</label>
                  <select
                    value={formData.panelaType}
                    onChange={(e) => setFormData({...formData, panelaType: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
                  >
                    <option value="Bloque 500g">Bloque 500g Tradicional</option>
                    <option value="Bloque 1kg">Bloque 1kg Especial</option>
                    <option value="Granulada Orgánica">Granulada Orgánica</option>
                    <option value="Miel de Caña / Melaza">Miel de Caña / Melaza</option>
                    <option value="Caja 20kg Surtida">Caja 20kg Surtida</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">Estado Actual del Lote</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as BatchStatus})}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
                  >
                    <option value="Molienda">Molienda</option>
                    <option value="Clarificación">Clarificación</option>
                    <option value="Punteo">Punteo</option>
                    <option value="Moldeo">Moldeo</option>
                    <option value="Empacado">Empacado</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Maestro Paila / Operador</label>
                <input
                  type="text"
                  value={formData.operatorName}
                  onChange={(e) => setFormData({...formData, operatorName: e.target.value})}
                  placeholder="Ej. Don José Ramos"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Observaciones de la Molienda</label>
                <textarea
                  value={formData.observations}
                  onChange={(e) => setFormData({...formData, observations: e.target.value})}
                  rows={3}
                  placeholder="Detalles de brix, bagazo, temperatura de pailas o aditivos naturales utilizados..."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
                />
              </div>

              <div className="pt-3 border-t border-[#A7B0D6]/30 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-white border border-[#A7B0D6] text-black text-xs font-bold rounded-[30px] hover:bg-[#A7B0D6]/20 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#8893C2] hover:bg-[#7782B1] text-white text-xs font-bold rounded-[30px] transition shadow-md"
                >
                  <span className="text-white">{editingBatch.id ? 'Guardar Cambios' : 'Registrar Lote'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {isDetailModalOpen && currentBatch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-md w-full overflow-hidden shadow-2xl border border-[#A7B0D6]/40 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#A7B0D6]/30 pb-3">
              <h3 className="text-base font-bold text-black font-mono">
                Consulta de Lote: {currentBatch.code}
              </h3>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-black/60 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-black">
              <p><strong>Fecha:</strong> {currentBatch.date}</p>
              <p><strong>Estado:</strong> <span className="font-bold text-[#8893C2]">{currentBatch.status}</span></p>
              <p><strong>Tipo de Panela:</strong> {currentBatch.panelaType}</p>
              <p><strong>Caña Entrada:</strong> {currentBatch.caneAmountKg.toLocaleString()} kg</p>
              <p><strong>Panela Producida:</strong> {currentBatch.panelaProducedKg.toLocaleString()} kg</p>
              <p><strong>Rendimiento %:</strong> <span className="font-extrabold text-[#8893C2]">{currentBatch.rendimientoPercentage}%</span></p>
              <p><strong>Maestro Paila:</strong> {currentBatch.operatorName}</p>
              <p className="pt-2 border-t border-[#A7B0D6]/30 text-black/70"><strong>Observaciones:</strong> {currentBatch.observations || 'Sin observaciones.'}</p>
            </div>

            <div className="pt-3 text-right">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 bg-[#8893C2] hover:bg-[#7782B1] text-white text-xs font-bold rounded-[30px] shadow-sm transition"
              >
                <span className="text-white">Cerrar</span>
              </button>
            </div>
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
            <h3 className="text-base font-bold text-black">¿Eliminar lote de producción?</h3>
            <p className="text-xs text-black/70">Esta acción no se puede deshacer y borrará el registro del lote.</p>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2 bg-white border border-[#A7B0D6] text-black text-xs font-bold rounded-[30px] hover:bg-[#A7B0D6]/20"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteBatch(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-5 py-2 bg-[#FF0000] hover:bg-[#DD0000] text-white text-xs font-bold rounded-[30px] shadow-sm"
              >
                <span className="text-white">Confirmar Eliminación</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
