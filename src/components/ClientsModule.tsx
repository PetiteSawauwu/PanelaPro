import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Building2,
  X,
  AlertCircle
} from 'lucide-react';
import { Client } from '../types';

interface ClientsModuleProps {
  clients: Client[];
  onSaveClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
}

export const ClientsModule: React.FC<ClientsModuleProps> = ({
  clients,
  onSaveClient,
  onDeleteClient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Partial<Client>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    documentType: 'NIT' as 'NIT' | 'CC',
    documentNumber: '',
    phone: '',
    email: '',
    address: '',
    municipality: 'Villeta',
    notes: ''
  });

  const [formError, setFormError] = useState<string | null>(null);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.documentNumber.includes(searchTerm) ||
    c.municipality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreateModal = () => {
    setEditingClient({});
    setFormData({
      name: '',
      documentType: 'NIT',
      documentNumber: '',
      phone: '+57 ',
      email: '',
      address: '',
      municipality: 'Villeta',
      notes: ''
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      documentType: client.documentType,
      documentNumber: client.documentNumber,
      phone: client.phone,
      email: client.email,
      address: client.address,
      municipality: client.municipality,
      notes: client.notes || ''
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('El nombre o razón social del cliente es obligatorio.');
      return;
    }
    if (!formData.documentNumber.trim()) {
      setFormError('El número de documento / NIT es obligatorio.');
      return;
    }

    const newClient: Client = {
      id: editingClient.id || `cli-${Date.now()}`,
      name: formData.name.trim(),
      documentType: formData.documentType,
      documentNumber: formData.documentNumber.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      municipality: formData.municipality.trim(),
      notes: formData.notes.trim(),
      createdAt: editingClient.createdAt || new Date().toISOString().split('T')[0]
    };

    onSaveClient(newClient);
    setIsModalOpen(false);
  };

  const getCleanPhoneForWhatsApp = (phoneStr: string) => {
    const digits = phoneStr.replace(/\D/g, '');
    if (digits.startsWith('57')) return digits;
    return `57${digits}`;
  };

  return (
    <div className="space-y-6 bg-white p-2 sm:p-4">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[24px] border border-[#A7B0D6]/40 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-black flex items-center gap-2">
            <Users className="w-6 h-6 text-[#8893C2]" />
            <span>Módulo de Clientes & Compradores</span>
          </h2>
          <p className="text-xs text-black/70 mt-1 font-medium">
            Directorio de mayoristas, supermercados, distribuidores regionales y tiendas al detal.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 bg-[#8893C2] hover:bg-[#7782B1] text-white font-bold text-xs rounded-[30px] transition shadow-md flex items-center justify-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-white" />
          <span className="text-white">Registrar Nuevo Cliente</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black/40">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por cliente, NIT, Cédula o Municipio..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#A7B0D6]/40 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2] transition shadow-xs"
        />
      </div>

      {/* Clients Cards Grid */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-[24px] p-8 text-center border border-[#A7B0D6]/40 text-black/60 shadow-xs">
          <Users className="w-12 h-12 text-[#A7B0D6] mx-auto mb-2" />
          <p className="text-sm font-bold text-black">No se encontraron clientes</p>
          <p className="text-xs text-black/60">Registre su primer cliente comercial.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => (
            <div 
              key={client.id}
              className="bg-white rounded-[24px] p-5 border border-[#A7B0D6]/40 shadow-xs hover:border-[#8893C2] hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Client Name & Doc */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-black leading-snug">
                      {client.name}
                    </h3>
                    <p className="text-[11px] font-mono text-[#8893C2] font-bold mt-0.5">
                      {client.documentType}: {client.documentNumber}
                    </p>
                  </div>

                  <span className="p-2 bg-[#A7B0D6]/20 text-[#8893C2] rounded-[30px] shrink-0">
                    <Building2 className="w-4 h-4 text-[#8893C2]" />
                  </span>
                </div>

                {/* Contact details */}
                <div className="mt-4 space-y-1.5 text-xs text-black/80 font-medium">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#8893C2] shrink-0" />
                    <span>{client.address} &bull; <strong className="text-black">{client.municipality}</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-black/40 shrink-0" />
                    <span>{client.phone}</span>
                  </p>
                  {client.email && (
                    <p className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-black/40 shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </p>
                  )}
                </div>

                {client.notes && (
                  <div className="mt-3 p-2.5 bg-[#A7B0D6]/15 rounded-[20px] text-[11px] text-black/70 italic border border-[#A7B0D6]/30">
                    "{client.notes}"
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#A7B0D6]/30 flex items-center justify-between">
                
                {/* Direct WhatsApp button */}
                {client.phone && (
                  <a
                    href={`https://wa.me/${getCleanPhoneForWhatsApp(client.phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 bg-[#8893C2] hover:bg-[#7782B1] text-white font-bold text-[11px] rounded-[30px] flex items-center space-x-1.5 transition shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-white" />
                    <span className="text-white">WhatsApp</span>
                  </a>
                )}

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(client)}
                    className="p-1.5 text-black hover:bg-[#A7B0D6]/20 rounded-[30px] transition"
                    title="Editar Cliente"
                  >
                    <Edit3 className="w-4 h-4 text-[#8893C2]" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(client.id)}
                    className="p-1.5 text-black hover:bg-[#FF0000]/10 rounded-[30px] transition"
                    title="Eliminar Cliente"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl border border-[#A7B0D6]/40 my-6">
            <div className="bg-[#8893C2] p-5 text-white flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2 text-white">
                <Users className="w-5 h-5 text-white" />
                <span className="text-white">{editingClient.id ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-[30px]">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="p-6 space-y-4 bg-white">
              {formError && (
                <div className="p-3.5 bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#FF0000] text-xs font-bold rounded-[20px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#FF0000]" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-black mb-1">Nombre o Razón Social *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej. Distribuidora Panela de la Sabana S.A.S."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black mb-1">Tipo Doc.</label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => setFormData({...formData, documentType: e.target.value as any})}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black"
                  >
                    <option value="NIT">NIT</option>
                    <option value="CC">Cédula (CC)</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-black mb-1">Número de Documento *</label>
                  <input
                    type="text"
                    value={formData.documentNumber}
                    onChange={(e) => setFormData({...formData, documentNumber: e.target.value})}
                    placeholder="900.482.119-1"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-mono font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black mb-1">Teléfono / Celular</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+57 310 987 6543"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="compras@cliente.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black mb-1">Dirección</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Carrera 15 # 22-45"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">Municipio / Ciudad</label>
                  <input
                    type="text"
                    value={formData.municipality}
                    onChange={(e) => setFormData({...formData, municipality: e.target.value})}
                    placeholder="Villeta"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Notas Comerciales / Preferencias</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={2}
                  placeholder="Condiciones de pago, tipo de panela preferida..."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black"
                />
              </div>

              <div className="pt-3 border-t border-[#A7B0D6]/30 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-white border border-[#A7B0D6] text-black text-xs font-bold rounded-[30px] hover:bg-[#A7B0D6]/20 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#8893C2] hover:bg-[#7782B1] text-white text-xs font-bold rounded-[30px] shadow-md transition"
                >
                  <span className="text-white">Guardar Cliente</span>
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
            <h3 className="text-base font-bold text-black">¿Eliminar cliente del directorio?</h3>
            <p className="text-xs text-black/70 font-medium">Se eliminará la información de contacto comercial.</p>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2 bg-white border border-[#A7B0D6] text-black text-xs font-bold rounded-[30px] hover:bg-[#A7B0D6]/20"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteClient(deleteConfirmId);
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
