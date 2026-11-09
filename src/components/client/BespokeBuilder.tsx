/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { GarmentCategory, CollectionTier } from '../../types/atelier';
import { Check, ArrowRight, ArrowLeft, Ruler, Sparkles, ShieldCheck, MessageCircle, Copy, Building2 } from 'lucide-react';

interface SilhouetteOption {
  id: string;
  title: string;
  category: GarmentCategory;
  defaultTier: CollectionTier;
  startingPriceNGN: number;
  estFabricYards: number;
  description: string;
  imageHint: string;
}

const SILHOUETTES: SilhouetteOption[] = [
  {
    id: 'agbada_3pc',
    title: 'Imperial Agbada 3-Piece',
    category: 'mens_traditional',
    defaultTier: 'premium',
    startingPriceNGN: 185000,
    estFabricYards: 7,
    description: 'Grand flowing outer robe, long-sleeved buba, tapered sokoto with matching Fila cap.',
    imageHint: 'Traditional Ceremony & Chieftaincy'
  },
  {
    id: 'senator_kaftan',
    title: 'The Sovereign Senator Suit',
    category: 'mens_traditional',
    defaultTier: 'classic',
    startingPriceNGN: 65000,
    estFabricYards: 4,
    description: 'Crisp mandarin neck kaftan tunic with tapered matching trousers.',
    imageHint: 'Executive & Formal African Wear'
  },
  {
    id: 'ankara_ball_gown',
    title: 'Runway Ankara Evening Gown',
    category: 'womens_contemporary',
    defaultTier: 'premium',
    startingPriceNGN: 135000,
    estFabricYards: 6,
    description: 'Structured corset bodice with flared silhouette and high-slit drape.',
    imageHint: 'Red Carpet & Gala Elegance'
  },
  {
    id: 'asooke_occasion',
    title: 'Traditional Aso-Oke Bridal / Groom',
    category: 'wedding_occasion',
    defaultTier: 'premium',
    startingPriceNGN: 240000,
    estFabricYards: 10,
    description: 'Handwoven Aso-Oke with metallic bullion thread and custom beadwork.',
    imageHint: 'Traditional Weddings & Milestone Events'
  },
  {
    id: 'corporate_kaftan_women',
    title: 'Modern Corporate Kaftan Set',
    category: 'womens_contemporary',
    defaultTier: 'classic',
    startingPriceNGN: 75000,
    estFabricYards: 4.5,
    description: 'Sleek collarless tunic with cigarette trousers in breathable cashmere blend.',
    imageHint: 'Executive Boardroom'
  },
  {
    id: 'bespoke_safari_shirt',
    title: 'Artisanal Safari & Trouser Pair',
    category: 'mens_contemporary',
    defaultTier: 'affordable',
    startingPriceNGN: 45000,
    estFabricYards: 3.5,
    description: 'Understated structured cotton four-pocket safari jacket and tailored trousers.',
    imageHint: 'Weekend Luxury & Smart Casual'
  }
];

