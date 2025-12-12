import React from 'react';
import { FileText, ShieldCheck } from 'lucide-react';

export default function SplashView() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-base-100 text-base-content transition-colors duration-500">
      
      {/* CERCLE D'ARRIÈRE PLAN ANIMÉ */}
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-32 h-32 bg-primary/20 rounded-full animate-ping opacity-75"></div>
        <div className="relative w-24 h-24 bg-gradient-to-tr from-primary to-blue-600 rounded-2xl shadow-xl flex items-center justify-center animate-bounce-slow">
           <FileText className="w-12 h-12 text-white" />
        </div>
        
        {/* Badge Pro */}
        <div className="absolute -right-2 -top-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
            <ShieldCheck className="w-3 h-3" /> PRO
        </div>
      </div>

      {/* TITRE ET SOUS-TITRE */}
      <div className="text-center space-y-2 animate-fade-in-up">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">
          Facturier <span className="text-base-content">CI</span>
        </h1>
        <p className="text-sm font-medium text-base-content/60 uppercase tracking-widest">
          Chargement de vos données...
        </p>
      </div>

      {/* BARRE DE PROGRESSION */}
      <div className="mt-10 w-48 h-1.5 bg-base-200 rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-progress-bar rounded-full"></div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-6 text-xs text-base-content/30 font-mono">
        v1.0.0 • Mode Hors-ligne Sécurisé
      </div>

      {/* STYLES CSS LOCAUX POUR L'ANIMATION */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(5%); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress-bar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        .animate-progress-bar {
          animation: progress-bar 2.8s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}