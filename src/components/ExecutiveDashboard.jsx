import React, { useState } from 'react';
import { BarChart3, Download, FileSpreadsheet, FileText, DollarSign, PieChart, Layers, ArrowUpRight, CheckCircle2, AlertCircle, Clock, Sparkles } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, AreaChart, Area } from 'recharts';
import { generateExecutivePDF, generateExecutiveExcel } from '../utils/exportUtils';

export default function ExecutiveDashboard({ analyticsData, deliverables, invoices }) {
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [exporting, setExporting] = useState(false);

  const summary = analyticsData?.summary || {
    total_deliverables: 8,
    total_invoiced_inr: 2030000,
    certified_balance_inr: 2670000,
    pending_zero_value_balance_inr: 4000000,
    grand_total_portfolio_inr: 8700000
  };

  const districtData = analyticsData?.districtBreakdown || [];
  const monthlyData = analyticsData?.monthlyCashFlow || [];

  const filteredDeliverables = districtFilter === 'ALL'
    ? deliverables
    : deliverables.filter(d => d.district === districtFilter);

  const handleExportPDF = () => {
    setExporting(true);
    try {
      generateExecutivePDF(analyticsData, deliverables, invoices);
    } catch (err) {
      console.error('PDF Export Error:', err);
    }
    setTimeout(() => setExporting(false), 800);
  };

  const handleExportExcel = () => {
    setExporting(true);
    try {
      generateExecutiveExcel(analyticsData, deliverables, invoices);
    } catch (err) {
      console.error('Excel Export Error:', err);
    }
    setTimeout(() => setExporting(false), 800);
  };

  return (
    <div className="space-y-6">
      {/* Tier 2 Banner & Integrated One-Tap Summary Generator Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-800/40 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                  Tier 2 • Executive Management
                </span>
                <span className="text-xs text-slate-400">• Real-Time Cash Flow Analytics</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">District-Wide Inspection & Financial Overview</h2>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Centralized executive portal for multi-district inspection monitoring, pending vs. certified balance tracking, and real-time cash flow analytics.
              </p>
            </div>
          </div>

          {/* Key Feature: One-Tap Summary Generator Box */}
          <div className="bg-slate-900/90 border border-blue-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3 shadow-lg ring-1 ring-blue-500/20">
            <div className="text-left sm:text-right">
              <div className="flex items-center text-xs font-bold text-blue-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                One-Tap Summary Generator
              </div>
              <p className="text-[11px] text-slate-400">Compute aggregated balances & export PDF/Excel</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg transition shadow-md shadow-blue-600/30"
              >
                <FileText className="w-4 h-4 text-blue-200" />
                <span>Export PDF</span>
              </button>

              <button
                onClick={handleExportExcel}
                disabled={exporting}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition shadow-md shadow-emerald-600/30"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                <span>Export Excel</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Financial Metric Cards (Pending vs Certified Balances) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Invoiced */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Certified Invoiced</span>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2 font-mono">
            ₹{(summary.total_invoiced_inr / 100000).toFixed(2)} Lakhs
          </p>
          <p className="text-xs text-slate-400 mt-1 flex items-center">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 mr-1" />
            Certified & Linked to Issued Invoices
          </p>
        </div>

        {/* Certified Balance Ready for Billing */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Certified Unbilled Balance</span>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2 font-mono">
            ₹{(summary.certified_balance_inr / 100000).toFixed(2)} Lakhs
          </p>
          <p className="text-xs text-slate-400 mt-1">Ready for Billing & QA Invoice Mapping</p>
        </div>

        {/* Pending / Zero-Value Balance */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Pending / Zero-Value</span>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400 mt-2 font-mono">
            ₹{(summary.pending_zero_value_balance_inr / 100000).toFixed(2)} Lakhs
          </p>
          <p className="text-xs text-slate-400 mt-1">Requires QA Resolution & Valuation</p>
        </div>

        {/* Total Deliverables Volume */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Inspection Deliverables</span>
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2 font-mono">
            {summary.total_deliverables} Reports
          </p>
          <p className="text-xs text-slate-400 mt-1">Across 6 Key Districts in Haryana</p>
        </div>

      </div>

      {/* Visual Analytics Grid: District Breakdown & Monthly Cash Flow Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* District Financial Breakdown Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center">
                <PieChart className="w-5 h-5 text-blue-400 mr-2" />
                District Financial Breakdown (INR in Lakhs)
              </h3>
              <p className="text-xs text-slate-400">Comparison of Invoiced vs. Certified vs. Pending Zero-Value balances per district.</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="district" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Invoiced" fill="#3b82f6" name="Invoiced (₹ Lakhs)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Certified" fill="#10b981" name="Certified (₹ Lakhs)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="PendingZeroValue" fill="#f59e0b" name="Pending / Zero-Value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Cash Flow Trend Area Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center">
                <ArrowUpRight className="w-5 h-5 text-emerald-400 mr-2" />
                Real-Time Cash Flow Analytics & Growth Trend
              </h3>
              <p className="text-xs text-slate-400">Monthly inspection revenue generation vs pending pipeline.</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInvoiced" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="invoiced" stroke="#3b82f6" fillOpacity={1} fill="url(#colorInvoiced)" name="Invoiced Cash Flow (₹ Lakhs)" />
                <Area type="monotone" dataKey="pending" stroke="#f59e0b" fillOpacity={1} fill="url(#colorPending)" name="Pending Pipeline (₹ Lakhs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Historical Reporting & Filterable Deliverables Master Ledger */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center">
              <Layers className="w-5 h-5 text-indigo-400 mr-2" />
              High-Level Historical Inspection Ledger
            </h3>
            <p className="text-xs text-slate-400">Review status mappings, raw file attachments, and mapped invoice numbers.</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">Filter District:</span>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 font-semibold"
            >
              <option value="ALL">All Districts (Global)</option>
              <option value="Gurugram">Gurugram District</option>
              <option value="Faridabad">Faridabad District</option>
              <option value="Ambala">Ambala District</option>
              <option value="Hisar">Hisar District</option>
              <option value="Karnal">Karnal District</option>
              <option value="Rohtak">Rohtak District</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 uppercase text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Certified Valuation</th>
                <th className="py-3 px-4">Linked Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDeliverables.map(del => {
                const getStatusBadge = (status) => {
                  switch (status) {
                    case 'INVOICED': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                    case 'CERTIFIED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                    case 'ZERO_VALUE': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                    default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                  }
                };
                return (
                  <tr key={del.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200">{del.id}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-white">{del.title}</p>
                      <p className="text-[11px] text-slate-400">Engineer: {del.engineer_name} • File: <span className="font-mono text-slate-300">{del.raw_file_name}</span></p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">{del.district}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{del.submission_date}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-md border text-[10px] font-bold ${getStatusBadge(del.status)}`}>
                        {del.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      ₹{(del.certified_value || del.estimated_value).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {del.invoice_id ? (
                        <span className="text-blue-400 font-semibold">{del.invoice_id}</span>
                      ) : (
                        <span className="text-slate-500 italic">Unmapped</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