export const BespokeBuilder: React.FC = () => {
  const { measurementCards, createOrder, calculatePricing, showToast, setActiveClientView, bankDetails } = useAtelier();
  const [copiedAccount, setCopiedAccount] = useState(false);

  const copyBankToClipboard = () => {
    navigator.clipboard.writeText(bankDetails.accountNumber);
    setCopiedAccount(true);
    showToast(`Copied ${bankDetails.bankName} Account (${bankDetails.accountNumber})`, 'success');
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [selectedSilhouette, setSelectedSilhouette] = useState<SilhouetteOption>(SILHOUETTES[1]);
  const [tier, setTier] = useState<CollectionTier>('classic');
  const [fabricSource, setFabricSource] = useState<'client_provided' | 'atelier_sourced'>('atelier_sourced');
  const [fabricType, setFabricType] = useState('Italian Cashmere Wool Blend');
  const [colorChoice, setColorChoice] = useState('Deep Midnight Navy');
  const [embroideryLevel, setEmbroideryLevel] = useState<'minimal' | 'moderate' | 'heavy_bullion'>('moderate');
  const [specialNotes, setSpecialNotes] = useState('');

  // Client Details & Measurements
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [measurementMode, setMeasurementMode] = useState<'vault' | 'manual' | 'schedule_in_person'>('manual');
  const [selectedVaultCardId, setSelectedVaultCardId] = useState<string>('');
  
  // Manual measurements
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [chestBust, setChestBust] = useState<string>('42');
  const [waist, setWaist] = useState<string>('36');
  const [hips, setHips] = useState<string>('42');
  const [shoulder, setShoulder] = useState<string>('18.5');
  const [sleeveLength, setSleeveLength] = useState<string>('25');
  const [trouserLength, setTrouserLength] = useState<string>('41');
  const [agbadaSpan, setAgbadaSpan] = useState<string>('64');

  // Live price calculation based on choices
  const getCalculatedFinancials = () => {
    let yardCost = fabricSource === 'client_provided' ? 0 : 8500;
    if (tier === 'premium') yardCost = 14000;
    if (tier === 'affordable') yardCost = 5000;

    let embroideryCost = 8000;
    if (embroideryLevel === 'minimal') embroideryCost = 4000;
    if (embroideryLevel === 'heavy_bullion') embroideryCost = 28000;

    let laborHours = 14;
    if (selectedSilhouette.id.includes('agbada') || selectedSilhouette.id.includes('asooke')) {
      laborHours = 24;
    }

    return calculatePricing({
      fabricYardage: selectedSilhouette.estFabricYards,
      fabricCostPerYard: yardCost,
      notionsCost: tier === 'premium' ? 18000 : 9000,
      embroideryCost,
      laborHours,
      laborHourlyRate: 1800,
      markupPercent: tier === 'premium' ? 40 : tier === 'classic' ? 30 : 20,
      depositPercent: 60
    });
  };

  const financials = getCalculatedFinancials();

  const handleCompleteCommission = () => {
    if (!clientName.trim() || !clientPhone.trim()) {
      showToast('Please provide your name and phone number', 'warning');
      return;
    }

    const created = createOrder({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim() || undefined,
      division: 'custom_tailoring',
      garmentCategory: selectedSilhouette.category,
      garmentTitle: `Bespoke ${selectedSilhouette.title}`,
      tier,
      stage: 1, // Stage 1 Inquiry
      targetDeliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      fabricSource,
      fabricDescription: `${fabricType} in ${colorChoice} (${embroideryLevel.replace('_', ' ')} embroidery)`,
      colorPalette: colorChoice,
      specialInstructions: specialNotes.trim() ? specialNotes : undefined,
      measurementCardId: measurementMode === 'vault' ? selectedVaultCardId : undefined,
      customMeasurementsSnapshot: measurementMode === 'manual' ? {
        chestOrBust: parseFloat(chestBust) || undefined,
        waist: parseFloat(waist) || undefined,
        fullHip: parseFloat(hips) || undefined,
        shoulderWidth: parseFloat(shoulder) || undefined,
        sleeveLength: parseFloat(sleeveLength) || undefined,
        trouserOrSkirtLength: parseFloat(trouserLength) || undefined,
        agbadaSpan: selectedSilhouette.id.includes('agbada') ? parseFloat(agbadaSpan) || undefined : undefined,
        unit
      } : undefined,
      quotedPrice: financials.recommendedRetailPrice,
      depositAmount: financials.requiredDepositAmount,
      depositPaid: false,
      finalPaymentPaid: false,
      assignedTailorType: tier === 'premium' ? 'external_partner' : 'in_house',
      assignedTailorName: tier === 'premium' ? 'Lead Master Tailor (Bespoke Frame)' : 'In-House Studio Artisan',
      qualityCheckPassed: false,
      costBreakdown: financials
    });

    // WhatsApp Message
    const text = encodeURIComponent(
      `*ATX FASHION STUDIO BESPOKE COMMISSION*\n` +
      `Hello, I have submitted a bespoke commission for the *${selectedSilhouette.title}* (Ref: *${created.id}*).\n\n` +
      `• Patron: ${clientName.trim()}\n` +
      `• Garment: ${selectedSilhouette.title} (${tier.toUpperCase()} Tier)\n` +
      `• Fabric: ${fabricType} (${colorChoice})\n` +
      `• Quoted Value: ₦${financials.recommendedRetailPrice.toLocaleString()}\n` +
      `• Working Deposit (60%): ₦${financials.requiredDepositAmount.toLocaleString()}\n\n` +
      `*Bank Payment Details:*\n` +
      `Bank: ${bankDetails.bankName}\n` +
      `Account: ${bankDetails.accountNumber}\n` +
      `Name: ${bankDetails.accountName}\n` +
      `Narration: Ref ${created.id}\n\n` +
      `I will send my transfer receipt once payment is completed to begin fabric procurement.`
    );

    window.open(`https://wa.me/2348150882291?text=${text}`, '_blank');
    setActiveClientView('track');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
          Section 4.1 · Bespoke Tailoring Studio
        </span>
        <h1 className="font-serif-luxury text-3xl md:text-4xl text-[#F4EFEA]">
          Commission a Bespoke Creation
        </h1>
        <p className="text-xs sm:text-sm text-[#F4EFEA]/70 max-w-xl mx-auto">
          Tailored individually to your body geometry and personal aesthetic. Step through silhouette, fabric selection, and anatomical sizing.
        </p>

        {/* Wizard Step Indicator */}
        <div className="flex items-center justify-center gap-2 pt-4">
          {[
            { num: 1, label: 'Silhouette' },
            { num: 2, label: 'Fabric & Styling' },
            { num: 3, label: 'Measurements' },
            { num: 4, label: 'Quotation' }
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-mono font-semibold transition-colors ${
                  step === s.num
                    ? 'bg-[#D4AF37] text-[#121110]'
                    : step > s.num
                    ? 'bg-[#10B981] text-[#121110]'
                    : 'bg-[#1C1A18] text-[#F4EFEA]/40 border border-white/10'
                }`}
              >
                {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className={`text-[11px] uppercase tracking-wider ${step === s.num ? 'text-[#D4AF37] font-semibold' : 'text-[#F4EFEA]/40'}`}>
                {s.label}
              </span>
              {s.num < 4 && <span className="w-4 h-[1px] bg-white/10"></span>}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Silhouette Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SILHOUETTES.map((sil) => {
              const isSelected = selectedSilhouette.id === sil.id;
              return (
                <div
                  key={sil.id}
                  onClick={() => {
                    setSelectedSilhouette(sil);
                    setTier(sil.defaultTier);
                  }}
                  className={`p-5 rounded-xl bg-[#181615] border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected ? 'border-[#D4AF37] bg-[#221F1C] ring-1 ring-[#D4AF37]/50' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-[#D4AF37]">
                      <span className="font-semibold uppercase tracking-wider">{sil.imageHint}</span>
                      <span className="text-[#F4EFEA]/50">~{sil.estFabricYards} yds</span>
                    </div>

                    <h3 className="font-serif-luxury text-lg text-[#F4EFEA]">
                      {sil.title}
                    </h3>

                    <p className="text-xs text-[#F4EFEA]/70 leading-relaxed">
                      {sil.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-4">
                    <div>
                      <span className="block text-[10px] text-[#F4EFEA]/40 uppercase tracking-wider">Starts From</span>
                      <span className="font-mono text-sm font-bold text-[#D4AF37] tabular-nums">
                        ₦{sil.startingPriceNGN.toLocaleString()}
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-white/20'}`}>
                      {isSelected && <Check className="w-3 h-3 text-[#121110]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C59B27] text-[#121110] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Fabric & Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Fabric & Styling Preferences */}
      {step === 2 && (
        <div className="space-y-6 max-w-2xl mx-auto bg-[#181615] border border-white/10 rounded-xl p-6 md:p-8">
          <div className="space-y-4">
            <h2 className="font-serif-luxury text-xl text-[#F4EFEA]">
              Fabric Sourcing & Styling Details
            </h2>

            {/* Fabric Source Toggle */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#F4EFEA]/80">Fabric Procurement</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFabricSource('atelier_sourced')}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                    fabricSource === 'atelier_sourced' ? 'border-[#D4AF37] bg-[#221F1C]' : 'border-white/10 bg-[#121110]'
                  }`}
                >
                  <span className="block text-xs font-semibold text-[#F4EFEA]">ATX Sourced</span>
                  <span className="text-[11px] text-[#F4EFEA]/60">We curate premium imported cashmere, silk, or Aso-Oke.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFabricSource('client_provided')}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                    fabricSource === 'client_provided' ? 'border-[#D4AF37] bg-[#221F1C]' : 'border-white/10 bg-[#121110]'
                  }`}
                >
                  <span className="block text-xs font-semibold text-[#F4EFEA]">Client Supplied</span>
                  <span className="text-[11px] text-[#F4EFEA]/60">You deliver your own fabric yards to our studio.</span>
                </button>
              </div>
            </div>

            {/* Collection Tier */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#F4EFEA]/80">Finishing Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {(['affordable', 'classic', 'premium'] as CollectionTier[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTier(t)}
                    className={`py-2 px-3 rounded text-xs font-medium uppercase tracking-wider cursor-pointer border transition-colors ${
                      tier === t ? 'border-[#D4AF37] bg-[#D4AF37] text-[#121110]' : 'border-white/10 bg-[#121110] text-[#F4EFEA]/70'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric Material Type */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-[#F4EFEA]/80">Preferred Fabric Type</label>
              <input
                type="text"
                value={fabricType}
                onChange={(e) => setFabricType(e.target.value)}
                placeholder="e.g. Italian Cashmere, Handwoven Aso-Oke, 100% Cotton Damask"
                className="w-full bg-[#121110] border border-white/10 rounded px-3.5 py-2.5 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Color Tone */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-[#F4EFEA]/80">Colorway / Palette Preference</label>
              <input
                type="text"
                value={colorChoice}
                onChange={(e) => setColorChoice(e.target.value)}
                placeholder="e.g. Deep Obsidian Navy, Warm Terracotta, Regal Emerald"
                className="w-full bg-[#121110] border border-white/10 rounded px-3.5 py-2.5 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Embroidery Level */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#F4EFEA]/80">Embroidery & Embellishment</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'minimal', label: 'Minimal Collar' },
                  { id: 'moderate', label: 'Signature Placket' },
                  { id: 'heavy_bullion', label: 'Royal Bullion Chest' }
                ].map((emb) => (
                  <button
                    key={emb.id}
                    type="button"
                    onClick={() => setEmbroideryLevel(emb.id as any)}
                    className={`py-2 px-3 rounded text-xs font-medium cursor-pointer border transition-colors ${
                      embroideryLevel === emb.id ? 'border-[#D4AF37] bg-[#221F1C] text-[#D4AF37]' : 'border-white/10 bg-[#121110] text-[#F4EFEA]/60'
                    }`}
                  >
                    {emb.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-[#F4EFEA]/80">Special Tailoring Notes (Optional)</label>
              <textarea
                rows={2}
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g., Hidden smartphone pocket in trousers, extra 1 inch sleeve ease, high collar stand."
                className="w-full bg-[#121110] border border-white/10 rounded px-3.5 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs text-[#F4EFEA]/60 hover:text-[#F4EFEA] flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#C59B27] text-[#121110] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Sizing & Measurements</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Anatomical Measurements */}
      {step === 3 && (
        <div className="space-y-6 max-w-2xl mx-auto bg-[#181615] border border-white/10 rounded-xl p-6 md:p-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif-luxury text-xl text-[#F4EFEA]">
                Anatomical Fit & Measurements
              </h2>
              <div className="flex items-center gap-1 bg-[#121110] p-1 rounded border border-white/10">
                <button
                  type="button"
                  onClick={() => setUnit('inches')}
                  className={`px-2.5 py-1 text-[11px] rounded font-medium cursor-pointer ${unit === 'inches' ? 'bg-[#D4AF37] text-[#121110]' : 'text-[#F4EFEA]/60'}`}
                >
                  Inches
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('cm')}
                  className={`px-2.5 py-1 text-[11px] rounded font-medium cursor-pointer ${unit === 'cm' ? 'bg-[#D4AF37] text-[#121110]' : 'text-[#F4EFEA]/60'}`}
                >
                  CM
                </button>
              </div>
            </div>

            {/* Mode: Saved Profile vs Manual Input vs In-Person */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMeasurementMode('manual')}
                className={`py-2 px-3 text-xs rounded border text-center cursor-pointer transition-colors ${
                  measurementMode === 'manual' ? 'border-[#D4AF37] bg-[#221F1C] text-[#D4AF37]' : 'border-white/10 bg-[#121110] text-[#F4EFEA]/60'
                }`}
              >
                Enter Key Measures
              </button>

              <button
                type="button"
                onClick={() => setMeasurementMode('vault')}
                className={`py-2 px-3 text-xs rounded border text-center cursor-pointer transition-colors ${
                  measurementMode === 'vault' ? 'border-[#D4AF37] bg-[#221F1C] text-[#D4AF37]' : 'border-white/10 bg-[#121110] text-[#F4EFEA]/60'
                }`}
              >
                Use Saved Profile
              </button>

              <button
                type="button"
                onClick={() => setMeasurementMode('schedule_in_person')}
                className={`py-2 px-3 text-xs rounded border text-center cursor-pointer transition-colors ${
                  measurementMode === 'schedule_in_person' ? 'border-[#D4AF37] bg-[#221F1C] text-[#D4AF37]' : 'border-white/10 bg-[#121110] text-[#F4EFEA]/60'
                }`}
              >
                Measure at Studio
              </button>
            </div>

            {measurementMode === 'vault' && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-medium text-[#F4EFEA]/80">Select Client Profile from Studio Vault</label>
                <select
                  value={selectedVaultCardId}
                  onChange={(e) => setSelectedVaultCardId(e.target.value)}
                  className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="">-- Choose Profile --</option>
                  {measurementCards.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.fullName} ({card.gender}) - {card.city}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {measurementMode === 'manual' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Chest / Bust ({unit})</label>
                  <input
                    type="number"
                    step="0.5"
                    value={chestBust}
                    onChange={(e) => setChestBust(e.target.value)}
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs font-mono text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Natural Waist ({unit})</label>
                  <input
                    type="number"
                    step="0.5"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs font-mono text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Full Hips ({unit})</label>
                  <input
                    type="number"
                    step="0.5"
                    value={hips}
                    onChange={(e) => setHips(e.target.value)}
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs font-mono text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Shoulder Width ({unit})</label>
                  <input
                    type="number"
                    step="0.5"
                    value={shoulder}
                    onChange={(e) => setShoulder(e.target.value)}
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs font-mono text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Sleeve Length ({unit})</label>
                  <input
                    type="number"
                    step="0.5"
                    value={sleeveLength}
                    onChange={(e) => setSleeveLength(e.target.value)}
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs font-mono text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Trouser / Skirt ({unit})</label>
                  <input
                    type="number"
                    step="0.5"
                    value={trouserLength}
                    onChange={(e) => setTrouserLength(e.target.value)}
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs font-mono text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                {selectedSilhouette.id.includes('agbada') && (
                  <div className="col-span-2 sm:col-span-3">
                    <label className="block text-[11px] text-[#D4AF37] mb-1 font-medium">Agbada Wrist-to-Wrist Span ({unit})</label>
                    <input
                      type="number"
                      step="0.5"
                      value={agbadaSpan}
                      onChange={(e) => setAgbadaSpan(e.target.value)}
                      className="w-full bg-[#121110] border border-[#D4AF37]/40 rounded px-3 py-2 text-xs font-mono text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            {measurementMode === 'schedule_in_person' && (
              <div className="p-4 rounded bg-[#121110] border border-[#D4AF37]/30 text-xs text-[#F4EFEA]/80 space-y-1">
                <span className="font-semibold text-[#D4AF37]">In-Studio Master Tailor Session</span>
                <p>We will take comprehensive 16-point anatomical measurements during your scheduled consultation in our home-based studio.</p>
              </div>
            )}

            {/* Client Contact Info */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                Commission Patron Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Chief Adeleke Ogundipe"
                    className="w-full bg-[#121110] border border-white/10 rounded px-3.5 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full bg-[#121110] border border-white/10 rounded px-3.5 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 text-xs text-[#F4EFEA]/60 hover:text-[#F4EFEA] flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={() => {
                if (!clientName.trim() || !clientPhone.trim()) {
                  showToast('Please provide your name and phone number', 'warning');
                  return;
                }
                setStep(4);
              }}
              className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#C59B27] text-[#121110] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>View Commission Summary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Quotation & Direct Commission Submission */}
      {step === 4 && (
        <div className="space-y-6 max-w-2xl mx-auto bg-[#181615] border border-[#D4AF37]/40 rounded-xl p-6 md:p-8 shadow-2xl">
          <div className="space-y-4">
            <span className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold">
              PRD Section 8 · Cost-Based Transparent Valuation
            </span>
            <h2 className="font-serif-luxury text-2xl text-[#F4EFEA]">
              Commission Specification & Quotation
            </h2>

            {/* Garment Summary */}
            <div className="p-4 rounded-lg bg-[#121110] border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#F4EFEA]/60">Garment Silhouette:</span>
                <span className="font-semibold text-[#F4EFEA]">{selectedSilhouette.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#F4EFEA]/60">Finishing Tier:</span>
                <span className="font-semibold text-[#D4AF37] uppercase">{tier} Tier</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#F4EFEA]/60">Fabric Source & Type:</span>
                <span className="font-medium text-[#F4EFEA]">{fabricSource.replace('_', ' ')} · {fabricType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#F4EFEA]/60">Palette & Embroidery:</span>
                <span className="text-[#F4EFEA]">{colorChoice} · {embroideryLevel.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#F4EFEA]/60">Patron:</span>
                <span className="text-[#F4EFEA]">{clientName} ({clientPhone})</span>
              </div>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="p-4 rounded-lg bg-[#1F1C1A] border border-[#D4AF37]/30 space-y-3">
              <div className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                Transparent Costing Breakdown (₦)
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#F4EFEA]/70">
                  <span>Direct Fabric & Textile ({selectedSilhouette.estFabricYards} yds)</span>
                  <span className="font-mono tabular-nums">₦{financials.fabricTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#F4EFEA]/70">
                  <span>Interfacing, Trims, Lining & Notions</span>
                  <span className="font-mono tabular-nums">₦{financials.notionsAndTrimsCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#F4EFEA]/70">
                  <span>Embroidery & Artisan Detailing</span>
                  <span className="font-mono tabular-nums">₦{financials.embroideryCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#F4EFEA]/70">
                  <span>Master Tailoring & Pattern Cutting Labor</span>
                  <span className="font-mono tabular-nums">₦{financials.tailorLaborCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#F4EFEA]/70">
                  <span>ATX Packaging & Studio Overhead</span>
                  <span className="font-mono tabular-nums">₦{(financials.packagingAndTagsCost + financials.studioOverheadShare).toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#F4EFEA]">Total Commission Value:</span>
                <span className="font-mono text-xl font-bold text-[#D4AF37] tabular-nums">
                  ₦{financials.recommendedRetailPrice.toLocaleString()}
                </span>
              </div>

              {/* Lean Working Capital Milestone */}
              <div className="pt-2 border-t border-[#D4AF37]/20 flex justify-between items-center text-xs bg-[#121110]/50 p-2.5 rounded">
                <div>
                  <span className="block font-semibold text-[#10B981]">Required Initial Deposit (60%):</span>
                  <span className="text-[10px] text-[#F4EFEA]/60">Funds fabric sourcing & cutting initiation</span>
                </div>
                <span className="font-mono text-base font-bold text-[#10B981] tabular-nums">
                  ₦{financials.requiredDepositAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Official Bank Deposit Card (Lean ₦0-₦200k PRD Model) */}
            <div className="p-4 rounded-lg bg-[#141211] border border-[#D4AF37]/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                    Official Studio Bank Transfer
                  </span>
                </div>
                <span className="text-[10px] text-[#F4EFEA]/60 bg-[#221F1C] px-2 py-0.5 rounded border border-white/10">
                  Instant Verification
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#1A1816] p-3 rounded border border-white/5">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#F4EFEA]/50 block">Bank Name</span>
                  <span className="font-medium text-[#F4EFEA]">{bankDetails.bankName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#F4EFEA]/50 block">Account Name</span>
                  <span className="font-medium text-[#F4EFEA] truncate block">{bankDetails.accountName}</span>
                </div>
                <div className="sm:col-span-2 flex items-center justify-between pt-1 border-t border-white/5">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#F4EFEA]/50 block">NUBAN Account Number</span>
                    <span className="font-mono text-base font-bold text-[#D4AF37] tracking-wider">{bankDetails.accountNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyBankToClipboard}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-medium transition-colors cursor-pointer"
                  >
                    {copiedAccount ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAccount ? 'Copied!' : 'Copy Account'}</span>
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-[#F4EFEA]/60 italic leading-relaxed">
                {bankDetails.note}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 text-xs text-[#F4EFEA]/60 hover:text-[#F4EFEA] flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleCompleteCommission}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C59B27] text-[#121110] text-xs font-semibold uppercase tracking-wider rounded transition-all shadow-xl flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirm & Send to Studio WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
