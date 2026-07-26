import React, { useState } from 'react';
import { 
  Settings, 
  Lock, 
  Building2, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { User, TrapicheConfig } from '../types';

interface SettingsModuleProps {
  user: User | null;
  config: TrapicheConfig;
  onSaveConfig: (config: TrapicheConfig) => void;
  onSaveUser: (user: User) => void;
  onLogout: () => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  user,
  config,
  onSaveConfig,
  onSaveUser,
  onLogout
}) => {
  // Config Form
  const [configFormData, setConfigFormData] = useState<TrapicheConfig>({ ...config });
  
  // User Profile Form
  const [userFormData, setUserFormData] = useState({
    fullName: user?.fullName || 'Ashley Castañeda Villamil',
    email: user?.email || 'ashley.castaneda@panelapro.co',
    phone: user?.phone || '+57 312 456 7890'
  });

  // Password Form
  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSaveTrapicheInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!configFormData.trapicheName.trim()) {
      setErrorMsg('El nombre del trapiche es obligatorio.');
      return;
    }

    onSaveConfig(configFormData);
    if (user) {
      onSaveUser({
        ...user,
        fullName: userFormData.fullName,
        email: userFormData.email,
        phone: userFormData.phone,
        trapicheName: configFormData.trapicheName
      });
    }

    setSuccessMsg('¡Datos de la empresa y usuario actualizados correctamente!');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!passData.currentPassword) {
      setErrorMsg('Por favor ingrese su contraseña actual.');
      return;
    }
    if (passData.newPassword.length < 4) {
      setErrorMsg('La nueva contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (passData.newPassword !== passData.confirmPassword) {
      setErrorMsg('Las nuevas contraseñas no coinciden.');
      return;
    }

    setSuccessMsg('¡Contraseña actualizada con éxito!');
    setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto bg-white p-2 sm:p-4">
      
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-[24px] border border-[#A7B0D6]/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-black flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#8893C2]" />
            <span>Configuración del Sistema & Parámetros</span>
          </h2>
          <p className="text-xs text-black/70 mt-1 font-medium">
            Administración del perfil de usuario, datos legales del trapiche y contraseñas.
          </p>
        </div>

        <button
          onClick={onLogout}
          className="px-5 py-2.5 bg-[#FF0000] hover:bg-[#DD0000] text-white font-bold text-xs rounded-[30px] transition flex items-center justify-center space-x-1.5 shadow-md shrink-0"
        >
          <LogOut className="w-4 h-4 text-white" />
          <span className="text-white">Cerrar Sesión</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-[#8893C2]/15 border border-[#8893C2]/40 text-black text-xs font-bold rounded-[20px] flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#8893C2] shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#FF0000] text-xs font-bold rounded-[20px] flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-[#FF0000] shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Trapiche Profile Form */}
      <div className="bg-white rounded-[24px] p-6 border border-[#A7B0D6]/40 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-black flex items-center gap-2 border-b border-[#A7B0D6]/30 pb-3">
          <Building2 className="w-5 h-5 text-[#8893C2]" />
          <span>Información de la Empresa / Trapiche</span>
        </h3>

        <form onSubmit={handleSaveTrapicheInfo} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-bold text-black mb-1">Nombre del Trapiche *</label>
              <input
                type="text"
                value={configFormData.trapicheName}
                onChange={(e) => setConfigFormData({...configFormData, trapicheName: e.target.value})}
                className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">NIT / Registro Tributario</label>
              <input
                type="text"
                value={configFormData.nit}
                onChange={(e) => setConfigFormData({...configFormData, nit: e.target.value})}
                className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-mono font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">Nombre del Administrador / Propietario</label>
              <input
                type="text"
                value={userFormData.fullName}
                onChange={(e) => setUserFormData({...userFormData, fullName: e.target.value})}
                className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">Correo Electrónico de Contacto</label>
              <input
                type="email"
                value={userFormData.email}
                onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">Teléfono Principal</label>
              <input
                type="text"
                value={userFormData.phone}
                onChange={(e) => setUserFormData({...userFormData, phone: e.target.value})}
                className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">Departamento</label>
              <input
                type="text"
                value={configFormData.department}
                onChange={(e) => setConfigFormData({...configFormData, department: e.target.value})}
                className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">Municipio</label>
              <input
                type="text"
                value={configFormData.municipality}
                onChange={(e) => setConfigFormData({...configFormData, municipality: e.target.value})}
                className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">Ubicación / Dirección Trapiche</label>
              <input
                type="text"
                value={configFormData.address}
                onChange={(e) => setConfigFormData({...configFormData, address: e.target.value})}
                className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
              />
            </div>

          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#8893C2] hover:bg-[#7782B1] text-white font-bold text-xs rounded-[30px] shadow-md flex items-center space-x-2 transition"
            >
              <Save className="w-4 h-4 text-white" />
              <span className="text-white">Guardar Cambios de Perfil</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password Change */}
      <div className="bg-white rounded-[24px] p-6 border border-[#A7B0D6]/40 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-black flex items-center gap-2 border-b border-[#A7B0D6]/30 pb-3">
          <Lock className="w-5 h-5 text-[#8893C2]" />
          <span>Seguridad y Cambio de Contraseña</span>
        </h3>

        <form onSubmit={handleChangePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold text-black mb-1">Contraseña Actual *</label>
            <input
              type="password"
              value={passData.currentPassword}
              onChange={(e) => setPassData({...passData, currentPassword: e.target.value})}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1">Nueva Contraseña *</label>
            <input
              type="password"
              value={passData.newPassword}
              onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
              placeholder="Mínimo 4 caracteres"
              className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1">Confirmar Nueva Contraseña *</label>
            <input
              type="password"
              value={passData.confirmPassword}
              onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})}
              placeholder="Repita la nueva contraseña"
              className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#8893C2] hover:bg-[#7782B1] text-white font-bold text-xs rounded-[30px] shadow-md transition flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-white" />
            <span className="text-white">Actualizar Contraseña</span>
          </button>
        </form>
      </div>

    </div>
  );
};
