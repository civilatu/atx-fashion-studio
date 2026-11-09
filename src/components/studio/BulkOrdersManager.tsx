/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { BulkContract } from '../../types/atelier';
import { Building2, Plus, CheckCircle2, Clock, Calendar, Users, X, DollarSign, Copy } from 'lucide-react';

export const BulkOrdersManager: React.FC = () => {
  const { bulkContracts, createBulkContract, updateBulkContractStatus, showToast } = useAtelier();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [contractType, setContractType] = useState<BulkContract['contractType']>('school_uniform');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(50);
  const [unitPrice, setUnitPrice] = useState(16500);
  const [depositPaid, setDepositPaid] = useState(400000);
  const [deadline, setDeadline] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10));
  const [notes, setNotes] = useState('');

  const totalValue = quantity * unitPrice;

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !contactPerson.trim() || !phone.trim()) {
      showToast('Please fill in organization, contact person, and phone number', 'warning');
      return;
    }

    createBulkContract({
      organizationName: orgName.trim(),
      contractType,
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      quantityPieces: quantity,
      unitPriceNGN: unitPrice,
      totalContractValueNGN: totalValue,
      depositPaidNGN: depositPaid,
      status: depositPaid > 0 ? 'fabric_procurement' : 'deposit_pending',
      deliveryDeadline: deadline,
      notes: notes.trim()
    });

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setOrgName('');
    setContactPerson('');
    setPhone('');
    setQuantity(50);
    setUnitPrice(16500);
    setDepositPaid(400000);
    setNotes('');
  };

  const handleCopyProposal = (c: BulkContract) => {
    const text = `*ATX FASHION STUDIO — INSTITUTIONAL PRODUCTION PROPOSAL*
*Contract Ref:* ${c.id}
*Client Organisation:* ${c.organizationName}
*Contact:* ${c.contactPerson} (${c.phone})
*Contract Division:* ${c.contractType.replace('_', ' ').toUpperCase()}

*Production Scope:*
• Order Volume: ${c.quantityPieces.toLocaleString()} pieces
• Unit Investment: ₦${c.unitPriceNGN.toLocaleString()}
• Total Contract Value: ₦${c.totalContractValueNGN.toLocaleString()}
• Initial Material Deposit Paid: ₦${c.depositPaidNGN.toLocaleString()}
• Remaining Delivery Balance: ₦${(c.totalContractValueNGN - c.depositPaidNGN).toLocaleString()}
• Target Delivery Deadline: ${c.deliveryDeadline}

*Production Notes:* ${c.notes || 'Standard ATX finishing specifications'}

_ATX FASHION STUDIO Industrial Production Division_`;

    navigator.clipboard.writeText(text);
    showToast(`Bulk contract proposal for ${c.organizationName} copied to clipboard!`, 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
            Section 4.3 · Institutional Clothing Contracts
          </span>
          <h1 className="font-serif-luxury text-2xl md:text-3xl text-[#F4EFEA]">
            Fashion Production & Bulk Orders Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#F4EFEA]/70">
            Accepting production contracts for school uniforms, corporate staff wear, hospitality attire, and church groups.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#C59B27] text-[#121110] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Bulk Contract</span>
        </button>
      </div>

      {/* Contract Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bulkContracts.map((c) => {
          const balance = Math.max(0, c.totalContractValueNGN - c.depositPaidNGN);
          const percentFunded = Math.round((c.depositPaidNGN / c.totalContractValueNGN) * 100);

          return (
            <div
              key={c.id}
              className="p-6 rounded-xl bg-[#181615] border border-white/10 hover:border-[#D4AF37]/30 transition-all space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-sm font-bold text-[#D4AF37]">{c.id}</span>
                    <span className="text-[10px] uppercase tracking-wider bg-[#121110] px-2.5 py-0.5 rounded text-[#F4EFEA]/70 border border-white/10">
                      {c.contractType.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-xs text-[#F4EFEA]/50 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Due: {c.deliveryDeadline}</span>
                  </span>
                </div>

                <h3 className="font-serif-luxury text-xl text-[#F4EFEA]">
                  {c.organizationName}
                </h3>

                <div className="text-xs text-[#F4EFEA]/70 flex items-center gap-4">
                  <span>Contact: {c.contactPerson}</span>
                  <span>{c.phone}</span>
                </div>

                {/* Volume & Financial Figures */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-[#121110] border border-white/5 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-[#F4EFEA]/40 uppercase block">Volume</span>
                    <span className="font-mono text-sm font-bold text-[#F4EFEA]">{c.quantityPieces.toLocaleString()} pcs</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#F4EFEA]/40 uppercase block">Unit Price</span>
                    <span className="font-mono text-sm font-bold text-[#D4AF37]">₦{c.unitPriceNGN.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#F4EFEA]/40 uppercase block">Total Value</span>
                    <span className="font-mono text-sm font-bold text-[#F4EFEA]">₦{c.totalContractValueNGN.toLocaleString()}</span>
                  </div>
                </div>

                {/* Deposit Progress */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#F4EFEA]/60">Deposit Collected: ₦{c.depositPaidNGN.toLocaleString()}</span>
                    <span className="font-mono text-[#10B981]">{percentFunded}% funded</span>
                  </div>
                  <div className="w-full bg-[#121110] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#10B981] h-full"
                      style={{ width: `${percentFunded}%` }}
                    ></div>
                  </div>
                </div>

                {c.notes && (
                  <p className="text-xs text-[#F4EFEA]/60 italic bg-[#121110]/50 p-2.5 rounded border border-white/5">
                    &quot;{c.notes}&quot;
                  </p>
                )}
              </div>

              {/* Status Switcher & Action */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <label className="text-[11px] text-[#F4EFEA]/50">Status:</label>
                  <select
                    value={c.status}
                    onChange={(e) => updateBulkContractStatus(c.id, e.target.value as any)}
                    className="bg-[#121110] border border-white/10 rounded px-2.5 py-1 text-xs text-[#D4AF37] focus:outline-none cursor-pointer"
                  >
                    <option value="draft">Draft</option>
                    <option value="deposit_pending">Deposit Pending</option>
                    <option value="fabric_procurement">Fabric Procurement</option>
                    <option value="mass_production">Mass Production</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <button
                  onClick={() => handleCopyProposal(c)}
                  className="px-3 py-1 text-xs text-[#F4EFEA]/80 hover:text-[#F4EFEA] bg-[#121110] hover:bg-[#201D1A] rounded border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3 text-[#D4AF37]" />
                  <span>Proposal</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Bulk Contract Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#181615] border border-[#D4AF37]/40 rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-[#F4EFEA]/60 hover:text-[#F4EFEA] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif-luxury text-xl text-[#F4EFEA]">
              Log Institutional Bulk Production Contract
            </h2>

            <form onSubmit={handleCreateContract} className="space-y-4">
              <div>
                <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Organization Name *</label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Corona Secondary School"
                  className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Contract Category</label>
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value as any)}
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="school_uniform">School Uniforms</option>
                    <option value="corporate_uniform">Corporate Staff Uniforms</option>
                    <option value="hospitality">Hospitality Staff Uniforms</option>
                    <option value="church_uniform">Church Choir & Usher Attire</option>
                    <option value="event_aso_ebi">Event Group & Aso-Ebi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Delivery Deadline</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Mrs. Adeola Johnson"
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Quantity (Pieces)</label>
                  <input
                    type="number"
                    min="10"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs font-mono text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Unit Price (₦)</label>
                  <input
                    type="number"
                    step="500"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs font-mono text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Deposit Paid (₦)</label>
                  <input
                    type="number"
                    step="10000"
                    value={depositPaid}
                    onChange={(e) => setDepositPaid(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs font-mono text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded bg-[#121110] border border-white/10 flex items-center justify-between text-xs">
                <span className="text-[#F4EFEA]/70">Calculated Contract Value:</span>
                <span className="font-mono text-base font-bold text-[#D4AF37]">
                  ₦{totalValue.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-[#F4EFEA]/70 mb-1">Garment Specs & Fabric Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Navy blue gabardine fabric with embroidered school crest on front pocket."
                  className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#F4EFEA]/60 hover:text-[#F4EFEA] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#D4AF37] hover:bg-[#C59B27] text-[#121110] text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
                >
                  Save Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
