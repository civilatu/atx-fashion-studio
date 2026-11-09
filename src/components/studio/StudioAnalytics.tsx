/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { BarChart3, TrendingUp, ShieldCheck, DollarSign, Users, Scissors, RotateCcw, Download, Upload } from 'lucide-react';

export const StudioAnalytics: React.FC = () => {
  const { orders, measurementCards, bulkContracts, resetToDefaults, exportDatabaseJSON, importDatabaseJSON, showToast } = useAtelier();

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
