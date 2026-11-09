/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { ORDER_STAGES } from '../../data/stageDefinitions';
import { Search, CheckCircle2, Clock, ShieldCheck, Scissors, Calendar, User, Phone } from 'lucide-react';

export const OrderTracker: React.FC = () => {
  const { orders } = useAtelier();
  const [searchId, setSearchId] = useState('KLM-1021');
  const [selectedOrder, setSelectedOrder] = useState(() => orders[0]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchId.trim().toUpperCase();
    const found = orders.find((o) => o.id.toUpperCase() === query);
    if (found) {
      setSelectedOrder(found);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
          Section 7 · Transparent Order Lifecycle
        </span>
        <h1 className="font-serif-luxury text-3xl md:text-4xl text-[#F4EFEA]">
          Track Your ATX Commission
        </h1>
        <p className="text-xs sm:text-sm text-[#F4EFEA]/70 max-w-lg mx-auto">
          Enter your unique ATX Fashion Studio commission code to inspect real-time progress across our 10-stage craft lifecycle.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md mx-auto pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F4EFEA]/40" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter order code (e.g. KLM-1021)"
              className="w-full bg-[#181615] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#F4EFEA] uppercase tracking-wider font-mono placeholder:text-white/20 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#C59B27] text-[#121110] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
          >
            Track
          </button>
        </form>

        {/* Quick Sample Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] text-[#F4EFEA]/60">
          <span>Recent demonstrations:</span>
          {orders.slice(0, 4).map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setSearchId(o.id);
                setSelectedOrder(o);
              }}
              className={`px-2 py-0.5 rounded font-mono text-[11px] transition-colors ${
                selectedOrder?.id === o.id
                  ? 'bg-[#D4AF37] text-[#121110] font-semibold'
                  : 'bg-[#1C1A18] text-[#F4EFEA]/70 hover:text-[#F4EFEA]'
              }`}
            >
              {o.id}
            </button>
          ))}
        </div>
      </div>

      {selectedOrder ? (
        <div className="space-y-8 bg-[#181615] border border-white/10 rounded-xl p-6 md:p-8">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xl font-bold text-[#D4AF37]">
                  {selectedOrder.id}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-[#F4EFEA]/60 bg-[#121110] px-2.5 py-0.5 rounded border border-white/10">
                  {selectedOrder.division.replace('_', ' ')}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-[#D4AF37] bg-[#221F1C] px-2.5 py-0.5 rounded border border-[#D4AF37]/30">
                  {selectedOrder.tier} Tier
                </span>
              </div>
              <h2 className="font-serif-luxury text-2xl text-[#F4EFEA] mt-1">
                {selectedOrder.garmentTitle}
              </h2>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="text-[11px] text-[#F4EFEA]/50">Target Delivery</div>
              <div className="flex items-center gap-1.5 sm:justify-end text-xs font-medium text-[#F4EFEA]">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{selectedOrder.targetDeliveryDate}</span>
              </div>
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-[#121110] border border-white/5 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#F4EFEA]/50">Patron</span>
              <div className="font-medium text-[#F4EFEA]">{selectedOrder.clientName}</div>
              <div className="text-[11px] text-[#F4EFEA]/60">{selectedOrder.clientPhone}</div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#121110] border border-white/5 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#F4EFEA]/50">Fabric & Detailing</span>
              <div className="font-medium text-[#F4EFEA] truncate">{selectedOrder.fabricDescription}</div>
              <div className="text-[11px] text-[#D4AF37]">{selectedOrder.colorPalette}</div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#121110] border border-white/5 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#F4EFEA]/50">Financial Status</span>
              <div className="font-mono text-sm font-bold text-[#F4EFEA] tabular-nums">
                ₦{selectedOrder.quotedPrice.toLocaleString()}
              </div>
              <div className="text-[11px] flex items-center gap-1">
                {selectedOrder.depositPaid ? (
                  <span className="text-[#10B981] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Deposit of ₦{selectedOrder.depositAmount.toLocaleString()} Confirmed
                  </span>
                ) : (
                  <span className="text-amber-400">Deposit Pending</span>
                )}
              </div>
            </div>
          </div>

          {/* 10-Stage Progression Visualizer */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                Craft Milestones (Stage {selectedOrder.stage} of 10)
              </h3>
              <span className="text-xs text-[#F4EFEA]/60">
                {ORDER_STAGES.find((s) => s.stage === selectedOrder.stage)?.title}
              </span>
            </div>

            {/* Stepper Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {ORDER_STAGES.map((s) => {
                const isPassed = selectedOrder.stage > s.stage;
                const isCurrent = selectedOrder.stage === s.stage;

                return (
                  <div
                    key={s.stage}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isCurrent
                        ? 'bg-[#221F1C] border-[#D4AF37] ring-1 ring-[#D4AF37]/50'
                        : isPassed
                        ? 'bg-[#121110] border-[#10B981]/40'
                        : 'bg-[#121110]/50 border-white/5 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] text-[#F4EFEA]/50">#{s.stage}</span>
                      {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />}
                      {isCurrent && <Clock className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />}
                    </div>
                    <div className={`text-xs font-semibold leading-tight ${isCurrent ? 'text-[#D4AF37]' : isPassed ? 'text-[#F4EFEA]' : 'text-[#F4EFEA]/40'}`}>
                      {s.title}
                    </div>
                    <div className="text-[10px] text-[#F4EFEA]/50 mt-1 line-clamp-2">
                      {s.shortDesc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Event Timeline Log */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
              ATX Notes & Timeline
            </h4>
            <div className="space-y-2">
              {selectedOrder.history.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs p-2.5 rounded bg-[#121110] border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[11px] text-[#F4EFEA]/50 mb-0.5">
                      <span className="font-semibold text-[#D4AF37]">Stage {event.stage}</span>
                      <span className="font-mono">{event.timestamp}</span>
                    </div>
                    <p className="text-[#F4EFEA]/80">{event.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-[#F4EFEA]/60">
          No order found with code &quot;{searchId}&quot;. Please check your reference number.
        </div>
      )}
    </div>
  );
};
