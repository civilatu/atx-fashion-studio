/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { ClientMeasurementCard } from '../../types/atelier';
import { Ruler, Plus, Search, Copy, User, Phone, MapPin, X, Check, FileText } from 'lucide-react';

export const MeasurementVault: React.FC = () => {
  const { measurementCards, createMeasurementCard, showToast, setActiveClientView } = useAtelier();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<ClientMeasurementCard | null>(() => measurementCards[0] || null);
  const [isCreating, setIsCreating] = useState(false);

  // New Card Form States
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'child'>('male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Lagos');
  const [notes, setNotes] = useState('');
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  // Measures
  const [neck, setNeck] = useState('');
  const [chestOrBust, setChestOrBust] = useState('');
  const [underbust, setUnderbust] = useState('');
  const [waist, setWaist] = useState('');
  const [shoulderWidth, setShoulderWidth] = useState('');
  const [sleeveLength, setSleeveLength] = useState('');
  const [bicep, setBicep] = useState('');
  const [wrist, setWrist] = useState('');
  const [shirtLength, setShirtLength] = useState('');
  const [trouserLength, setTrouserLength] = useState('');
  const [fullHip, setFullHip] = useState('');
  const [thigh, setThigh] = useState('');
  const [ankle, setAnkle] = useState('');
  const [agbadaSpan, setAgbadaSpan] = useState('');
  const [capSize, setCapSize] = useState('');

  const filteredCards = measurementCards.filter((c) =>
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      showToast('Name and phone are required', 'warning');
      return;
    }

    const created = createMeasurementCard({
      fullName: fullName.trim(),
      gender,
      phone: phone.trim(),
      email: email.trim() || undefined,
      city: city.trim(),
      notes: notes.trim() || undefined,
      unit,
      neck: parseFloat(neck) || undefined,
      chestOrBust: parseFloat(chestOrBust) || undefined,
      underbust: parseFloat(underbust) || undefined,
      waist: parseFloat(waist) || undefined,
      shoulderWidth: parseFloat(shoulderWidth) || undefined,
      sleeveLength: parseFloat(sleeveLength) || undefined,
      bicep: parseFloat(bicep) || undefined,
      wrist: parseFloat(wrist) || undefined,
      shirtOrTopLength: parseFloat(shirtLength) || undefined,
      trouserOrSkirtLength: parseFloat(trouserLength) || undefined,
      fullHip: parseFloat(fullHip) || undefined,
      thigh: parseFloat(thigh) || undefined,
      ankleOrHem: parseFloat(ankle) || undefined,
      agbadaSpan: parseFloat(agbadaSpan) || undefined,
      capOrFilaSize: parseFloat(capSize) || undefined
    });

    setSelectedCard(created);
    setIsCreating(false);
    resetForm();
  };

  const resetForm = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setCity('Lagos');
    setNotes('');
    setNeck('');
    setChestOrBust('');
    setUnderbust('');
    setWaist('');
    setShoulderWidth('');
    setSleeveLength('');
    setBicep('');
    setWrist('');
    setShirtLength('');
    setTrouserLength('');
    setFullHip('');
    setThigh('');
    setAnkle('');
    setAgbadaSpan('');
    setCapSize('');
  };

  const handleCopyTailorTicket = (card: ClientMeasurementCard) => {
    const text = `*ATX FASHION STUDIO — TAILOR MEASUREMENT CARD*
*Client:* ${card.fullName} (${card.gender.toUpperCase()})
*Contact:* ${card.phone} · ${card.city}
*Unit:* ${card.unit.toUpperCase()} | *Updated:* ${card.updatedAt}

*Upper Body:*
• Neck: ${card.neck || '-'} ${card.unit}
• Chest/Bust: ${card.chestOrBust || '-'} ${card.unit}
${card.underbust ? `• Underbust: ${card.underbust} ${card.unit}` : ''}
• Waist: ${card.waist || '-'} ${card.unit}
• Shoulder Width: ${card.shoulderWidth || '-'} ${card.unit}
• Sleeve Length: ${card.sleeveLength || '-'} ${card.unit}
• Bicep: ${card.bicep || '-'} ${card.unit}
• Shirt/Top Length: ${card.shirtOrTopLength || '-'} ${card.unit}

*Lower Body:*
• Full Hip: ${card.fullHip || '-'} ${card.unit}
• Trouser/Skirt Length: ${card.trouserOrSkirtLength || '-'} ${card.unit}
• Thigh: ${card.thigh || '-'} ${card.unit}
• Ankle/Hem: ${card.ankleOrHem || '-'} ${card.unit}

*Traditional African Tailoring:*
• Agbada Arm Span: ${card.agbadaSpan || '-'} ${card.unit}
• Fila / Cap Size: ${card.capOrFilaSize || '-'} ${card.unit}

*Artisan Notes:* ${card.notes || 'None logged'}`;

    navigator.clipboard.writeText(text);
    showToast(`Measurement card for ${card.fullName} copied to clipboard!`, 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
            Section 7 & 11 · Anatomical Fit Guarantee
          </span>
          <h1 className="font-serif-luxury text-2xl md:text-3xl text-[#F4EFEA]">
            Client Measurement Vault
          </h1>
          <p className="text-xs sm:text-sm text-[#F4EFEA]/70">
            Persistent fitting profiles ensuring accurate cutting, repeatable commissions, and zero alteration wastage.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#C59B27] text-[#121110] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Client Profile</span>
        </button>
      </div>

      {/* Main Grid: Directory Left, Detail Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Directory list */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#F4EFEA]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, or city..."
              className="w-full bg-[#181615] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-[#F4EFEA] placeholder:text-white/20 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredCards.map((card) => {
              const isSelected = selectedCard?.id === card.id;
              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#221F1C] border-[#D4AF37] ring-1 ring-[#D4AF37]/50'
                      : 'bg-[#181615] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif-luxury text-sm font-semibold text-[#F4EFEA]">
                        {card.fullName}
                      </h3>
                      <div className="text-[11px] text-[#F4EFEA]/60 flex items-center gap-2 mt-0.5">
                        <span className="capitalize">{card.gender}</span>
                        <span>·</span>
                        <span>{card.city}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-[#121110] px-2 py-0.5 rounded text-[#D4AF37] border border-white/5">
                      {card.unit}
                    </span>
                  </div>

                  <div className="pt-2 text-[11px] text-[#F4EFEA]/50 flex items-center justify-between">
                    <span>{card.phone}</span>
                    <span>Updated: {card.updatedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Measurement Specimen */}
        <div className="lg:col-span-7">
          {selectedCard ? (
            <div className="bg-[#181615] border border-[#D4AF37]/30 rounded-xl p-6 md:p-8 space-y-6 shadow-xl">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
                    <span className="font-mono">{selectedCard.id}</span>
                    <span>·</span>
                    <span className="capitalize">{selectedCard.gender} Fit Profile</span>
                  </div>
                  <h2 className="font-serif-luxury text-2xl text-[#F4EFEA] mt-1">
                    {selectedCard.fullName}
                  </h2>
                  <div className="text-xs text-[#F4EFEA]/60 flex items-center gap-4 mt-1">
                    <span>{selectedCard.phone}</span>
                    <span>{selectedCard.city}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyTailorTicket(selectedCard)}
                  className="px-3.5 py-2 bg-[#1C1A18] hover:bg-[#2A2624] text-[#D4AF37] border border-[#D4AF37]/30 rounded text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Tailor Ticket</span>
                </button>
              </div>

              {/* Upper Body Specifications */}
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37] block">
                  Upper Body & Torso ({selectedCard.unit})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded bg-[#121110] border border-white/5">
                    <span className="text-[10px] text-[#F4EFEA]/40 uppercase block">Chest / Bust</span>
                    <span className="font-mono text-sm font-bold text-[#F4EFEA]">{selectedCard.chestOrBust || '-'}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#121110] border border-white/5">
                    <span className="text-[10px] text-[#F4EFEA]/40 uppercase block">Neck</span>
                    <span className="font-mono text-sm font-bold text-[#F4EFEA]">{selectedCard.neck || '-'}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#121110] border border-white/5">
                    <span className="text-[10px] text-[#F4EFEA]/40 uppercase block">Shoulder Width</span>
                    <span className="font-mono text-sm font-bold text-[#F4EFEA]">{selectedCard.shoulderWidth || '-'}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#121110] border border-white/5">
                    <span className="text-[10px] text-[#F4EFEA]/40 uppercase block">Sleeve Length</span>
                    <span className="font-mono text-sm font-bold text-[#F4EFEA]">{selectedCard.sleeveLength || '-'}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#121110] border border-white/5">
                    <span className="text-[10px] text-[#F4EFEA]/40 uppercase block">Natural Waist</span>
                    <span className="font-mono text-sm font-bold text-[#F4EFEA]">{selectedCard.waist || '-'}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#121110] border border-white/5">
                    <span className="text-[10px] text-[#F4EFEA]/40 uppercase block">Bicep</span>
                    <span className="font-mono text-sm font-bold text-[#F4EFEA]">{selectedCard.bicep || '-'}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#121110] border border-white/5">
                    <span className="text-[10px] text-[#F4EFEA]/40 uppercase block">Wrist</span>
                    <span className="font-mono text-sm font-bold text-[#F4EFEA]">{selectedCard.wrist || '-'}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#121110] border border-white/5">
                    <span className="text-[10px] text-[#F4EFEA]/40 uppercase block">Top Length</span>
                    <span className="font-mono text-sm font-bold text-[#F4EFEA]">{selectedCard.shirtOrTopLength || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Lower Body & African Traditional Specifics */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37] block">
                  Lower Body & Traditional Ensembles ({selectedCard.unit})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded bg-[#121110] border border-white/5">
                    <span className="text-[10px] text-[#F4EFEA]/40 uppercase block">Full Hips</span>
                    <span className="font-mono text-sm font-bold text-[#F4EFEA]">{selectedCard.fullHip || '-'}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#121110] border border-white/5">
                    <span className="text-[10px] text-[#F4EFEA]/40 uppercase block">Trouser Length</span>
                    <span className="font-mono text-sm font-bold text-[#F4EFEA]">{selectedCard.trouserOrSkirtLength || '-'}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#121110] border border-white/5">
                    <span className="text-[10px] text-[#F4EFEA]/40 uppercase block">Thigh</span>
                    <span className="font-mono text-sm font-bold text-[#F4EFEA]">{selectedCard.thigh || '-'}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#121110] border border-white/5">
                    <span className="text-[10px] text-[#F4EFEA]/40 uppercase block">Ankle / Hem</span>
                    <span className="font-mono text-sm font-bold text-[#F4EFEA]">{selectedCard.ankleOrHem || '-'}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#121110] border border-[#D4AF37]/30 col-span-2">
                    <span className="text-[10px] text-[#D4AF37] uppercase block font-medium">Agbada Arm Span (Wrist-to-Wrist)</span>
                    <span className="font-mono text-base font-bold text-[#D4AF37]">{selectedCard.agbadaSpan || '-'} {selectedCard.unit}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#121110] border border-[#D4AF37]/30 col-span-2">
                    <span className="text-[10px] text-[#D4AF37] uppercase block font-medium">Fila / Cap Size</span>
                    <span className="font-mono text-base font-bold text-[#D4AF37]">{selectedCard.capOrFilaSize || '-'} {selectedCard.unit}</span>
                  </div>
                </div>
              </div>

              {/* Artisan Notes */}
              {selectedCard.notes && (
                <div className="p-3.5 rounded-lg bg-[#121110] border border-white/5 text-xs text-[#F4EFEA]/80">
                  <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] block font-semibold mb-1">
                    Anatomical & Fitting Notes
                  </span>
                  <p>{selectedCard.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#181615] rounded-xl border border-white/5 text-[#F4EFEA]/50 text-xs">
              Select a client from the vault to inspect their measurement profile.
            </div>
          )}
        </div>
      </div>

      {/* New Measurement Profile Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#181615] border border-[#D4AF37]/40 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setIsCreating(false)}
              className="absolute top-4 right-4 p-1.5 text-[#F4EFEA]/60 hover:text-[#F4EFEA] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-serif-luxury text-xl text-[#F4EFEA]">
                Log New Client Measurement Profile
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

            <form onSubmit={handleSaveCard} className="space-y-4">
              {/* Profile Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Chief Adeleke Ogundipe"
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="child">Child</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Location / City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Victoria Island, Lagos"
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Upper Body Measures */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold block">
                  Upper Body Measures ({unit})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] text-[#F4EFEA]/60">Chest/Bust</label>
                    <input
                      type="number"
                      step="0.25"
                      value={chestOrBust}
                      onChange={(e) => setChestOrBust(e.target.value)}
                      className="w-full bg-[#121110] border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-[#F4EFEA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#F4EFEA]/60">Neck</label>
                    <input
                      type="number"
                      step="0.25"
                      value={neck}
                      onChange={(e) => setNeck(e.target.value)}
                      className="w-full bg-[#121110] border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-[#F4EFEA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#F4EFEA]/60">Shoulder Width</label>
                    <input
                      type="number"
                      step="0.25"
                      value={shoulderWidth}
                      onChange={(e) => setShoulderWidth(e.target.value)}
                      className="w-full bg-[#121110] border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-[#F4EFEA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#F4EFEA]/60">Sleeve Length</label>
                    <input
                      type="number"
                      step="0.25"
                      value={sleeveLength}
                      onChange={(e) => setSleeveLength(e.target.value)}
                      className="w-full bg-[#121110] border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-[#F4EFEA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#F4EFEA]/60">Waist</label>
                    <input
                      type="number"
                      step="0.25"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      className="w-full bg-[#121110] border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-[#F4EFEA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#F4EFEA]/60">Bicep</label>
                    <input
                      type="number"
                      step="0.25"
                      value={bicep}
                      onChange={(e) => setBicep(e.target.value)}
                      className="w-full bg-[#121110] border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-[#F4EFEA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#F4EFEA]/60">Wrist</label>
                    <input
                      type="number"
                      step="0.25"
                      value={wrist}
                      onChange={(e) => setWrist(e.target.value)}
                      className="w-full bg-[#121110] border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-[#F4EFEA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#F4EFEA]/60">Top Length</label>
                    <input
                      type="number"
                      step="0.25"
                      value={shirtLength}
                      onChange={(e) => setShirtLength(e.target.value)}
                      className="w-full bg-[#121110] border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-[#F4EFEA]"
                    />
                  </div>
                </div>
              </div>

              {/* Lower Body & Traditional */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold block">
                  Lower Body & Traditional Measures ({unit})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] text-[#F4EFEA]/60">Full Hips</label>
                    <input
                      type="number"
                      step="0.25"
                      value={fullHip}
                      onChange={(e) => setFullHip(e.target.value)}
                      className="w-full bg-[#121110] border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-[#F4EFEA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#F4EFEA]/60">Trouser/Skirt Length</label>
                    <input
                      type="number"
                      step="0.25"
                      value={trouserLength}
                      onChange={(e) => setTrouserLength(e.target.value)}
                      className="w-full bg-[#121110] border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-[#F4EFEA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#F4EFEA]/60">Thigh</label>
                    <input
                      type="number"
                      step="0.25"
                      value={thigh}
                      onChange={(e) => setThigh(e.target.value)}
                      className="w-full bg-[#121110] border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-[#F4EFEA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#F4EFEA]/60">Ankle / Hem</label>
                    <input
                      type="number"
                      step="0.25"
                      value={ankle}
                      onChange={(e) => setAnkle(e.target.value)}
                      className="w-full bg-[#121110] border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-[#F4EFEA]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] text-[#D4AF37]">Agbada Arm Span (Wrist-to-Wrist)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={agbadaSpan}
                      onChange={(e) => setAgbadaSpan(e.target.value)}
                      className="w-full bg-[#121110] border border-[#D4AF37]/30 rounded px-2.5 py-1.5 text-xs font-mono text-[#F4EFEA]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] text-[#D4AF37]">Fila / Cap Size</label>
                    <input
                      type="number"
                      step="0.5"
                      value={capSize}
                      onChange={(e) => setCapSize(e.target.value)}
                      className="w-full bg-[#121110] border border-[#D4AF37]/30 rounded px-2.5 py-1.5 text-xs font-mono text-[#F4EFEA]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Tailor Notes (Posture, ease, slope)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Left shoulder lower by 0.5 inch, prefer loose buba armhole."
                  className="w-full bg-[#121110] border border-white/10 rounded px-3 py-1.5 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-xs text-[#F4EFEA]/60 hover:text-[#F4EFEA] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#D4AF37] hover:bg-[#C59B27] text-[#121110] text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
                >
                  Save Profile to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
