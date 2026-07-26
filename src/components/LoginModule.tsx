import React, { useState } from 'react';
import { 
  Sprout, 
  User as UserIcon, 
  Lock, 
  AlertCircle, 
  LogIn,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { User } from '../types';

interface LoginModuleProps {
  onLoginSuccess: (user: User, remember: boolean) => void;
}

export const LoginModule: React.FC<LoginModuleProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [rememberSession, setRememberSession] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!username.trim()) {
      setErrorMsg('Por favor ingrese el nombre de usuario.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Por favor ingrese la contraseña.');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    setIsLoading(true);

    // Simulate login verification
    setTimeout(() => {
      if ((username.toLowerCase() === 'admin' || username.toLowerCase() === 'ashley' || username.toLowerCase() === 'carlos') && password === '123456') {
        const loggedUser: User = {
          id: 'usr-1',
          username: username.trim(),
          fullName: 'Ashley Castañeda Villamil',
          trapicheName: 'Trapiche La Gran Colombia',
          email: 'ashley.castaneda@panelapro.co',
          role: 'Administradora de Trapiche',
          phone: '+57 312 456 7890',
          rememberSession: rememberSession
        };
        onLoginSuccess(loggedUser, rememberSession);
      } else {
        setIsLoading(false);
        setErrorMsg('Usuario o contraseña incorrectos. Utilice demo: admin / 123456');
      }
    }, 600);
  };

  const handleQuickDemoFill = () => {
    setUsername('admin');
    setPassword('123456');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 bg-white">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-lg overflow-hidden border border-[#A7B0D6]/40">
        
        {/* Header Hero Banner */}
        <div className="bg-[#8893C2] p-8 text-white text-center relative overflow-hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#A7B0D6] rounded-[30px] mb-3 shadow-sm">
            <Sprout className="w-10 h-10 text-white animate-pulse" />
          </div>

          <h1 className="text-2xl font-black tracking-tight font-mono text-white">
            PanelaPró
          </h1>
          <p className="text-white/90 text-xs font-bold mt-1">
            Gestión Integral de Producción & Comercialización Panelera
          </p>
        </div>

        {/* Login Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-black text-black">Iniciar Sesión</h2>
            <p className="text-xs text-black/60 font-medium mt-1">Acceda al panel de administración de su trapiche</p>
          </div>

          {errorMsg && (
            <div className="flex items-start space-x-2.5 p-3.5 bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#FF0000] rounded-[20px] text-xs font-bold animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-[#FF0000] shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-black mb-1.5">
                Usuario o Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black/50">
                  <UserIcon className="w-4 h-4 text-[#8893C2]" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ej. admin"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-sm font-bold text-black focus:ring-2 focus:ring-[#8893C2] focus:border-[#8893C2] transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-black mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black/50">
                  <Lock className="w-4 h-4 text-[#8893C2]" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-sm font-bold text-black focus:ring-2 focus:ring-[#8893C2] focus:border-[#8893C2] transition"
                />
              </div>
            </div>

            {/* Remember Session */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-black/70 cursor-pointer font-semibold">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="w-4 h-4 text-[#8893C2] focus:ring-[#8893C2] border-[#A7B0D6] rounded"
                />
                <span>Recordar sesión activa</span>
              </label>
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-[#8893C2] font-bold hover:underline"
              >
                Cargar Demo
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-[#8893C2] hover:bg-[#7782B1] text-white font-bold text-sm rounded-[30px] shadow-md transition transform active:scale-98 flex items-center justify-center space-x-2 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-white" />
                  <span className="text-white">Ingresar a PanelaPró</span>
                </>
              )}
            </button>
          </form>

          {/* Preset Demo Box */}
          <div className="bg-[#A7B0D6]/15 border border-[#A7B0D6]/30 p-4 rounded-[20px] text-xs text-black flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-bold flex items-center gap-1 text-black">
                <ShieldCheck className="w-4 h-4 text-[#8893C2]" />
                Credenciales de Prueba:
              </p>
              <p className="font-mono text-[11px] text-black/80 font-bold">
                Usuario: <span className="text-[#8893C2]">admin</span> | Clave: <span className="text-[#8893C2]">123456</span>
              </p>
            </div>
            <button
              onClick={handleQuickDemoFill}
              className="px-3 py-1.5 bg-[#A7B0D6] hover:bg-[#959EC7] text-white font-bold rounded-[30px] text-[11px] transition shadow-xs"
            >
              Autocompletar
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="bg-white border-t border-[#A7B0D6]/30 p-4 text-center text-xs text-black/70">
          <p className="flex items-center justify-center gap-1 font-bold">
            <Building2 className="w-4 h-4 text-[#8893C2]" />
            Sistema certificado para Trapiches Paneleros Colombianos
          </p>
        </div>

      </div>
    </div>
  );
};
