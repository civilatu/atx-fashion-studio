/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { Sparkles, SlidersHorizontal, ShoppingBag, Scissors, Search, BarChart3, Database, Lock, Unlock, Crown, UserPlus } from 'lucide-react';
import { PinModal } from './PinModal';
import { ClientRegistrationModal } from '../client/ClientRegistrationModal';

export const TopBar: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    activeClientView,
    setActiveClientView,
    activeStudioTab,
    setActiveStudioTab,
    isStudioUnlocked,
    lockStudio,
    exportDatabaseJSON,
    isRegisterOpen,
    setIsRegisterOpen
  } = useAtelier();

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#121110]/95 backdrop-blur-md border-b border-[#D4AF37]/20 px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark with ATX Technologies Logo */}
        <button
          onClick={() => {
            if (viewMode === 'client') setActiveClientView('lookbook');
            else setActiveStudioTab('pipeline');
          }}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <img
            src="/assets/aistudio/WhatsApp_Image_2026-10-28_at_08.56.14_405778ba.jpeg"
            alt="ATX Technologies Logo"
            className="h-9 w-9 md:h-10 md:w-10 rounded-lg object-contain bg-white p-0.5 border border-[#D4AF37]/40 shadow-sm shrink-0"
          />
          <div>
            <span className="font-serif-luxury text-lg sm:text-xl md:text-2xl font-bold tracking-wider text-[#F4EFEA] group-hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 block leading-tight">
              ATX FASHION STUDIO
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#D4AF37]/80 uppercase block font-medium">
              Lagos · London
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 Navigation Links (Single-Line, Whitespace-Nowrap) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs tracking-wider uppercase font-medium">
          {viewMode === 'client' ? (
            <>
              <button
                onClick={() => setActiveClientView('lookbook')}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#D4AF37] ${
                  activeClientView === 'lookbook' ? 'text-[#D4AF37] font-semibold underline underline-offset-8 decoration-[#D4AF37]' : 'text-[#F4EFEA]/70'
                }`}
              >
                Lookbook & Heritage
              </button>
              <button
                onClick={() => setActiveClientView('rtw')}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#D4AF37] ${
                  activeClientView === 'rtw' ? 'text-[#D4AF37] font-semibold underline underline-offset-8 decoration-[#D4AF37]' : 'text-[#F4EFEA]/70'
                }`}
              >
                Ready-to-Wear
              </button>
              <button
                onClick={() => setActiveClientView('bespoke')}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#D4AF37] ${
                  activeClientView === 'bespoke' ? 'text-[#D4AF37] font-semibold underline underline-offset-8 decoration-[#D4AF37]' : 'text-[#F4EFEA]/70'
                }`}
              >
                Bespoke Studio
              </button>
              <button
                onClick={() => setActiveClientView('track')}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#D4AF37] ${
                  activeClientView === 'track' ? 'text-[#D4AF37] font-semibold underline underline-offset-8 decoration-[#D4AF37]' : 'text-[#F4EFEA]/70'
                }`}
              >
                Track Commission
              </button>
              <button
                onClick={() => setActiveClientView('styling')}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#D4AF37] ${
                  activeClientView === 'styling' ? 'text-[#D4AF37] font-semibold underline underline-offset-8 decoration-[#D4AF37]' : 'text-[#F4EFEA]/70'
                }`}
              >
                Styling Services
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveStudioTab('pipeline')}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#D4AF37] ${
                  activeStudioTab === 'pipeline' ? 'text-[#D4AF37] font-semibold underline underline-offset-8 decoration-[#D4AF37]' : 'text-[#F4EFEA]/70'
                }`}
              >
                Order Pipeline (10 Stages)
              </button>
              <button
                onClick={() => setActiveStudioTab('costing')}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#D4AF37] ${
                  activeStudioTab === 'costing' ? 'text-[#D4AF37] font-semibold underline underline-offset-8 decoration-[#D4AF37]' : 'text-[#F4EFEA]/70'
                }`}
              >
                Pricing & Margin Engine
              </button>
              <button
                onClick={() => setActiveStudioTab('measurements')}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#D4AF37] ${
                  activeStudioTab === 'measurements' ? 'text-[#D4AF37] font-semibold underline underline-offset-8 decoration-[#D4AF37]' : 'text-[#F4EFEA]/70'
                }`}
              >
                Measurement Vault
              </button>
              <button
                onClick={() => setActiveStudioTab('bulk')}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#D4AF37] ${
                  activeStudioTab === 'bulk' ? 'text-[#D4AF37] font-semibold underline underline-offset-8 decoration-[#D4AF37]' : 'text-[#F4EFEA]/70'
                }`}
              >
                Bulk & Uniform Hub
              </button>
              <button
                onClick={() => setActiveStudioTab('analytics')}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#D4AF37] ${
                  activeStudioTab === 'analytics' ? 'text-[#D4AF37] font-semibold underline underline-offset-8 decoration-[#D4AF37]' : 'text-[#F4EFEA]/70'
                }`}
              >
                Studio KPIs
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Mode Switch & Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Dual-Mode Applet Toggle with PIN Security */}
          {viewMode === 'client' ? (
            <button
              onClick={() => {
                if (isStudioUnlocked) {
                  setViewMode('studio');
                } else {
                  setIsPinModalOpen(true);
                }
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded border border-[#D4AF37]/40 bg-[#1C1A18] text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer"
              title="Restricted Studio OS (Protected by Master Tailor PIN)"
            >
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Studio OS</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('client')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/20 bg-[#1C1A18] text-[#F4EFEA]/80 hover:text-[#F4EFEA] hover:bg-white/5 transition-colors text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer"
                title="View storefront as client sees it"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Client View</span>
              </button>

              <button
                onClick={lockStudio}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer"
                title="Lock Studio OS and return to public storefront"
              >
                <Lock className="w-3 h-3" />
                <span className="hidden md:inline">Lock OS</span>
              </button>
            </div>
          )}

          {/* Primary CTA */}
          {viewMode === 'client' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#D4AF37]/60 bg-[#1C1A18] hover:bg-[#D4AF37]/15 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                title="Register as a new ATX VIP Patron (10% Welcome Voucher)"
              >
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Join VIP</span>
                <span className="text-[10px] bg-[#D4AF37]/20 px-1 py-0.5 rounded text-[#D4AF37] font-mono hidden md:inline">10% Off</span>
              </button>

              <button
                onClick={() => setActiveClientView('bespoke')}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#121110] bg-[#D4AF37] hover:bg-[#C59B27] rounded transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
              >
                Commission Bespoke
              </button>
            </div>
          ) : (
            <button
              onClick={exportDatabaseJSON}
              className="px-3.5 py-2 text-xs font-medium uppercase tracking-wider text-[#F4EFEA] bg-[#2A2624] hover:bg-[#36312E] border border-white/10 rounded transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Backup Data</span>
            </button>
          )}
        </div>
      </div>

      {/* PIN Security Modal */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => {
          setIsPinModalOpen(false);
          setViewMode('studio');
        }}
      />

      {/* New Client VIP Registration Modal */}
      <ClientRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </header>
  );
};
