/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { RTWItem, CollectionTier } from '../../types/atelier';
import { TIER_LABELS } from '../../data/stageDefinitions';
import { Check, ShoppingBag, X, MessageSquare, ShieldCheck, Sparkles, Ruler, Building2, Copy } from 'lucide-react';

export const RTWCollection: React.FC = () => {
  const { rtwItems, createOrder, showToast, bankDetails } = useAtelier();
  const [selectedTier, setSelectedTier] = useState<CollectionTier | 'all'>('all');
  const [activeItem, setActiveItem] = useState<RTWItem | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideGender, setSizeGuideGender] = useState<'mens' | 'womens'>('mens');
  const [copiedBank, setCopiedBank] = useState(false);
  
  // Quick order modal state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copyAccount = () => {
    navigator.clipboard.writeText(bankDetails.accountNumber);
    setCopiedBank(true);
    showToast(`Copied ${bankDetails.bankName} Account (${bankDetails.accountNumber})`, 'success');
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const filteredItems = selectedTier === 'all' 
    ? rtwItems 
    : rtwItems.filter(item => item.tier === selectedTier);

  const handleOpenItem = (item: RTWItem) => {
    setActiveItem(item);
    setSelectedSize(item.availableSizes[0] || 'M');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;
    if (!clientName.trim() || !clientPhone.trim()) {
      showToast('Please provide your name and phone number', 'warning');
      return;
    }

    setIsSubmitting(true);
    const created = createOrder({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      division: 'ready_to_wear',
      garmentCategory: activeItem.category,
      garmentTitle: `${activeItem.title} (Size: ${selectedSize})`,
      tier: activeItem.tier,
      stage: 1, // Stage 1 Inquiry / Order initiated
      targetDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      fabricSource: 'atelier_sourced',
      fabricDescription: activeItem.fabric,
      colorPalette: 'As Featured in Catalog',
      specialInstructions: deliveryNotes.trim() ? `Delivery notes: ${deliveryNotes}` : undefined,
      quotedPrice: activeItem.priceNGN,
      depositAmount: activeItem.priceNGN,
      depositPaid: false,
      finalPaymentPaid: false,
      assignedTailorType: 'in_house',
      assignedTailorName: 'RTW Fulfillment Desk',
      qualityCheckPassed: true,
      costBreakdown: {
        fabricYardage: 4,
        fabricCostPerYard: Math.round(activeItem.priceNGN * 0.35 / 4),
        fabricTotal: Math.round(activeItem.priceNGN * 0.35),
        notionsAndTrimsCost: Math.round(activeItem.priceNGN * 0.1),
        embroideryCost: Math.round(activeItem.priceNGN * 0.1),
        tailorLaborCost: Math.round(activeItem.priceNGN * 0.25),
        packagingAndTagsCost: 3500,
        studioOverheadShare: Math.round(activeItem.priceNGN * 0.1),
        totalCost: Math.round(activeItem.priceNGN * 0.9),
        markupPercentage: 11,
        recommendedRetailPrice: activeItem.priceNGN,
        minimumRequiredDepositPercentage: 100,
        requiredDepositAmount: activeItem.priceNGN
      }
    });

    setIsSubmitting(false);
    setActiveItem(null);
    setClientName('');
    setClientPhone('');
    setDeliveryNotes('');

    // Prepare WhatsApp link
    const text = encodeURIComponent(
      `*ATX FASHION STUDIO — READY-TO-WEAR ORDER*\n` +
      `Hello, I would like to order the *${activeItem.title}* in size *${selectedSize}* (Ref: *${created.id}*).\n\n` +
      `• Patron: ${clientName.trim()}\n` +
      `• Price: ₦${activeItem.priceNGN.toLocaleString()}\n` +
      (deliveryNotes.trim() ? `• Delivery Address/Notes: ${deliveryNotes.trim()}\n\n` : `\n`) +
      `*Bank Payment Details:*\n` +
      `Bank: ${bankDetails.bankName}\n` +
      `Account: ${bankDetails.accountNumber}\n` +
      `Name: ${bankDetails.accountName}\n` +
      `Narration: Ref ${created.id}\n\n` +
      `I will send the payment transfer receipt to confirm dispatch.`
    );
    window.open(`https://wa.me/2348150882291?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      {/* Header & Philosophy */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
          Section 4.2 · Finished Studio Creations
        </span>
        <h1 className="font-serif-luxury text-3xl md:text-4xl text-[#F4EFEA]">
          Ready-to-Wear Collections
        </h1>
        <p className="text-xs sm:text-sm text-[#F4EFEA]/70 leading-relaxed">
          Designed, produced, and finished under the ATX Fashion Studio mark. Available across three transparent tiers to suit diverse styling occasions.
        </p>

        {/* Tier Selector & Size Guide */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <div className="inline-flex items-center gap-1 p-1 bg-[#1C1A18] rounded-lg border border-white/10">
            <button
              onClick={() => setSelectedTier('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedTier === 'all' ? 'bg-[#D4AF37] text-[#121110] font-semibold' : 'text-[#F4EFEA]/70 hover:text-[#F4EFEA]'
              }`}
            >
              All Collections
            </button>
            <button
              onClick={() => setSelectedTier('affordable')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedTier === 'affordable' ? 'bg-[#D4AF37] text-[#121110] font-semibold' : 'text-[#F4EFEA]/70 hover:text-[#F4EFEA]'
              }`}
            >
              Affordable
            </button>
            <button
              onClick={() => setSelectedTier('classic')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedTier === 'classic' ? 'bg-[#D4AF37] text-[#121110] font-semibold' : 'text-[#F4EFEA]/70 hover:text-[#F4EFEA]'
              }`}
            >
              Classic
            </button>
            <button
              onClick={() => setSelectedTier('premium')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedTier === 'premium' ? 'bg-[#D4AF37] text-[#121110] font-semibold' : 'text-[#F4EFEA]/70 hover:text-[#F4EFEA]'
              }`}
            >
              Premium Haute Couture
            </button>
          </div>

          <button
            onClick={() => setIsSizeGuideOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D4AF37]/40 bg-[#1C1A18] text-[#D4AF37] hover:bg-[#D4AF37]/15 transition-colors text-xs font-medium cursor-pointer"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Size Guide</span>
          </button>
        </div>
      </div>

      {/* Tier Explanation Card */}
      {selectedTier !== 'all' && (
        <div className="p-4 rounded-lg bg-[#181615] border border-[#D4AF37]/30 max-w-2xl mx-auto flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-[#D4AF37]">{TIER_LABELS[selectedTier].name}: </span>
            <span className="text-[#F4EFEA]/80">{TIER_LABELS[selectedTier].description}</span>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group rounded-xl overflow-hidden bg-[#181615] border border-white/10 hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between"
          >
            {/* Visual Box */}
            <div className="relative aspect-[4/3] bg-[#121110] overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-[#121110]/85 backdrop-blur-md px-3 py-1 rounded text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37] border border-white/10">
                {item.tier} Collection
              </div>
              <div className="absolute bottom-3 right-3 bg-[#121110]/85 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-[#F4EFEA]/80">
                {item.stockCount > 0 ? `${item.stockCount} in stock` : 'Made on Order'}
              </div>
            </div>

            {/* Information */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-[#F4EFEA]/50">
                  <span>{item.category.replace('_', ' ')}</span>
                  <span aria-hidden="true">·</span>
                  <span>Hand Finished</span>
                </div>
                <h3 className="font-serif-luxury text-lg text-[#F4EFEA] group-hover:text-[#D4AF37] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#F4EFEA]/70 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Fabric highlight */}
                <div className="pt-2 text-[11px] text-[#D4AF37]/90 font-medium">
                  Fabric: {item.fabric}
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#F4EFEA]/40">ATX Studio Price</span>
                  <span className="font-mono text-base font-bold text-[#F4EFEA] tabular-nums">
                    ₦{item.priceNGN.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenItem(item)}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C59B27] text-[#121110] text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
                >
                  Acquire Piece
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Item Detail / Quick Order Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#181615] border border-[#D4AF37]/40 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 p-1.5 text-[#F4EFEA]/60 hover:text-[#F4EFEA] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="rounded-lg overflow-hidden border border-white/10 aspect-[4/3]">
                <img
                  src={activeItem.image}
                  alt={activeItem.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-3">
                <span className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                  {activeItem.tier} Collection
                </span>
                <h2 className="font-serif-luxury text-xl text-[#F4EFEA]">
                  {activeItem.title}
                </h2>
                <div className="font-mono text-xl font-bold text-[#D4AF37] tabular-nums">
                  ₦{activeItem.priceNGN.toLocaleString()}
                </div>
                <p className="text-xs text-[#F4EFEA]/70 leading-relaxed">
                  {activeItem.description}
                </p>

                <div className="pt-2 text-xs space-y-1 text-[#F4EFEA]/80">
                  <div className="font-medium text-[#F4EFEA]">Highlights:</div>
                  {activeItem.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#F4EFEA]/70">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Order Form */}
            <form onSubmit={handlePlaceOrder} className="pt-4 border-t border-white/10 space-y-4">
              <h3 className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                Direct Commission / Order Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] text-[#F4EFEA]/70">Select Size</label>
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-[10px] text-[#D4AF37] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Ruler className="w-3 h-3" />
                      <span>Size Chart</span>
                    </button>
                  </div>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  >
                    {activeItem.availableSizes.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Babatunde Lawal"
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] placeholder-white/20 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Phone (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] placeholder-white/20 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Delivery Address or Special Notes (Optional)</label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Lekki Phase 1, Lagos. Need by Friday."
                  className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] placeholder-white/20 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Official Bank Deposit Card */}
              <div className="p-3.5 rounded-lg bg-[#121110] border border-[#D4AF37]/30 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#D4AF37]">
                  <div className="flex items-center gap-1.5 font-semibold text-[11px] uppercase tracking-wider">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Bank Transfer (Commitment Deposit)</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyAccount}
                    className="flex items-center gap-1 text-[11px] text-[#D4AF37] hover:underline cursor-pointer"
                  >
                    {copiedBank ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedBank ? 'Copied' : 'Copy NUBAN'}</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#F4EFEA]/80 pt-1">
                  <div>
                    <span className="text-[#F4EFEA]/40 block">Bank</span>
                    <span className="font-medium text-[#F4EFEA]">{bankDetails.bankName}</span>
                  </div>
                  <div>
                    <span className="text-[#F4EFEA]/40 block">Account Number</span>
                    <span className="font-mono font-bold text-[#D4AF37]">{bankDetails.accountNumber}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#F4EFEA]/40 block">Account Name</span>
                    <span className="font-medium text-[#F4EFEA]">{bankDetails.accountName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-[11px] text-[#F4EFEA]/50">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Attach receipt screenshot on WhatsApp</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#C59B27] text-[#121110] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Confirm & Open WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sizing Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#181615] border border-[#D4AF37]/50 rounded-xl max-w-2xl w-full p-6 md:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-[#F4EFEA]/60 hover:text-[#F4EFEA] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                Anatomical Fit Standards
              </span>
              <h2 className="font-serif-luxury text-2xl text-[#F4EFEA]">
                ATX Master Tailoring Size Guide
              </h2>
              <p className="text-xs text-[#F4EFEA]/70">
                All measurements are given in standard inches. For bespoke orders with unique posture, sleeve ease, or Agbada span, you can also book an in-person measurement session.
              </p>
            </div>

            {/* Gender Tab */}
            <div className="flex gap-2 border-b border-white/10 pb-3">
              <button
                type="button"
                onClick={() => setSizeGuideGender('mens')}
                className={`px-4 py-1.5 rounded text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors ${
                  sizeGuideGender === 'mens' ? 'bg-[#D4AF37] text-[#121110]' : 'text-[#F4EFEA]/60 hover:text-[#F4EFEA]'
                }`}
              >
                Men's Senator & Agbada
              </button>
              <button
                type="button"
                onClick={() => setSizeGuideGender('womens')}
                className={`px-4 py-1.5 rounded text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors ${
                  sizeGuideGender === 'womens' ? 'bg-[#D4AF37] text-[#121110]' : 'text-[#F4EFEA]/60 hover:text-[#F4EFEA]'
                }`}
              >
                Women's Gowns & Kaftans
              </button>
            </div>

            {/* Tables */}
            <div className="overflow-x-auto">
              {sizeGuideGender === 'mens' ? (
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#D4AF37]/20 text-[#D4AF37] uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Chest (in)</th>
                      <th className="py-2.5 px-3">Waist (in)</th>
                      <th className="py-2.5 px-3">Shoulder (in)</th>
                      <th className="py-2.5 px-3">Tunic Length (in)</th>
                      <th className="py-2.5 px-3">Trouser (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-[#F4EFEA]/90">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-[#D4AF37]">Small (S)</td>
                      <td className="py-2.5 px-3">38 – 40"</td>
                      <td className="py-2.5 px-3">30 – 32"</td>
                      <td className="py-2.5 px-3">17.5"</td>
                      <td className="py-2.5 px-3">38"</td>
                      <td className="py-2.5 px-3">39 – 40"</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-[#D4AF37]">Medium (M)</td>
                      <td className="py-2.5 px-3">41 – 43"</td>
                      <td className="py-2.5 px-3">33 – 35"</td>
                      <td className="py-2.5 px-3">18.5"</td>
                      <td className="py-2.5 px-3">40"</td>
                      <td className="py-2.5 px-3">41"</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-[#D4AF37]">Large (L)</td>
                      <td className="py-2.5 px-3">44 – 46"</td>
                      <td className="py-2.5 px-3">36 – 38"</td>
                      <td className="py-2.5 px-3">19.5"</td>
                      <td className="py-2.5 px-3">42"</td>
                      <td className="py-2.5 px-3">42"</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-[#D4AF37]">X-Large (XL)</td>
                      <td className="py-2.5 px-3">47 – 49"</td>
                      <td className="py-2.5 px-3">39 – 42"</td>
                      <td className="py-2.5 px-3">20.5"</td>
                      <td className="py-2.5 px-3">43"</td>
                      <td className="py-2.5 px-3">43"</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-[#D4AF37]">2X-Large (2XL)</td>
                      <td className="py-2.5 px-3">50 – 53"</td>
                      <td className="py-2.5 px-3">43 – 46"</td>
                      <td className="py-2.5 px-3">21.5"</td>
                      <td className="py-2.5 px-3">44"</td>
                      <td className="py-2.5 px-3">44"</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#D4AF37]/20 text-[#D4AF37] uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">UK Equivalent</th>
                      <th className="py-2.5 px-3">Bust (in)</th>
                      <th className="py-2.5 px-3">Waist (in)</th>
                      <th className="py-2.5 px-3">Hips (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-[#F4EFEA]/90">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-[#D4AF37]">Small (S)</td>
                      <td className="py-2.5 px-3">UK 8 – 10</td>
                      <td className="py-2.5 px-3">34 – 36"</td>
                      <td className="py-2.5 px-3">27 – 29"</td>
                      <td className="py-2.5 px-3">37 – 39"</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-[#D4AF37]">Medium (M)</td>
                      <td className="py-2.5 px-3">UK 12</td>
                      <td className="py-2.5 px-3">37 – 39"</td>
                      <td className="py-2.5 px-3">30 – 32"</td>
                      <td className="py-2.5 px-3">40 – 42"</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-[#D4AF37]">Large (L)</td>
                      <td className="py-2.5 px-3">UK 14 – 16</td>
                      <td className="py-2.5 px-3">40 – 43"</td>
                      <td className="py-2.5 px-3">33 – 36"</td>
                      <td className="py-2.5 px-3">43 – 46"</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-[#D4AF37]">X-Large (XL)</td>
                      <td className="py-2.5 px-3">UK 18</td>
                      <td className="py-2.5 px-3">44 – 47"</td>
                      <td className="py-2.5 px-3">37 – 40"</td>
                      <td className="py-2.5 px-3">47 – 50"</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>

            <div className="p-3.5 bg-[#121110] rounded-lg border border-white/5 text-xs text-[#F4EFEA]/70 flex items-center justify-between">
              <span>Need custom sizing or an in-person measurement session?</span>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-[#D4AF37] font-semibold hover:underline cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
