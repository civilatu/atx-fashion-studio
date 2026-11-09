/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { ArrowRight, Sparkles, Scissors, ShieldCheck, Ruler } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setActiveClientView, rtwItems } = useAtelier();

  return (
    <div className="space-y-16 pb-16">
      {/* Editorial Split Hero */}
      <section className="relative overflow-hidden pt-8 md:pt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Brand Thesis & Direct Actions */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#D4AF37] font-semibold">
                <span className="w-6 h-[1px] bg-[#D4AF37]"></span>
                <span>Independent Fashion House & Design Studio</span>
              </div>

              <h1 className="font-serif-luxury text-4xl sm:text-5xl xl:text-6xl text-[#F4EFEA] leading-[1.08] tracking-tight text-balance">
                Modern Elegance Meets African Luxury
              </h1>

              <p className="text-sm sm:text-base text-[#F4EFEA]/80 leading-relaxed max-w-xl">
                Combining centuries of rich Nigerian textile heritage—from intricate handwoven Aso-Oke and vibrant Ankara wax to regal Senegalese damask—with clean contemporary silhouettes and bespoke Savile Row tailoring precision.
              </p>

              {/* Direct Action Group */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActiveClientView('bespoke')}
                  className="px-6 py-3.5 bg-[#D4AF37] hover:bg-[#C59B27] text-[#121110] text-xs font-semibold uppercase tracking-wider rounded transition-all shadow-lg flex items-center gap-2 group cursor-pointer"
                >
                  <span>Commission Bespoke</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActiveClientView('rtw')}
                  className="px-6 py-3.5 bg-[#1C1A18] hover:bg-[#2A2624] text-[#F4EFEA] border border-[#D4AF37]/30 text-xs font-medium uppercase tracking-wider rounded transition-all cursor-pointer"
                >
                  Explore Ready-to-Wear
                </button>
              </div>

              {/* Trust & Guarantee Markers */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#F4EFEA]/60">
                <span className="flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Precision Body Fit Guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  60% Secured Deposit Model
                </span>
                <span className="flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Hybrid Artisan ATX Studio
                </span>
              </div>
            </div>

            {/* Right Column: High-Fashion Visual Campaign Anchor */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-lg overflow-hidden border border-[#D4AF37]/20 shadow-2xl">
                <img
                  src="/src/assets/images/hero_african_luxury_couture_1794057022168.jpg"
                  alt="ATX FASHION STUDIO Modern African Haute Couture Lookbook"
                  className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-transparent opacity-60"></div>
                
                {/* Visual Label (Clean Unboxed Metadata) */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-[#F4EFEA]/90 backdrop-blur-md bg-[#121110]/75 px-4 py-2.5 rounded border border-white/10">
                  <span className="font-serif-luxury tracking-wide">The Chieftaincy & Evening Ensemble 2026</span>
                  <span className="text-[#D4AF37] uppercase tracking-wider font-semibold">Haute Couture Tier</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Pillar ATX Strips (Human Editorial Numbering) */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-lg bg-[#181615] border border-white/5 space-y-2">
            <span className="text-xs font-serif-luxury text-[#D4AF37]">01. Custom Bespoke</span>
            <h3 className="text-sm font-semibold text-[#F4EFEA]">Made-to-Measure Tailoring</h3>
            <p className="text-xs text-[#F4EFEA]/65 leading-relaxed">
              Individually commissioned Agbada, Senator outfits, and evening dresses engineered to your exact anatomical proportions.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-[#181615] border border-white/5 space-y-2">
            <span className="text-xs font-serif-luxury text-[#D4AF37]">02. Curated RTW Tiers</span>
            <h3 className="text-sm font-semibold text-[#F4EFEA]">Three Finished Collections</h3>
            <p className="text-xs text-[#F4EFEA]/65 leading-relaxed">
              From accessible everyday African cotton tunics to signature classic wear and exclusive museum-grade Aso-Oke pieces.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-[#181615] border border-white/5 space-y-2">
            <span className="text-xs font-serif-luxury text-[#D4AF37]">03. Institutional Scale</span>
            <h3 className="text-sm font-semibold text-[#F4EFEA]">Bulk & Uniform Production</h3>
            <p className="text-xs text-[#F4EFEA]/65 leading-relaxed">
              Industrial cutting and contract production for schools, corporate front-of-house, hospitality, and religious organisations.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-[#181615] border border-white/5 space-y-2">
            <span className="text-xs font-serif-luxury text-[#D4AF37]">04. 10-Point Quality Audit</span>
            <h3 className="text-sm font-semibold text-[#F4EFEA]">Flawless Finishing Guarantee</h3>
            <p className="text-xs text-[#F4EFEA]/65 leading-relaxed">
              Every garment undergoes a mandatory 10-stage lifecycle with seam tension, collar symmetry, and hem inspections before dispatch.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Ready-to-Wear Preview Strip */}
      <section className="max-w-7xl mx-auto px-6 space-y-6">
        <div className="flex items-end justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-xs tracking-widest uppercase text-[#D4AF37]">Signature Pieces</span>
            <h2 className="font-serif-luxury text-2xl md:text-3xl text-[#F4EFEA]">Featured Ready-to-Wear</h2>
          </div>
          <button
            onClick={() => setActiveClientView('rtw')}
            className="text-xs uppercase tracking-wider text-[#D4AF37] hover:underline flex items-center gap-1 font-medium"
          >
            <span>View All Pieces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rtwItems.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveClientView('rtw')}
              className="group cursor-pointer rounded-lg overflow-hidden bg-[#181615] border border-white/5 hover:border-[#D4AF37]/40 transition-all flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#121110]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#121110]/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37]">
                  {item.tier} Collection
                </div>
              </div>
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#F4EFEA] group-hover:text-[#D4AF37] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#F4EFEA]/60 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-[#D4AF37] tabular-nums">
                    ₦{item.priceNGN.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-[#F4EFEA]/50 group-hover:text-[#F4EFEA] transition-colors">
                    Order Piece →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Craftsmanship & Lean Hybrid Studio Manifesto */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 md:p-12 rounded-xl bg-gradient-to-br from-[#1C1A18] to-[#121110] border border-[#D4AF37]/20">
          <div className="lg:col-span-5 aspect-[4/3] rounded-lg overflow-hidden border border-white/10">
            <img
              src="/src/assets/images/studio_tailoring_craftsmanship_1794057024690.jpg"
              alt="Artisanal Handcraft at ATX FASHION STUDIO"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">The Hybrid Production Model</span>
            <h2 className="font-serif-luxury text-2xl md:text-3xl text-[#F4EFEA] leading-snug">
              Master Craftsmanship Engineered for Sustainable Growth
            </h2>
            <p className="text-xs sm:text-sm text-[#F4EFEA]/75 leading-relaxed">
              Operating with disciplined capital efficiency, ATX FASHION STUDIO pairs in-house creative direction with vetted independent master artisans across Lagos. Every commission is funded through upfront client deposits—guaranteeing authentic materials, zero debt financing, and uncompromising finishing.
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
              <div>
                <span className="block font-mono text-xl font-bold text-[#D4AF37]">₦0–200k</span>
                <span className="text-[#F4EFEA]/50 uppercase tracking-wider text-[10px]">Lean Capital Model</span>
              </div>
              <div className="h-8 w-[1px] bg-white/10"></div>
              <div>
                <span className="block font-mono text-xl font-bold text-[#D4AF37]">60%</span>
                <span className="text-[#F4EFEA]/50 uppercase tracking-wider text-[10px]">Materials Deposit Ratio</span>
              </div>
              <div className="h-8 w-[1px] bg-white/10"></div>
              <div>
                <span className="block font-mono text-xl font-bold text-[#D4AF37]">10 Stages</span>
                <span className="text-[#F4EFEA]/50 uppercase tracking-wider text-[10px]">Strict Quality Assurance</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
