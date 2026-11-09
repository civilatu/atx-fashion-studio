/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { Sparkles, Calendar, MessageSquare, Check, ShieldCheck, HeartHandshake } from 'lucide-react';

interface StylingPackage {
  id: string;
  title: string;
  priceNGN: number;
  duration: string;
  description: string;
  deliverables: string[];
}

const STYLING_PACKAGES: StylingPackage[] = [
  {
    id: 'pkg-01',
    title: 'Personal Fashion & Wardrobe Audit',
    priceNGN: 45000,
    duration: '2-Hour Studio Session',
    description: 'A comprehensive evaluation of your existing wardrobe, identifying essential African & contemporary staple pieces.',
    deliverables: [
      'Body geometry & color analysis',
      'Curated capsule wardrobe recommendation',
      'Digital Lookbook PDF with 15 outfit combinations',
      'Fabric & tailoring recommendations'
    ]
  },
  {
    id: 'pkg-02',
    title: 'Milestone Event & Red Carpet Styling',
    priceNGN: 85000,
    duration: 'Dedicated Event Curation',
    description: 'High-fashion head-to-toe styling for galas, award ceremonies, chieftaincy titles, and high-profile state functions.',
    deliverables: [
      'Complete ensemble coordination (Garment, jewelry, footwear, fila/gele)',
      'Custom bespoke commission oversight',
      'Pre-event fitting inspection & tailoring adjustments',
      'On-call day-of styling coordination'
    ]
  },
  {
    id: 'pkg-03',
    title: 'Wedding & Aso-Ebi Couple Curation',
    priceNGN: 150000,
    duration: 'Multi-Week Bridal Curation',
    description: 'Harmonious traditional wedding attire planning for the couple and entourage, integrating Aso-Oke, lace, and accessories.',
    deliverables: [
      'Groom and bride palette harmonization',
      'Custom Aso-Oke motif development with master weavers',
      'Entourage fabric swatching & distribution guide',
      'Two scheduled studio fitting sessions'
    ]
  }
];

export const StylingConsultationModal: React.FC = () => {
  const { showToast } = useAtelier();
  const [selectedPkg, setSelectedPkg] = useState<StylingPackage>(STYLING_PACKAGES[0]);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [eventDetails, setEventDetails] = useState('');

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      showToast('Please provide your name and phone number', 'warning');
      return;
    }

    const text = encodeURIComponent(
      `*ATX FASHION STUDIO STYLING CONSULTATION INQUIRY*\nHello, I would like to book the *${selectedPkg.title}* (₦${selectedPkg.priceNGN.toLocaleString()}).\n\n• Name: ${clientName.trim()}\n• Phone: ${clientPhone.trim()}\n• Preferred Date: ${preferredDate || 'Earliest available'}\n• Event Context: ${eventDetails || 'General consultation'}\n\nPlease confirm availability.`
    );

    window.open(`https://wa.me/2348150882291?text=${text}`, '_blank');
    showToast('Styling inquiry generated! Opening WhatsApp...', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
          Section 4.4 · Fashion Styling & Consultation
        </span>
        <h1 className="font-serif-luxury text-3xl md:text-4xl text-[#F4EFEA]">
          Personal Styling & Wardrobe Direction
        </h1>
        <p className="text-xs sm:text-sm text-[#F4EFEA]/70 leading-relaxed">
          Beyond tailoring, our lead fashion designer and stylists guide individuals, families, and bridal parties toward cohesive elegance that honors tradition.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STYLING_PACKAGES.map((pkg) => {
          const isSelected = selectedPkg.id === pkg.id;
          return (
            <div
              key={pkg.id}
              onClick={() => setSelectedPkg(pkg)}
              className={`p-6 rounded-xl bg-[#181615] border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected ? 'border-[#D4AF37] bg-[#221F1C] ring-1 ring-[#D4AF37]/50' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#D4AF37]">
                  <span className="font-medium">{pkg.duration}</span>
                  <Sparkles className="w-4 h-4" />
                </div>

                <h3 className="font-serif-luxury text-xl text-[#F4EFEA]">
                  {pkg.title}
                </h3>

                <p className="text-xs text-[#F4EFEA]/70 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[11px] font-semibold text-[#F4EFEA] uppercase tracking-wider block">
                    Deliverables:
                  </span>
                  {pkg.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#F4EFEA]/70">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase text-[#F4EFEA]/40 block">Session Fee</span>
                  <span className="font-mono text-base font-bold text-[#D4AF37] tabular-nums">
                    ₦{pkg.priceNGN.toLocaleString()}
                  </span>
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${isSelected ? 'text-[#D4AF37]' : 'text-[#F4EFEA]/40'}`}>
                  {isSelected ? 'Selected' : 'Select Package'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Form */}
      <form onSubmit={handleBook} className="max-w-xl mx-auto bg-[#181615] border border-[#D4AF37]/30 rounded-xl p-6 md:p-8 space-y-4 shadow-xl">
        <h3 className="font-serif-luxury text-xl text-[#F4EFEA]">
          Book {selectedPkg.title}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Your Full Name *</label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Simi Balogun"
              className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">WhatsApp Phone *</label>
            <input
              type="tel"
              required
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="+234 800 000 0000"
              className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Target Consultation Date</label>
          <input
            type="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Event Context / Style Objective</label>
          <textarea
            rows={2}
            value={eventDetails}
            onChange={(e) => setEventDetails(e.target.value)}
            placeholder="e.g. Planning traditional engagement attire for December wedding."
            className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#D4AF37] hover:bg-[#C59B27] text-[#121110] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Confirm Consultation on WhatsApp</span>
        </button>
      </form>
    </div>
  );
};
