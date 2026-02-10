
import React from 'react';
import { useToastStore } from '../../store/useToastStore';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();
  
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          className={`pointer-events-auto flex items-center p-3 rounded-lg shadow-xl border animate-in slide-in-from-right-5 fade-in duration-300 max-w-xs ${
            toast.type === 'success' ? 'bg-emerald-900/90 border-emerald-500 text-emerald-100' :
            toast.type === 'error' ? 'bg-red-900/90 border-red-500 text-red-100' :
            'bg-slate-800/90 border-slate-600 text-slate-100'
          }`}
        >
          {toast.type === 'success' && <CheckCircle size={18} className="mr-2 text-emerald-400" />}
          {toast.type === 'error' && <AlertCircle size={18} className="mr-2 text-red-400" />}
          {toast.type === 'info' && <Info size={18} className="mr-2 text-blue-400" />}
          <div className="text-xs font-medium mr-4">{toast.message}</div>
          <button onClick={() => removeToast(toast.id)} className="text-white/50 hover:text-white ml-auto">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
