/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { Lock, KeyRound, X, ShieldAlert, Sparkles } from 'lucide-react';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { unlockStudio } = useAtelier();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin.length < 4) return;

    const ok = unlockStudio(pin);
    if (ok) {
      setPin('');
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleKeyPress = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        // Auto-check on 4 digits
        setTimeout(() => {
          const ok = unlockStudio(nextPin);
          if (ok) {
            setPin('');
            setError(false);
            onSuccess();
          } else {
            setError(true);
            setPin('');
            setTimeout(() => setError(false), 2000);
          }
        }, 100);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div
        className={`bg-[#181615] border border-[#D4AF37]/50 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl relative transition-transform ${
          error ? 'border-red-500 animate-shake' : ''
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#F4EFEA]/60 hover:text-[#F4EFEA] rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon */}
        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="font-serif-luxury text-xl text-[#F4EFEA]">
          Studio OS Authorization
        </h3>
        <p className="text-xs text-[#F4EFEA]/65 mt-1.5 leading-relaxed">
          Enter your 4-digit Master Tailor PIN to access internal production pipelines, cost calculations, and client records.
        </p>

        {/* PIN Indicators */}
        <div className="flex justify-center items-center gap-3 my-6">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  isFilled
                    ? 'bg-[#D4AF37] border-[#D4AF37] scale-110 shadow-[0_0_8px_rgba(212,175,55,0.6)]'
                    : error
                    ? 'border-red-500 bg-red-500/20'
                    : 'border-white/20 bg-[#121110]'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-red-400 mb-4 animate-in fade-in">
            <ShieldAlert className="w-4 h-4" />
            <span>Incorrect PIN. Please re-enter.</span>
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="h-11 rounded-xl bg-[#221F1C] hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/40 text-base font-semibold text-[#F4EFEA] transition-all cursor-pointer active:scale-95"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPin('')}
            className="h-11 rounded-xl bg-[#221F1C] hover:bg-white/10 border border-white/10 text-xs font-medium text-[#F4EFEA]/60 transition-all cursor-pointer"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-11 rounded-xl bg-[#221F1C] hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/40 text-base font-semibold text-[#F4EFEA] transition-all cursor-pointer active:scale-95"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => setPin((prev) => prev.slice(0, -1))}
            className="h-11 rounded-xl bg-[#221F1C] hover:bg-white/10 border border-white/10 text-xs font-medium text-[#F4EFEA]/60 transition-all cursor-pointer"
          >
            Del
          </button>
        </div>

        {/* Default PIN Helper for initial setup */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-[#F4EFEA]/50">
          <span>Default Studio PIN: <strong className="text-[#D4AF37] font-mono">2026</strong></span>
          <button
            onClick={onClose}
            className="text-[#D4AF37] hover:underline cursor-pointer"
          >
            Return to Store
          </button>
        </div>
      </div>
    </div>
  );
};
