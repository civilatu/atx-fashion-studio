/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { ORDER_STAGES } from '../../data/stageDefinitions';
import { AtelierOrder, OrderStage } from '../../types/atelier';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  Filter,
  DollarSign,
  User,
  Scissors,
  Calendar,
  MessageSquare,
  ShieldAlert,
  X,
  FileText
} from 'lucide-react';

export const PipelineKanban: React.FC = () => {
  const {
    orders,
    updateOrderStage,
    recordDepositPayment,
    recordFinalPayment,
    assignTailorToOrder,
    updateQualityInspection,
    generateWhatsAppInvoice,
    generateWhatsAppOrderMessage,
    showToast
  } = useAtelier();

  const [selectedOrder, setSelectedOrder] = useState<AtelierOrder | null>(null);
  const [stageFilter, setStageFilter] = useState<number | 'all'>('all');
  const [tailorFilter, setTailorFilter] = useState<string>('all');
  const [inspectionNotes, setInspectionNotes] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (stageFilter !== 'all' && o.stage !== stageFilter) return false;
    if (tailorFilter !== 'all' && !o.assignedTailorName.toLowerCase().includes(tailorFilter.toLowerCase())) return false;
    return true;
  });

  const handleAdvanceStage = (order: AtelierOrder) => {
    if (order.stage >= 10) {
      showToast('Order is already at final delivery stage', 'info');
      return;
    }

    const nextStage = (order.stage + 1) as OrderStage;

    // Lean working capital safeguard:
    // Moving into Stage 5 (Fabric Sourced) or Stage 6 (In Production) requires deposit confirmation
    if (nextStage >= 5 && !order.depositPaid) {
      showToast(
        `Lean Principle Alert: Order ${order.id} deposit is not cleared! PRD Section 8 mandates collecting deposits before purchasing fabrics or cutting.`,
        'warning'
      );
    }

    updateOrderStage(order.id, nextStage);
    if (selectedOrder?.id === order.id) {
      setSelectedOrder({
        ...selectedOrder,
        stage: nextStage,
        history: [
          ...selectedOrder.history,
          {
            stage: nextStage,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            note: `Advanced to Stage ${nextStage} (${ORDER_STAGES.find((s) => s.stage === nextStage)?.title})`
          }
        ]
      });
    }
  };

  const handleCopyInvoice = (order: AtelierOrder) => {
    const text = generateWhatsAppInvoice(order);
    navigator.clipboard.writeText(text);
    showToast(`WhatsApp invoice copied to clipboard for ${order.id}!`, 'success');
  };

  const handleCopyUpdate = (order: AtelierOrder) => {
    const text = generateWhatsAppOrderMessage(order);
    navigator.clipboard.writeText(text);
    showToast(`WhatsApp progress update copied for ${order.id}!`, 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-6 py-6">
      {/* Top Banner & Lean Capital Principles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#181615] border border-[#D4AF37]/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-serif-luxury text-lg text-[#F4EFEA]">ATX Production Pipeline</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold bg-[#221F1C] text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/30">
              10 PRD Milestones
            </span>
          </div>
          <p className="text-xs text-[#F4EFEA]/70">
            Enforcing the deposit-first lean manufacturing model to protect studio cash flow and avoid unpaid inventory holding.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-[#121110] px-2.5 py-1.5 rounded border border-white/10">
            <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-transparent text-[#F4EFEA] text-xs focus:outline-none cursor-pointer"
            >
              <option value="all">All 10 Stages</option>
              {ORDER_STAGES.map((s) => (
                <option key={s.stage} value={s.stage}>
                  Stage {s.stage}: {s.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#121110] px-2.5 py-1.5 rounded border border-white/10">
            <Scissors className="w-3.5 h-3.5 text-[#D4AF37]" />
            <select
              value={tailorFilter}
              onChange={(e) => setTailorFilter(e.target.value)}
              className="bg-transparent text-[#F4EFEA] text-xs focus:outline-none cursor-pointer"
            >
              <option value="all">All Tailor Frames</option>
              <option value="Ibrahim">Master Ibrahim</option>
              <option value="Grace">Grace Adele</option>
              <option value="Folake">Madam Folake (Aso-Oke)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table & Cards View */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredOrders.map((order) => {
          const currentStageDef = ORDER_STAGES.find((s) => s.stage === order.stage);
          const needsDepositAlert = order.stage >= 4 && !order.depositPaid;
          const balanceDue = Math.max(0, order.quotedPrice - (order.depositPaid ? order.depositAmount : 0));

          return (
            <div
              key={order.id}
              className={`rounded-xl bg-[#181615] border transition-all flex flex-col justify-between p-5 space-y-4 ${
                selectedOrder?.id === order.id
                  ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/50 bg-[#1D1A18]'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#D4AF37]">{order.id}</span>
                    <span className="text-[10px] text-[#F4EFEA]/50 bg-[#121110] px-2 py-0.5 rounded uppercase">
                      {order.tier}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#F4EFEA]/50">
                    Due: {order.targetDeliveryDate}
                  </span>
                </div>

                <h3 className="font-serif-luxury text-base text-[#F4EFEA] leading-snug">
                  {order.garmentTitle}
                </h3>

                <div className="text-xs text-[#F4EFEA]/70 flex items-center justify-between">
                  <span>Patron: {order.clientName}</span>
                  <span className="font-mono text-[#D4AF37]">₦{order.quotedPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Stage Badge & Safeguard */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#F4EFEA]/50">Current Stage:</span>
                  <span className="font-semibold text-[#D4AF37]">
                    #{order.stage}. {currentStageDef?.title}
                  </span>
                </div>

                {/* Progress Bar (10 steps) */}
                <div className="w-full bg-[#121110] h-1.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-gradient-to-r from-[#D4AF37] to-[#10B981] h-full transition-all duration-500"
                    style={{ width: `${(order.stage / 10) * 100}%` }}
                  ></div>
                </div>

                {/* Deposit Warning */}
                {needsDepositAlert && (
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-[11px] text-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Deposit of ₦{order.depositAmount.toLocaleString()} pending! Secure funds before cutting.</span>
                  </div>
                )}

                {/* Tailor & Quality Status */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#F4EFEA]/60 pt-1">
                  <div className="truncate">
                    Tailor: <span className="text-[#F4EFEA]">{order.assignedTailorName.split('(')[0]}</span>
                  </div>
                  <div className="text-right">
                    Quality: {order.qualityCheckPassed ? (
                      <span className="text-[#10B981]">Passed</span>
                    ) : (
                      <span className="text-[#F4EFEA]/40">Pending</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="px-3 py-1.5 text-xs text-[#F4EFEA]/80 hover:text-[#F4EFEA] bg-[#121110] hover:bg-[#201D1A] rounded border border-white/10 transition-colors cursor-pointer"
                >
                  Inspect Order
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyInvoice(order)}
                    title="Copy WhatsApp Invoice"
                    className="p-1.5 rounded bg-[#121110] hover:bg-[#201D1A] text-[#D4AF37] border border-white/10 transition-colors cursor-pointer"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleAdvanceStage(order)}
                    disabled={order.stage >= 10}
                    className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#121110] bg-[#D4AF37] hover:bg-[#C59B27] disabled:opacity-40 disabled:cursor-not-allowed rounded transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Stage {order.stage < 10 ? order.stage + 1 : 'Done'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Detail & Management Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#181615] border border-[#D4AF37]/40 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-1.5 text-[#F4EFEA]/60 hover:text-[#F4EFEA] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-base font-bold text-[#D4AF37]">{selectedOrder.id}</span>
                  <span className="text-[#F4EFEA]/50 uppercase">{selectedOrder.division.replace('_', ' ')}</span>
                  <span className="text-[#D4AF37] uppercase font-semibold">({selectedOrder.tier} Tier)</span>
                </div>
                <h2 className="font-serif-luxury text-2xl text-[#F4EFEA] mt-1">
                  {selectedOrder.garmentTitle}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyInvoice(selectedOrder)}
                  className="px-3 py-1.5 text-xs font-medium bg-[#121110] hover:bg-[#201D1A] text-[#D4AF37] border border-[#D4AF37]/30 rounded flex items-center gap-1.5 cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Copy WhatsApp Invoice</span>
                </button>
                <button
                  onClick={() => handleCopyUpdate(selectedOrder)}
                  className="px-3 py-1.5 text-xs font-medium bg-[#121110] hover:bg-[#201D1A] text-[#F4EFEA] border border-white/10 rounded flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Copy Client Update</span>
                </button>
              </div>
            </div>

            {/* Stage Stepper Control */}
            <div className="space-y-3 p-4 rounded-lg bg-[#121110] border border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#D4AF37] uppercase tracking-wider">
                  Update Production Stage
                </span>
                <span className="text-[#F4EFEA]/50">Click any stage to set status</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {ORDER_STAGES.map((s) => (
                  <button
                    key={s.stage}
                    onClick={() => {
                      updateOrderStage(selectedOrder.id, s.stage);
                      setSelectedOrder({ ...selectedOrder, stage: s.stage });
                    }}
                    className={`p-2 rounded text-left border transition-all cursor-pointer ${
                      selectedOrder.stage === s.stage
                        ? 'bg-[#221F1C] border-[#D4AF37] text-[#D4AF37]'
                        : selectedOrder.stage > s.stage
                        ? 'bg-[#181615] border-[#10B981]/40 text-[#10B981]'
                        : 'bg-[#181615]/50 border-white/5 text-[#F4EFEA]/40'
                    }`}
                  >
                    <div className="font-mono text-[10px]">#{s.stage}</div>
                    <div className="text-[11px] font-medium leading-tight truncate">{s.title}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Status & Payment Handlers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-[#121110] border border-white/5 space-y-3">
                <span className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold block">
                  Deposit & Payment Reconciliation
                </span>
                <div className="space-y-1.5 text-xs text-[#F4EFEA]/70">
                  <div className="flex justify-between">
                    <span>Quoted Retail Price:</span>
                    <span className="font-mono text-[#F4EFEA] font-bold">₦{selectedOrder.quotedPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Required Deposit (60%):</span>
                    <span className="font-mono">₦{selectedOrder.depositAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deposit Status:</span>
                    {selectedOrder.depositPaid ? (
                      <span className="text-[#10B981] font-semibold">Cleared (₦{selectedOrder.depositAmount.toLocaleString()})</span>
                    ) : (
                      <span className="text-amber-400 font-semibold">Unpaid</span>
                    )}
                  </div>
                  <div className="flex justify-between pt-1 border-t border-white/5">
                    <span>Balance Due on Delivery:</span>
                    <span className="font-mono text-[#D4AF37] font-bold">
                      ₦{Math.max(0, selectedOrder.quotedPrice - (selectedOrder.depositPaid ? selectedOrder.depositAmount : 0)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  {!selectedOrder.depositPaid ? (
                    <button
                      onClick={() => {
                        recordDepositPayment(selectedOrder.id, selectedOrder.depositAmount);
                        setSelectedOrder({ ...selectedOrder, depositPaid: true, stage: Math.max(4, selectedOrder.stage) as OrderStage });
                      }}
                      className="w-full py-2 bg-[#10B981] hover:bg-[#059669] text-[#121110] font-semibold uppercase tracking-wider rounded transition-colors text-[11px] cursor-pointer"
                    >
                      Record Deposit Cleared
                    </button>
                  ) : !selectedOrder.finalPaymentPaid ? (
                    <button
                      onClick={() => {
                        recordFinalPayment(selectedOrder.id);
                        setSelectedOrder({ ...selectedOrder, finalPaymentPaid: true, stage: Math.max(9, selectedOrder.stage) as OrderStage });
                      }}
                      className="w-full py-2 bg-[#D4AF37] hover:bg-[#C59B27] text-[#121110] font-semibold uppercase tracking-wider rounded transition-colors text-[11px] cursor-pointer"
                    >
                      Clear Final Balance
                    </button>
                  ) : (
                    <div className="w-full py-1.5 text-center text-[#10B981] bg-[#10B981]/10 rounded border border-[#10B981]/30 font-semibold text-[11px]">
                      Fully Paid & Reconciled
                    </div>
                  )}
                </div>
              </div>

              {/* Tailor Assignment & Production Frame */}
              <div className="p-4 rounded-lg bg-[#121110] border border-white/5 space-y-3">
                <span className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold block">
                  Tailor Assignment & Partner Network
                </span>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] text-[#F4EFEA]/60 mb-1">Assigned Artisan</label>
                    <select
                      value={selectedOrder.assignedTailorName}
                      onChange={(e) => {
                        const name = e.target.value;
                        const type = name.includes('Partner') ? 'external_partner' : 'in_house';
                        assignTailorToOrder(selectedOrder.id, name, type);
                        setSelectedOrder({ ...selectedOrder, assignedTailorName: name, assignedTailorType: type });
                      }}
                      className="w-full bg-[#181615] border border-white/10 rounded px-3 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none cursor-pointer"
                    >
                      <option value="Master Ibrahim (Lead Artisan - In-House)">Master Ibrahim (Lead In-House)</option>
                      <option value="Grace Adele (In-House Tailor)">Grace Adele (In-House Tailor)</option>
                      <option value="Madam Folake (Master Aso-Oke Loom Partner)">Madam Folake (External Aso-Oke Partner)</option>
                      <option value="Taiwo Embroidery Studios (External Partner)">Taiwo Embroidery (External Partner)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#F4EFEA]/60 mb-1">PRD Quality Audit Verification</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={inspectionNotes}
                        onChange={(e) => setInspectionNotes(e.target.value)}
                        placeholder="e.g. Hem symmetry verified, thread ends trimmed"
                        className="flex-1 bg-[#181615] border border-white/10 rounded px-3 py-1.5 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          const note = inspectionNotes.trim() || 'Passed 10-point studio quality checklist';
                          updateQualityInspection(selectedOrder.id, true, note);
                          setSelectedOrder({ ...selectedOrder, qualityCheckPassed: true, qualityCheckNotes: note });
                          setInspectionNotes('');
                        }}
                        className="px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] text-[#121110] font-semibold text-[11px] rounded transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Pass Audit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* History Log */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-xs uppercase tracking-wider text-[#F4EFEA]/70 font-semibold block">
                Production Audit Trail
              </span>
              <div className="max-h-36 overflow-y-auto space-y-1.5 text-xs">
                {selectedOrder.history.map((ev, i) => (
                  <div key={i} className="flex items-baseline justify-between p-2 rounded bg-[#121110] text-[11px]">
                    <span className="text-[#D4AF37] font-semibold">Stage {ev.stage}: <span className="text-[#F4EFEA]/80 font-normal">{ev.note}</span></span>
                    <span className="font-mono text-[#F4EFEA]/40 shrink-0 ml-4">{ev.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
