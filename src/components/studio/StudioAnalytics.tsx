/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { BarChart3, TrendingUp, ShieldCheck, DollarSign, Users, Scissors, RotateCcw, Download, Upload } from 'lucide-react';

export const StudioAnalytics: React.FC = () => {
  const {
    orders,
    measurementCards,
    bulkContracts,
    resetToDefaults,
    exportDatabaseJSON,
    importDatabaseJSON,
    showToast,
    bankDetails,
    updateBankDetails,
    studioPin,
    setStudioPin
  } = useAtelier();

  // Metrics computation
  const totalBespokeRevenue = orders.reduce((acc, o) => acc + o.quotedPrice, 0);
  const totalBulkRevenue = bulkContracts.reduce((acc, c) => acc + c.totalContractValueNGN, 0);
  const aggregateRevenue = totalBespokeRevenue + totalBulkRevenue;

  const totalDepositsCollected = orders.reduce((acc, o) => acc + (o.depositPaid ? o.depositAmount : 0), 0) +
    bulkContracts.reduce((acc, c) => acc + c.depositPaidNGN, 0);

  const totalCost = orders.reduce((acc, o) => acc + o.costBreakdown.totalCost, 0);
  const aggregateGrossProfit = totalBespokeRevenue - totalCost;
  const overallMargin = totalBespokeRevenue > 0 ? Math.round((aggregateGrossProfit / totalBespokeRevenue) * 100) : 0;

  const inProductionOrders = orders.filter((o) => o.stage >= 5 && o.stage <= 8).length;
  const completedOrders = orders.filter((o) => o.stage >= 9).length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importDatabaseJSON(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
          Section 13 · Key Performance Indicators (KPIs)
        </span>
        <h1 className="font-serif-luxury text-2xl md:text-3xl text-[#F4EFEA]">
          Studio Financials & Production Health
        </h1>
        <p className="text-xs sm:text-sm text-[#F4EFEA]/70 max-w-2xl">
          Real-time oversight of customer acquisition, cashflow solvency under the lean ₦0–₦200k startup model, and tailor production efficiency.
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#181615] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#F4EFEA]/50">
            <span>Aggregate Booked Revenue</span>
            <DollarSign className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#F4EFEA] tabular-nums">
            ₦{aggregateRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#D4AF37] block">
            ₦{totalBespokeRevenue.toLocaleString()} Bespoke · ₦{totalBulkRevenue.toLocaleString()} Bulk
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#181615] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#F4EFEA]/50">
            <span>Deposits Secured Upfront</span>
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#10B981] tabular-nums">
            ₦{totalDepositsCollected.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#F4EFEA]/60 block">
            100% of fabric & trim costs pre-funded
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#181615] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#F4EFEA]/50">
            <span>Average Bespoke Margin</span>
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#D4AF37] tabular-nums">
            {overallMargin}%
          </div>
          <span className="text-[11px] text-[#F4EFEA]/60 block">
            ₦{aggregateGrossProfit.toLocaleString()} gross profit pool
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#181615] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#F4EFEA]/50">
            <span>Active Craft Pipeline</span>
            <Scissors className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#F4EFEA] tabular-nums">
            {inProductionOrders} Pieces
          </div>
          <span className="text-[11px] text-[#10B981] block">
            {completedOrders} commissions delivered
          </span>
        </div>
      </div>

      {/* Lean Capital & Operational Integrity Strategy */}
      <div className="p-6 rounded-xl bg-[#181615] border border-[#D4AF37]/30 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-luxury text-lg text-[#F4EFEA]">
            PRD Section 10 & 14: Lean Risk Mitigation Scoreboard
          </h2>
          <span className="text-xs font-mono text-[#10B981] bg-[#10B981]/10 px-2.5 py-0.5 rounded border border-[#10B981]/30">
            Cashflow Solvency: OPTIMAL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-[#121110] border border-white/5 space-y-2">
            <span className="font-semibold text-[#D4AF37] block">1. Zero Rental Overhead</span>
            <p className="text-[#F4EFEA]/70 leading-relaxed">
              Operating initially from a designated home-based studio space eliminates fixed monthly lease obligations and commercial generator overhead during Phase 1 & 2.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#121110] border border-white/5 space-y-2">
            <span className="font-semibold text-[#D4AF37] block">2. Deposit-Funded Procurement</span>
            <p className="text-[#F4EFEA]/70 leading-relaxed">
              Customer deposits (minimum 60%) are received prior to Stage 5 fabric sourcing. The business operates without borrowing working capital or tying up capital in speculative fabric rolls.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#121110] border border-white/5 space-y-2">
            <span className="font-semibold text-[#D4AF37] block">3. Hybrid Production Scale</span>
            <p className="text-[#F4EFEA]/70 leading-relaxed">
              In-house tailors handle routine sewing, while vetted external production partners (Madam Folake for Aso-Oke, Taiwo Embroidery) provide elastic capacity for bulk contracts.
            </p>
          </div>
        </div>
      </div>

      {/* Studio Administrative Settings: Bank & Security */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bank Details Configuration */}
        <div className="p-6 rounded-xl bg-[#181615] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-luxury text-base text-[#F4EFEA] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              <span>Official Bank Transfer Details</span>
            </h3>
            <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold">Deposit Engine</span>
          </div>
          <p className="text-xs text-[#F4EFEA]/70 leading-relaxed">
            These details appear on client quotes and in WhatsApp invoice messages for the 60% fabric deposit.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const bankName = (form.elements.namedItem('bankName') as HTMLInputElement).value;
              const accountNumber = (form.elements.namedItem('accountNumber') as HTMLInputElement).value;
              const accountName = (form.elements.namedItem('accountName') as HTMLInputElement).value;
              const note = (form.elements.namedItem('note') as HTMLTextAreaElement).value;
              updateBankDetails({ bankName, accountNumber, accountName, note });
            }}
            className="space-y-3 pt-1 text-xs"
          >
            <div>
              <label className="block text-[11px] text-[#F4EFEA]/60 mb-1">Bank Name</label>
              <input
                name="bankName"
                defaultValue={bankDetails.bankName}
                required
                className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#F4EFEA]/60 mb-1">Account Number (NUBAN)</label>
              <input
                name="accountNumber"
                defaultValue={bankDetails.accountNumber}
                required
                className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 font-mono text-[#D4AF37] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#F4EFEA]/60 mb-1">Account Name</label>
              <input
                name="accountName"
                defaultValue={bankDetails.accountName}
                required
                className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#F4EFEA]/60 mb-1">Transfer Narration / Receipt Note</label>
              <textarea
                name="note"
                rows={2}
                defaultValue={bankDetails.note}
                className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C59B27] text-[#121110] font-semibold uppercase tracking-wider rounded text-xs transition-colors cursor-pointer"
            >
              Save Bank Configuration
            </button>
          </form>
        </div>

        {/* Security & Studio PIN */}
        <div className="p-6 rounded-xl bg-[#181615] border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-luxury text-base text-[#F4EFEA] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                <span>Studio OS Access Security</span>
              </h3>
              <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold">PIN Lock</span>
            </div>
            <p className="text-xs text-[#F4EFEA]/70 leading-relaxed">
              Your 4-digit Master Tailor PIN protects wholesale garment costs, production records, and client body metrics from public view.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const newPin = (form.elements.namedItem('newPin') as HTMLInputElement).value;
                if (newPin.length < 4) {
                  showToast('PIN must be at least 4 digits', 'warning');
                  return;
                }
                setStudioPin(newPin);
                form.reset();
              }}
              className="space-y-3 pt-1 text-xs"
            >
              <div className="p-3 bg-[#121110] rounded border border-white/5 space-y-1">
                <span className="text-[11px] text-[#F4EFEA]/50 block">Current Active PIN</span>
                <span className="font-mono text-base font-bold text-[#D4AF37] tracking-widest">{studioPin}</span>
              </div>

              <div>
                <label className="block text-[11px] text-[#F4EFEA]/60 mb-1">Set New 4-Digit PIN</label>
                <input
                  name="newPin"
                  type="password"
                  maxLength={6}
                  placeholder="e.g. 2026"
                  required
                  className="w-full bg-[#121110] border border-white/10 rounded px-3 py-2 font-mono text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-[#221F1C] hover:bg-[#2E2A27] text-[#D4AF37] border border-[#D4AF37]/40 font-semibold uppercase tracking-wider rounded text-xs transition-colors cursor-pointer"
              >
                Update Access PIN
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-white/5 text-[11px] text-[#F4EFEA]/50">
            Tip: You can quickly lock the studio console anytime using the <strong>Lock OS</strong> button in the top navigation bar.
          </div>
        </div>
      </div>

      {/* Studio Database Backup & Administrative Controls */}
      <div className="p-6 rounded-xl bg-[#181615] border border-white/10 space-y-4">
        <h3 className="font-serif-luxury text-base text-[#F4EFEA]">
          Studio Data Management & Export
        </h3>
        <p className="text-xs text-[#F4EFEA]/70">
          Export your complete studio database (orders, measurement vault, catalog inventory, and bulk contracts) to JSON, or restore from a previous backup.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={exportDatabaseJSON}
            className="px-4 py-2 bg-[#221F1C] hover:bg-[#2E2A27] text-[#D4AF37] border border-[#D4AF37]/30 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Studio Backup (.json)</span>
          </button>

          <label className="px-4 py-2 bg-[#121110] hover:bg-[#1C1A18] text-[#F4EFEA] border border-white/10 rounded text-xs font-medium uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Restore from File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={resetToDefaults}
            className="px-4 py-2 bg-transparent hover:bg-red-500/10 text-red-400 border border-red-500/20 rounded text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
