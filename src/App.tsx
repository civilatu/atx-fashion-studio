/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AtelierProvider, useAtelier } from './context/AtelierContext';
import { TopBar } from './components/common/TopBar';
import { ToastContainer } from './components/common/ToastContainer';
import { HeroSection } from './components/client/HeroSection';
import { RTWCollection } from './components/client/RTWCollection';
import { BespokeBuilder } from './components/client/BespokeBuilder';
import { OrderTracker } from './components/client/OrderTracker';
import { StylingConsultationModal } from './components/client/StylingConsultationModal';
import { PipelineKanban } from './components/studio/PipelineKanban';
import { CostCalculator } from './components/studio/CostCalculator';
import { MeasurementVault } from './components/studio/MeasurementVault';
import { BulkOrdersManager } from './components/studio/BulkOrdersManager';
import { StudioAnalytics } from './components/studio/StudioAnalytics';
import { Sparkles, MessageCircle, Heart, Phone, MapPin, Instagram } from 'lucide-react';

const AtelierMainContent: React.FC = () => {
  const {
    viewMode,
    activeClientView,
    setActiveClientView,
    activeStudioTab,
    setActiveStudioTab
  } = useAtelier();

  return (
    <div className="min-h-screen flex flex-col bg-[#121110] text-[#F4EFEA]">
      <TopBar />

      {/* Mode Status Banner (In Studio Mode) */}
      {viewMode === 'studio' && (
        <div className="bg-[#1C1A18] border-b border-[#D4AF37]/25 px-6 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#D4AF37] font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
              <span className="font-serif-luxury text-sm">ATX STUDIO OS (BACKSTAGE)</span>
              <span className="text-[10px] text-[#F4EFEA]/50 font-normal">| Lean Hybrid Production Mode</span>
            </div>

            {/* Mobile / Secondary Navigation Bar for Studio */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full py-0.5">
              {[
                { id: 'pipeline', label: '10-Stage Pipeline' },
                { id: 'costing', label: 'Costing Engine' },
                { id: 'measurements', label: 'Measurement Vault' },
                { id: 'bulk', label: 'Bulk Hub' },
                { id: 'analytics', label: 'KPIs & Solvency' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveStudioTab(tab.id as any)}
                  className={`px-3 py-1 rounded text-[11px] font-medium uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeStudioTab === tab.id
                      ? 'bg-[#D4AF37] text-[#121110] font-semibold'
                      : 'text-[#F4EFEA]/70 hover:text-[#F4EFEA]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View Routing */}
      <main className="flex-1">
        {viewMode === 'client' ? (
          <>
            {activeClientView === 'lookbook' && <HeroSection />}
            {activeClientView === 'rtw' && <RTWCollection />}
            {activeClientView === 'bespoke' && <BespokeBuilder />}
            {activeClientView === 'track' && <OrderTracker />}
            {activeClientView === 'styling' && <StylingConsultationModal />}
          </>
        ) : (
          <>
            {activeStudioTab === 'pipeline' && <PipelineKanban />}
            {activeStudioTab === 'costing' && <CostCalculator />}
            {activeStudioTab === 'measurements' && <MeasurementVault />}
            {activeStudioTab === 'bulk' && <BulkOrdersManager />}
            {activeStudioTab === 'analytics' && <StudioAnalytics />}
          </>
        )}
      </main>

      {/* Luxury ATX Footer */}
      <footer className="border-t border-white/10 bg-[#0C0B0A] text-[#F4EFEA]/70 text-xs py-12 px-6 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-10-28_at_08.56.14_405778ba.jpeg"
                alt="ATX Technologies Logo"
                className="h-10 w-10 rounded-lg object-contain bg-white p-0.5 border border-[#D4AF37]/40 shadow-sm shrink-0"
              />
              <span className="font-serif-luxury text-lg font-bold text-[#F4EFEA] tracking-wider block">
                ATX FASHION STUDIO
              </span>
            </div>
            <p className="text-xs text-[#F4EFEA]/60 leading-relaxed">
              Modern Elegance Meets African Luxury. Independent fashion house offering bespoke tailoring, ready-to-wear collections, and institutional production.
            </p>
            <div className="flex items-center gap-3 text-[#D4AF37] pt-1">
              <span className="text-[11px] uppercase tracking-wider">Lagos Studio</span>
              <span>·</span>
              <span className="text-[11px] uppercase tracking-wider">London Concierge</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold uppercase tracking-wider text-[#D4AF37] text-[11px]">
              Principal Divisions
            </h4>
            <ul className="space-y-1.5 text-xs text-[#F4EFEA]/70">
              <li>Custom Fashion Design & Bespoke Agbada</li>
              <li>Ready-to-Wear (Affordable, Classic, Premium)</li>
              <li>Institutional & Corporate Uniform Production</li>
              <li>Personal Wardrobe Styling & Event Curation</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold uppercase tracking-wider text-[#D4AF37] text-[11px]">
              ATX Craft Standards
            </h4>
            <ul className="space-y-1.5 text-xs text-[#F4EFEA]/70">
              <li>Rigorous 10-Point Garment Inspection</li>
              <li>Authentic Nigerian Aso-Oke & Dutch Wax</li>
              <li>Mandatory 60% Secured Deposit Policy</li>
              <li>Vetted Master Tailor Network</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold uppercase tracking-wider text-[#D4AF37] text-[11px]">
              Client Concierge & Inquiries
            </h4>
            <p className="text-xs text-[#F4EFEA]/60 leading-relaxed">
              For bespoke appointments, fabric swatches, or institutional orders, connect directly with our studio desk at <span className="text-[#D4AF37] font-mono font-medium">08150882291</span>.
            </p>
            <a
              href="https://wa.me/2348150882291"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#1C1A18] hover:bg-[#2A2624] text-[#D4AF37] border border-[#D4AF37]/30 rounded text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Studio Desk (08150882291)</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#F4EFEA]/40">
          <div>
            © {new Date().getFullYear()} ATX FASHION STUDIO. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Modern Elegance Meets African Luxury</span>
            <span>·</span>
            <span>Initial Lean Seed Range: ₦0–₦200,000</span>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AtelierProvider>
      <AtelierMainContent />
    </AtelierProvider>
  );
}
