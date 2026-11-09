/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { CollectionTier, GarmentCategory } from '../../types/atelier';
import { Calculator, DollarSign, Check, Copy, ArrowRight, ShieldCheck, PieChart, Sparkles } from 'lucide-react';

export const CostCalculator: React.FC = () => {
  const { calculatePricing, createOrder, showToast, setActiveStudioTab } = useAtelier();

  // Garment Context
  const [garmentTitle, setGarmentTitle] = useState('Custom Senator Kaftan 2-Piece');
  const [clientName, setClientName] = useState('Alhaji Musa Danjuma');
  const [clientPhone, setClientPhone] = useState('+234 803 111 2233');
  const [tier, setTier] = useState<CollectionTier>('classic');
  const [category, setCategory] = useState<GarmentCategory>('mens_traditional');

  // Pricing Inputs
  const [fabricYardage, setFabricYardage] = useState<number>(4.5);
  const [fabricCostPerYard, setFabricCostPerYard] = useState<number>(8500);
  const [notionsCost, setNotionsCost] = useState<number>(9500); // lining, zippers, buttons, canvas, thread
  const [embroideryCost, setEmbroideryCost] = useState<number>(12000);
  const [laborHours, setLaborHours] = useState<number>(14);
  const [laborHourlyRate, setLaborHourlyRate] = useState<number>(1800);
  const [packagingCost, setPackagingCost] = useState<number>(4500);
  const [markupPercent, setMarkupPercent] = useState<number>(35);
  const [depositPercent, setDepositPercent] = useState<number>(60);

  const breakdown = calculatePricing({
    fabricYardage,
    fabricCostPerYard,
    notionsCost,
    embroideryCost,
    laborHours,
    laborHourlyRate,
    packagingCost,
    markupPercent,
    depositPercent
  });

  const grossProfit = breakdown.recommendedRetailPrice - breakdown.totalCost;
  const grossMarginPercent = Math.round((grossProfit / breakdown.recommendedRetailPrice) * 100);

  const handleCopyQuote = () => {
    const text = `*ATX FASHION STUDIO — COST-BASED FORMAL QUOTE*
Garment: ${garmentTitle} (${tier.toUpperCase()} TIER)
Client: ${clientName}

*Direct Production Breakdown:*
• Fabric (${fabricYardage} yds @ ₦${fabricCostPerYard.toLocaleString()}/yd): ₦${breakdown.fabricTotal.toLocaleString()}
• Interfacing, Notions & Lining: ₦${breakdown.notionsAndTrimsCost.toLocaleString()}
• Embroidery & Bullion Detailing: ₦${breakdown.embroideryCost.toLocaleString()}
• Master Tailor Labor (${laborHours} hrs): ₦${breakdown.tailorLaborCost.toLocaleString()}
• Packaging & Studio Overhead: ₦${(breakdown.packagingAndTagsCost + breakdown.studioOverheadShare).toLocaleString()}
-----------------------------------
*Total ATX Production Cost:* ₦${breakdown.totalCost.toLocaleString()}
*Quoted Retail Investment:* ₦${breakdown.recommendedRetailPrice.toLocaleString()}

*Required Initial Working Deposit (${depositPercent}%):* ₦${breakdown.requiredDepositAmount.toLocaleString()}
*Balance Due on Final Fitting:* ₦${(breakdown.recommendedRetailPrice - breakdown.requiredDepositAmount).toLocaleString()}

_Valid for 14 days. Material costs confirmed at deposit receipt._`;

    navigator.clipboard.writeText(text);
    showToast('Quote copied to clipboard in Nigerian WhatsApp format!', 'success');
  };

  const handleCreateOrderFromQuote = () => {
    createOrder({
      clientName: clientName.trim() || 'Private Client',
      clientPhone: clientPhone.trim() || '+234 800 000 0000',
      division: 'custom_tailoring',
      garmentCategory: category,
      garmentTitle,
      tier,
      stage: 1, // Inquiry
      targetDeliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      fabricSource: 'atelier_sourced',
      fabricDescription: `${fabricYardage} yards textile with ${tier} finish`,
      colorPalette: 'Selected during fabric procurement',
      costBreakdown: breakdown,
      quotedPrice: breakdown.recommendedRetailPrice,
      depositAmount: breakdown.requiredDepositAmount,
      depositPaid: false,
      finalPaymentPaid: false,
      assignedTailorType: 'in_house',
      assignedTailorName: 'Master Ibrahim (Lead Artisan)',
      qualityCheckPassed: false
    });

    setActiveStudioTab('pipeline');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-8">
      {/* Title & PRD Context */}
      <div className="space-y-1">
        <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
          Section 8 · Pricing and Revenue Model
        </span>
        <h1 className="font-serif-luxury text-2xl md:text-3xl text-[#F4EFEA]">
          Cost-Based Pricing & Working Deposit Engine
        </h1>
        <p className="text-xs sm:text-sm text-[#F4EFEA]/70 max-w-2xl">
          Engineered to prevent under-pricing, calculate exact tailor labor, allocate overhead, and establish mandatory 60% client deposits to fund fabric purchases upfront.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Parameters (Left Column) */}
        <div className="lg:col-span-7 space-y-6 bg-[#181615] border border-white/10 rounded-xl p-6">
          <h2 className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            <span>Garment & Direct Production Parameters</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Garment Title</label>
              <input
                type="text"
                value={garmentTitle}
                onChange={(e) => setGarmentTitle(e.target.value)}
                className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          {/* Tier Buttons */}
          <div className="space-y-1.5">
            <label className="block text-[11px] text-[#F4EFEA]/70">Collection Tier</label>
            <div className="grid grid-cols-3 gap-2">
              {(['affordable', 'classic', 'premium'] as CollectionTier[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTier(t);
                    if (t === 'affordable') setMarkupPercent(20);
                    if (t === 'classic') setMarkupPercent(35);
                    if (t === 'premium') setMarkupPercent(50);
                  }}
                  className={`py-1.5 px-3 rounded text-xs uppercase tracking-wider font-medium border transition-colors cursor-pointer ${
                    tier === t ? 'border-[#D4AF37] bg-[#D4AF37] text-[#121110]' : 'border-white/10 bg-[#121110] text-[#F4EFEA]/70'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Cost Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div>
              <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Fabric Quantity (Yards)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={fabricYardage}
                onChange={(e) => setFabricYardage(Math.max(0.5, parseFloat(e.target.value) || 0))}
                className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs font-mono text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Fabric Cost Per Yard (₦)</label>
              <input
                type="number"
                step="500"
                value={fabricCostPerYard}
                onChange={(e) => setFabricCostPerYard(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs font-mono text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Notions, Trims, Lining & Zippers (₦)</label>
              <input
                type="number"
                step="500"
                value={notionsCost}
                onChange={(e) => setNotionsCost(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs font-mono text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Embroidery & Embellishment (₦)</label>
              <input
                type="number"
                step="500"
                value={embroideryCost}
                onChange={(e) => setEmbroideryCost(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs font-mono text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Tailor Sewing Hours</label>
              <input
                type="number"
                step="1"
                min="1"
                value={laborHours}
                onChange={(e) => setLaborHours(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs font-mono text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Tailor Hourly Rate (₦/hr)</label>
              <input
                type="number"
                step="100"
                value={laborHourlyRate}
                onChange={(e) => setLaborHourlyRate(Math.max(500, parseInt(e.target.value) || 500))}
                className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs font-mono text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Packaging & Delivery (₦)</label>
              <input
                type="number"
                step="500"
                value={packagingCost}
                onChange={(e) => setPackagingCost(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs font-mono text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Target Markup Margin (%)</label>
              <input
                type="number"
                step="5"
                min="10"
                max="200"
                value={markupPercent}
                onChange={(e) => setMarkupPercent(Math.max(5, parseInt(e.target.value) || 10))}
                className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs font-mono text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live Calculation Output Card (Right Column) */}
        <div className="lg:col-span-5 space-y-6 bg-gradient-to-b from-[#1C1A18] to-[#121110] border border-[#D4AF37]/40 rounded-xl p-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
              Live Financial Projection
            </span>
            <span className="text-xs font-mono text-[#10B981] font-semibold">
              +{grossMarginPercent}% Margin
            </span>
          </div>

          {/* Total Cost Breakdown */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-[#F4EFEA]/70">
              <span>Fabric Total ({fabricYardage} yds):</span>
              <span className="font-mono tabular-nums">₦{breakdown.fabricTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#F4EFEA]/70">
              <span>Notions, Trims & Interfacing:</span>
              <span className="font-mono tabular-nums">₦{breakdown.notionsAndTrimsCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#F4EFEA]/70">
              <span>Embroidery / Detailing:</span>
              <span className="font-mono tabular-nums">₦{breakdown.embroideryCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#F4EFEA]/70">
              <span>Tailor Direct Labor:</span>
              <span className="font-mono tabular-nums">₦{breakdown.tailorLaborCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#F4EFEA]/70">
              <span>Packaging & Studio Overhead:</span>
              <span className="font-mono tabular-nums">₦{(breakdown.packagingAndTagsCost + breakdown.studioOverheadShare).toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10 font-medium text-[#F4EFEA]">
              <span>Total Production Cost:</span>
              <span className="font-mono text-[#F4EFEA]">₦{breakdown.totalCost.toLocaleString()}</span>
            </div>
          </div>

          {/* Recommended Retail Price Banner */}
          <div className="p-4 rounded-lg bg-[#221F1C] border border-[#D4AF37]/30 text-center space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#F4EFEA]/50 block">
              Recommended Retail Price (₦)
            </span>
            <div className="font-mono text-3xl font-bold text-[#D4AF37] tabular-nums">
              ₦{breakdown.recommendedRetailPrice.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#10B981] font-medium block">
              Estimated Net Profit: ₦{grossProfit.toLocaleString()}
            </span>
          </div>

          {/* Working Capital Deposit Safeguard */}
          <div className="p-4 rounded-lg bg-[#121110] border border-[#10B981]/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#10B981]">
              <ShieldCheck className="w-4 h-4" />
              <span>Mandatory Working Deposit (60%)</span>
            </div>
            <p className="text-[11px] text-[#F4EFEA]/70">
              Securing ₦{breakdown.requiredDepositAmount.toLocaleString()} upfront covers 100% of fabric (₦{breakdown.fabricTotal.toLocaleString()}) and trims, ensuring zero working capital risk.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleCopyQuote}
              className="w-full py-2.5 bg-[#1C1A18] hover:bg-[#2A2624] text-[#F4EFEA] border border-white/10 rounded text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Copy WhatsApp Quote</span>
            </button>

            <button
              onClick={handleCreateOrderFromQuote}
              className="w-full py-3 bg-[#D4AF37] hover:bg-[#C59B27] text-[#121110] rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Initialize Order from Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
