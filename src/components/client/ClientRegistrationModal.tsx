/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { User, Phone, Mail, MapPin, Sparkles, Check, X, ShieldCheck, Crown, MessageCircle, ArrowRight, Ruler } from 'lucide-react';

interface ClientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientRegistrationModal: React.FC<ClientRegistrationModalProps> = ({ isOpen, onClose }) => {
  const { createMeasurementCard, showToast, setActiveClientView } = useAtelier();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Lagos');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [styleInterests, setStyleInterests] = useState<string[]>(['Bespoke Agbada & Senator']);
  const [measurementPreference, setMeasurementPreference] = useState<'in_studio' | 'enter_now' | 'whatsapp_guide'>('in_studio');
  
  // Optional quick metrics
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [notes, setNotes] = useState('');

  // Post-registration state
  const [registeredPatron, setRegisteredPatron] = useState<{
    id: string;
    fullName: string;
    phone: string;
    voucherCode: string;
  } | null>(null);

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    setStyleInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      showToast('Please enter your full name and phone number', 'warning');
      return;
    }

    const vipNumber = Math.floor(1000 + Math.random() * 9000);
    const patronId = `ATX-VIP-${vipNumber}`;

    createMeasurementCard({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      gender,
      city: city.trim(),
      unit: 'inches',
      chestOrBust: chest ? parseFloat(chest) : undefined,
      waist: waist ? parseFloat(waist) : undefined,
      fullHip: hips ? parseFloat(hips) : undefined,
      notes: `Style interests: ${styleInterests.join(', ')}. Fit preference: ${measurementPreference}. ${notes ? `Notes: ${notes}` : ''}`
    });

    const patronData = {
      id: patronId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      voucherCode: 'ATX-FIRST-10'
    };

    setRegisteredPatron(patronData);
    try {
      localStorage.setItem('atx_registered_patron', JSON.stringify(patronData));
    } catch (err) {
      console.error(err);
    }

    showToast(`Welcome to ATX Fashion Studio, ${fullName.trim()}! Patron ID: ${patronId}`, 'success');
  };

  const handleSendToWhatsApp = () => {
    if (!registeredPatron) return;
    const text = encodeURIComponent(
      `*ATX FASHION STUDIO — NEW PATRON VIP REGISTRATION*\n` +
      `Hello Master Tailor, I just registered as a new client at ATX Fashion Studio!\n\n` +
      `• Patron ID: *${registeredPatron.id}*\n` +
      `• Name: ${registeredPatron.fullName}\n` +
      `• Phone: ${registeredPatron.phone}\n` +
      `• City: ${city}\n` +
      `• Interests: ${styleInterests.join(', ')}\n` +
      `• Measurement Preference: ${measurementPreference.replace('_', ' ').toUpperCase()}\n` +
      `• Welcome Voucher: ATX-FIRST-10 (10% off first commission)\n\n` +
      `Please confirm my registration and schedule my initial styling consultation.`
    );
    window.open(`https://wa.me/2348150882291?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#181615] border border-[#D4AF37]/50 rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 md:p-8 space-y-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#F4EFEA]/60 hover:text-[#F4EFEA] rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!registeredPatron ? (
          <>
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
                <Crown className="w-4 h-4 text-[#D4AF37]" />
                <span>Client Privilege & Onboarding</span>
              </div>
              <h2 className="font-serif-luxury text-2xl md:text-3xl text-[#F4EFEA]">
                Join the ATX Patron Circle
              </h2>
              <p className="text-xs text-[#F4EFEA]/70 leading-relaxed">
                Register in 30 seconds to establish your personal bespoke fit profile, unlock priority booking, and receive a 10% welcome privilege on your first creation.
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Chief Adeleke Ogundipe"
                    className="w-full bg-[#121110] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-[#F4EFEA] placeholder-white/20 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">WhatsApp Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0803 123 4567"
                    className="w-full bg-[#121110] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-[#F4EFEA] placeholder-white/20 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. adeleke@example.ng"
                    className="w-full bg-[#121110] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-[#F4EFEA] placeholder-white/20 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">City / Region *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Victoria Island, Lagos or Abuja"
                    className="w-full bg-[#121110] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-[#F4EFEA] placeholder-white/20 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Gender Preference */}
              <div>
                <label className="block text-[11px] text-[#F4EFEA]/70 mb-1.5">Collection Focus</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                      gender === 'male' ? 'border-[#D4AF37] bg-[#221F1C] text-[#D4AF37]' : 'border-white/10 bg-[#121110] text-[#F4EFEA]/60'
                    }`}
                  >
                    Men's Traditional & Modern Tailoring
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                      gender === 'female' ? 'border-[#D4AF37] bg-[#221F1C] text-[#D4AF37]' : 'border-white/10 bg-[#121110] text-[#F4EFEA]/60'
                    }`}
                  >
                    Women's Couture & Contemporary Gowns
                  </button>
                </div>
              </div>

              {/* Primary Interests */}
              <div>
                <label className="block text-[11px] text-[#F4EFEA]/70 mb-1.5">What are you looking to create?</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Bespoke Agbada & Senator',
                    'Ankara Evening Wear',
                    'Traditional Wedding Aso-Oke',
                    'Corporate & School Uniforms',
                    'Personal Styling Consultation'
                  ].map((style) => {
                    const isSelected = styleInterests.includes(style);
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => toggleInterest(style)}
                        className={`px-3 py-1.5 rounded-lg border text-[11px] cursor-pointer transition-colors flex items-center gap-1.5 ${
                          isSelected ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]' : 'border-white/10 bg-[#121110] text-[#F4EFEA]/60'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-[#D4AF37]" />}
                        <span>{style}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sizing & Measurement Option */}
              <div>
                <label className="block text-[11px] text-[#F4EFEA]/70 mb-1.5">Anatomical Measurement Preference</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'in_studio', title: 'In-Studio Fitting', desc: 'Schedule complimentary measurement with Master Tailor' },
                    { id: 'enter_now', title: 'Enter Basic Sizes', desc: 'Chest, Waist, Hips in inches' },
                    { id: 'whatsapp_guide', title: 'WhatsApp Tape Guide', desc: 'We send a quick video guide to measure at home' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setMeasurementPreference(opt.id as any)}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                        measurementPreference === opt.id
                          ? 'border-[#D4AF37] bg-[#221F1C] text-[#D4AF37]'
                          : 'border-white/10 bg-[#121110] text-[#F4EFEA]/60'
                      }`}
                    >
                      <span className="block text-[11px] font-semibold text-[#F4EFEA]">{opt.title}</span>
                      <span className="text-[10px] text-[#F4EFEA]/50 block leading-tight mt-0.5">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* If entering now */}
              {measurementPreference === 'enter_now' && (
                <div className="grid grid-cols-3 gap-2.5 p-3 rounded-lg bg-[#121110] border border-white/5 animate-in fade-in">
                  <div>
                    <label className="block text-[10px] text-[#F4EFEA]/50 mb-1">Chest / Bust (in)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={chest}
                      onChange={(e) => setChest(e.target.value)}
                      placeholder="e.g. 42"
                      className="w-full bg-[#181615] border border-white/10 rounded px-2.5 py-1.5 text-xs text-[#F4EFEA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#F4EFEA]/50 mb-1">Natural Waist (in)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      placeholder="e.g. 36"
                      className="w-full bg-[#181615] border border-white/10 rounded px-2.5 py-1.5 text-xs text-[#F4EFEA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#F4EFEA]/50 mb-1">Full Hips (in)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={hips}
                      onChange={(e) => setHips(e.target.value)}
                      placeholder="e.g. 42"
                      className="w-full bg-[#181615] border border-white/10 rounded px-2.5 py-1.5 text-xs text-[#F4EFEA]"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#D4AF37] hover:bg-[#C59B27] text-[#121110] font-semibold text-xs uppercase tracking-widest rounded-lg transition-all shadow-xl cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Establish VIP Patron Profile</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#F4EFEA]/50 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Your private measurements and contact data are strictly confidential.</span>
              </div>
            </form>
          </>
        ) : (
          /* VIP Membership Card Display */
          <div className="space-y-6 text-center animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37]">
              <Crown className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                Official Patron Record Established
              </span>
              <h2 className="font-serif-luxury text-2xl md:text-3xl text-[#F4EFEA]">
                Welcome to ATX Fashion House
              </h2>
              <p className="text-xs text-[#F4EFEA]/70 max-w-sm mx-auto">
                Your anatomical profile and customer record have been safely archived in our studio vault.
              </p>
            </div>

            {/* Luxury Member Card Lockup */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#24201D] via-[#1A1816] to-[#121110] border border-[#D4AF37]/50 text-left relative overflow-hidden shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] tracking-widest uppercase text-[#D4AF37] font-semibold block">
                    ATX VIP PATRON CARD
                  </span>
                  <span className="font-serif-luxury text-lg text-[#F4EFEA] font-bold block mt-1">
                    {registeredPatron.fullName}
                  </span>
                </div>
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-10-28_at_08.56.14_405778ba.jpeg"
                  alt="ATX Logo"
                  className="w-8 h-8 rounded bg-white p-0.5 object-contain"
                />
              </div>

              <div className="pt-6 flex items-end justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#F4EFEA]/40 block">Patron Identification</span>
                  <span className="font-mono text-sm font-bold text-[#D4AF37] tracking-wider">{registeredPatron.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider text-[#F4EFEA]/40 block">Welcome Voucher (10% Off)</span>
                  <span className="font-mono text-xs font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/30">
                    {registeredPatron.voucherCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleSendToWhatsApp}
                className="w-full py-3 bg-[#10B981] hover:bg-[#0EA472] text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm Profile with Studio Desk on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  setActiveClientView('bespoke');
                }}
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#C59B27] text-[#121110] font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Commission Your First Bespoke Garment</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
