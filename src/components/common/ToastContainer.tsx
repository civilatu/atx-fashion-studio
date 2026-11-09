/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useAtelier();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderColor = 'border-[#D4AF37]/50';
        let bgGradient = 'from-[#1C1A18] to-[#121110]';
        let Icon = CheckCircle2;
        let iconColor = 'text-[#D4AF37]';

        if (toast.type === 'warning') {
          borderColor = 'border-amber-500/60';
          Icon = AlertCircle;
          iconColor = 'text-amber-400';
        } else if (toast.type === 'info') {
          borderColor = 'border-blue-500/50';
          Icon = Info;
          iconColor = 'text-blue-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border ${borderColor} bg-gradient-to-r ${bgGradient} text-[#F4EFEA] shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-2`}
          >
            <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />
            <p className="text-xs leading-relaxed flex-1">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#F4EFEA]/50 hover:text-[#F4EFEA] transition-colors p-0.5 -mr-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
