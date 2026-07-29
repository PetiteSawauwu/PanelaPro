import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Download, 
  Check, 
  FileCode, 
  Smartphone, 
  FolderTree, 
  Sparkles,
  Layers
} from 'lucide-react';
import { ANDROID_PROJECT_FILES, CodeFile } from '../data/androidProjectSource';

export const AndroidCodeExportModal: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(ANDROID_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    // Downloads all Kotlin files as single text blob or json bundle
    const combinedContent = ANDROID_PROJECT_FILES.map(f => `// =====================================================\n// FILE: ${f.path}\n// =====================================================\n${f.content}\n\n`).join('\n');
    const blob = new Blob([combinedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PanelaPro_AndroidStudio_Project_Kotlin.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-amber-900 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 bg-amber-400 text-emerald-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Código Nativo Android Studio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">
            Proyecto Android Nativo: PanelaPró (Kotlin + Compose)
          </h2>
          <p className="text-xs text-emerald-200 max-w-xl">
            Arquitectura MVVM, Jetpack Compose UI, Room Database (SQLite), StateFlow y Navigation Compose. Listo para compilar en Android Studio.
          </p>
        </div>

        <button
          onClick={handleDownloadAll}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Descargar Código Fuentes (.kt)</span>
        </button>
      </div>

      {/* Code Browser Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-emerald-950 text-emerald-100 rounded-2xl overflow-hidden border border-emerald-800 shadow-2xl min-h-[500px]">
        
        {/* Left File Tree Sidebar */}
        <div className="p-4 bg-emerald-950/80 border-b lg:border-b-0 lg:border-r border-emerald-800/80 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
            <FolderTree className="w-4 h-4" />
            <span>Archivos del Proyecto</span>
          </div>

          <div className="space-y-1 text-xs">
            {ANDROID_PROJECT_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center space-x-2 font-mono ${
                    isSelected
                      ? 'bg-amber-500 text-emerald-950 font-bold shadow-md'
                      : 'text-emerald-300 hover:bg-emerald-900/60 hover:text-white'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-emerald-800 text-[11px] text-emerald-400 space-y-1">
            <p className="font-bold text-emerald-200">Detalles del componente:</p>
            <p className="leading-relaxed">{selectedFile.description}</p>
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="lg:col-span-3 p-4 flex flex-col justify-between bg-stone-950 overflow-x-auto font-mono text-xs">
          
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center space-x-2">
              <span className="text-amber-400 font-bold">{selectedFile.path}</span>
              <span className="bg-stone-800 text-stone-300 text-[10px] px-2 py-0.5 rounded font-mono">
                {selectedFile.language.toUpperCase()}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-amber-300" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>
          </div>

          {/* Code Content Box */}
          <pre className="py-4 text-emerald-300/90 font-mono text-xs overflow-x-auto leading-relaxed max-h-[450px]">
            <code>{selectedFile.content}</code>
          </pre>

          <div className="pt-3 border-t border-stone-800 text-[11px] text-stone-500 flex justify-between items-center">
            <span>Android SDK 35 &bull; Kotlin 2.0 &bull; Jetpack Compose M3</span>
            <span>PanelaPró Mobile Suite</span>
          </div>

        </div>

      </div>

    </div>
  );
};
