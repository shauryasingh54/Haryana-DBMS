import React, { useState } from 'react';
import { BarChart3, Download, FileSpreadsheet, FileText, DollarSign, PieChart, Layers, ArrowUpRight, CheckCircle2, Clock, Sparkles, ChevronDown } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, AreaChart, Area } from 'recharts';
import { generateExecutivePDF, generateExecutiveExcel } from '../utils/exportUtils';

export default function ExecutiveDashboard({ analyticsData, deliverables, invoices }) {
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [exporting, setExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

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
    setShowExportMenu(false);
    try {
      generateExecutivePDF(analyticsData, deliverables, invoices);
    } catch (err) {
      console.error('PDF Export Error:', err);
    }
    setTimeout(() => setExporting(false), 800);
  };

  const handleExportExcel = () => {
    setExporting(true);
    setShowExportMenu(false);
    try {
      generateExecutiveExcel(analyticsData, deliverables, invoices);
    } catch (err) {
      console.error('Excel Export Error:', err);
    }
    setTimeout(() => setExporting(false), 800);
  };

  return (
    <div className="space-y-6">
      {/* Tier 2 Minimalist Header */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-zinc-400">
              <span className="font-mono text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 uppercase tracking-wider text-[10px]">
                Tier 2 • Executive Management
              </span>
              <span>• Real-Time Portfolio Analytics</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-2">Executive Financial Overview</h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Monitor multi-district financial portfolios, certified vs pending balances, and export state ledgers.
            </p>
          </div>

          {/* Action Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-semibold rounded-lg transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Ledger Reports</span>
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 py-1.5">
                <button
                  onClick={handleExportPDF}
                  disabled={exporting}
                  className="w-full text-left px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4 text-zinc-400" />
                  <span>Download Executive PDF</span>
                </button>
                <button
                  onClick={handleExportExcel}
                  disabled={exporting}
                  className="w-full text-left px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 flex items-center space-x-2 border-t border-zinc-800/60"
                >
                  <FileSpreadsheet className="w-4 h-4 text-zinc-400" />
                  <span>Download Excel Summary</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monochrome Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Invoiced */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider">Certified Invoiced</span>
            <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-300">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2 font-mono">
            ₹{(summary.total_invoiced_inr / 100000).toFixed(2)} Lakhs
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">Linked to issued invoices</p>
        </div>

        {/* Certified Unbilled Balance */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider">Certified Unbilled</span>
            <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-300">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2 font-mono">
            ₹{(summary.certified_balance_inr / 100000).toFixed(2)} Lakhs
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">Ready for invoice mapping</p>
        </div>

        {/* Pending / Zero-Value Balance */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider">Pending QA Valuation</span>
            <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-300">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-zinc-300 mt-2 font-mono">
            ₹{(summary.pending_zero_value_balance_inr / 100000).toFixed(2)} Lakhs
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">Pending QA resolution</p>
        </div>

        {/* Total Deliverables Volume */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider">Total Reports</span>
            <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-300">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2 font-mono">
            {summary.total_deliverables} Submissions
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">Across 6 districts</p>
        </div>

      </div>

      {/* Minimalist Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* District Financial Breakdown Bar Chart */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-white flex items-center mb-1">
            <PieChart className="w-4 h-4 text-zinc-400 mr-2" />
            District Financial Distribution (INR in Lakhs)
          </h3>
          <p className="text-xs text-zinc-400 mb-4">Invoiced vs Certified vs Pending balance comparison.</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="district" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Invoiced" fill="#ffffff" name="Invoiced (₹ Lakhs)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Certified" fill="#a1a1aa" name="Certified (₹ Lakhs)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="PendingZeroValue" fill="#3f3f46" name="Pending QA" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Cash Flow Trend Area Chart */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-white flex items-center mb-1">
            <ArrowUpRight className="w-4 h-4 text-zinc-400 mr-2" />
            Monthly Cash Flow & Growth Pipeline
          </h3>
          <p className="text-xs text-zinc-400 mb-4">Inspection revenue trends across months.</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMonoInvoiced" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="invoiced" stroke="#ffffff" fillOpacity={1} fill="url(#colorMonoInvoiced)" name="Invoiced Cash Flow (₹ Lakhs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Historical Ledger Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center">
              <Layers className="w-4 h-4 text-zinc-400 mr-2" />
              Inspection Deliverables Master Ledger
            </h3>
            <p className="text-xs text-zinc-400">Review status mappings, raw file uploads, and linked invoice IDs.</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-400">Filter District:</span>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-black border border-zinc-800 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-zinc-500 font-semibold"
            >
              <option value="ALL">All Districts (Global)</option>
              <option value="Gurugram">Gurugram</option>
              <option value="Faridabad">Faridabad</option>
              <option value="Ambala">Ambala</option>
              <option value="Hisar">Hisar</option>
              <option value="Karnal">Karnal</option>
              <option value="Rohtak">Rohtak</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-black uppercase text-zinc-500 border-b border-zinc-800 font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Valuation</th>
                <th className="py-3 px-4">Linked Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredDeliverables.map(del => (
                <tr key={del.id} className="hover:bg-zinc-900/60 transition">
                  <td className="py-3 px-4 font-mono font-bold text-white">{del.id}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-white">{del.title}</p>
                    <p className="text-[11px] text-zinc-500">Engineer: {del.engineer_name} • File: <span className="font-mono text-zinc-400">{del.raw_file_name}</span></p>
                  </td>
                  <td className="py-3 px-4 font-semibold text-zinc-300">{del.district}</td>
                  <td className="py-3 px-4 font-mono text-zinc-500">{del.submission_date}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 font-mono text-[10px]">
                      {del.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-white">
                    ₹{(del.certified_value || del.estimated_value).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-400">
                    {del.invoice_id ? del.invoice_id : <span className="text-zinc-600 italic">Unmapped</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

