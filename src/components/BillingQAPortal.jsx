import React, { useState } from 'react';
import { FileCheck, Link2, CheckSquare, Square, DollarSign, Upload, AlertCircle, FilePlus, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function BillingQAPortal({ deliverables, invoices, onMapInvoice, onResolveZeroValue, onReconcileOffline }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDistrict, setInvoiceDistrict] = useState('Gurugram');
  const [invoiceNotes, setInvoiceNotes] = useState('');
  
  // Zero-value resolution modal state
  const [resolvingItem, setResolvingItem] = useState(null);
  const [certifiedVal, setCertifiedVal] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Offline reconciliation state
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [offlineInput, setOfflineInput] = useState('');

  // Toggle deliverable selection for invoice mapping
  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAllUnmapped = () => {
    const unmapped = deliverables.filter(d => d.status !== 'INVOICED').map(d => d.id);
    setSelectedIds(unmapped);
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const handleMapSubmit = (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;
    onMapInvoice({
      deliverable_ids: selectedIds,
      invoice_number: invoiceNumber || undefined,
      district: invoiceDistrict,
      notes: invoiceNotes
    });
    setSelectedIds([]);
    setInvoiceNumber('');
    setInvoiceNotes('');
  };

  const handleResolveSubmit = (e) => {
    e.preventDefault();
    if (!resolvingItem) return;
    onResolveZeroValue(resolvingItem.id, {
      certified_value: Number(certifiedVal),
      notes: resolutionNotes,
      status: 'CERTIFIED'
    });
    setResolvingItem(null);
    setCertifiedVal('');
    setResolutionNotes('');
  };

  const handleOfflineReconcileSubmit = (e) => {
    e.preventDefault();
    try {
      // Simple CSV/Line parser for offline reconciliation demo
      const lines = offlineInput.split('\n').filter(l => l.trim().length > 0);
      const records = lines.map(line => {
        const parts = line.split(',');
        return {
          title: parts[0]?.trim() || 'Offline Reconciled Inspection',
          district: parts[1]?.trim() || 'Gurugram',
          value: Number(parts[2]?.trim()) || 500000,
          engineer: parts[3]?.trim() || 'Offline QA Reconciler'
        };
      });
      onReconcileOffline(records);
      setOfflineInput('');
      setShowOfflineModal(false);
    } catch (err) {
      alert('Error parsing CSV format. Please check formatting.');
    }
  };

  const unmappedDeliverables = deliverables.filter(d => d.status !== 'INVOICED');
  const zeroValueDeliverables = deliverables.filter(d => d.status === 'ZERO_VALUE' || d.status === 'PENDING_QA');

  const selectedTotal = deliverables
    .filter(d => selectedIds.includes(d.id))
    .reduce((acc, d) => acc + (d.certified_value > 0 ? d.certified_value : d.estimated_value), 0);

  return (
    <div className="space-y-6">
      {/* Tier 3 Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  Tier 3 • Billing & QA Specialist
                </span>
                <span className="text-xs text-slate-400">• Multi-Report Invoice Mapping Desk</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">Deliverable-to-Invoice Mapping & Zero-Value Resolution</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Batch orphan zero-value inspection deliverables into certified invoices and reconcile offline ledger records.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowOfflineModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-emerald-600/20"
          >
            <Upload className="w-4 h-4" />
            <span>Reconcile Offline Ledger (CSV/Excel)</span>
          </button>
        </div>
      </div>

      {/* Problem Diagnosis Counter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Zero-Value / Orphaned Reports</p>
            <p className="text-xl font-bold text-rose-400 mt-0.5">{zeroValueDeliverables.length} Deliverables</p>
            <p className="text-xs text-slate-400">Requires QA valuation certification</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Link2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Unbilled Deliverables Pool</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">{unmappedDeliverables.length} Ready for Mapping</p>
            <p className="text-xs text-slate-400">Can be batched to single certified invoice</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Certified Invoices</p>
            <p className="text-xl font-bold text-white mt-0.5">{invoices.length} Invoices Issued</p>
            <p className="text-xs text-slate-400">Multi-report to single invoice structure</p>
          </div>
        </div>
      </div>

      {/* Main Suite: Multi-Deliverable to Single Invoice Mapping Tool */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Unmapped Inspection Deliverables List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center">
                <CheckSquare className="w-5 h-5 text-emerald-400 mr-2" />
                Select Deliverables for Batch Invoice Mapping
              </h3>
              <p className="text-xs text-slate-400">Click deliverables to include in a multi-report single invoice.</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={selectAllUnmapped}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded font-medium transition"
              >
                Select All ({unmappedDeliverables.length})
              </button>
              <button
                onClick={clearSelection}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded font-medium transition"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {deliverables.map(del => {
              const isSelected = selectedIds.includes(del.id);
              const isZeroValue = del.status === 'ZERO_VALUE' || del.status === 'PENDING_QA';
              const isInvoiced = del.status === 'INVOICED';

              return (
                <div
                  key={del.id}
                  onClick={() => !isInvoiced && toggleSelect(del.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isInvoiced
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'bg-emerald-950/30 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-600" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-300">{del.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">{del.district}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          isInvoiced ? 'bg-blue-900/60 text-blue-300' :
                          isZeroValue ? 'bg-rose-900/60 text-rose-300' : 'bg-emerald-900/60 text-emerald-300'
                        }`}>
                          {del.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mt-1">{del.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Engineer: {del.engineer_name} • File: <span className="font-mono text-slate-300">{del.raw_file_name}</span>
                      </p>
                      {del.notes && <p className="text-[11px] text-slate-500 italic mt-1">{del.notes}</p>}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Valuation</p>
                    <p className="text-sm font-mono font-extrabold text-white mt-0.5">
                      ₹{(del.certified_value > 0 ? del.certified_value : del.estimated_value).toLocaleString('en-IN')}
                    </p>
                    {isZeroValue && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setResolvingItem(del);
                          setCertifiedVal(del.estimated_value);
                        }}
                        className="mt-2 px-2.5 py-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-[11px] font-semibold rounded transition"
                      >
                        Resolve Zero-Value
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (1 col): Invoice Batch Mapping Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center">
            <Link2 className="w-5 h-5 text-blue-400 mr-2" />
            Batch Invoice Generation
          </h3>
          <p className="text-xs text-slate-400">
            Map {selectedIds.length} selected report deliverables into 1 single certified government invoice.
          </p>

          <form onSubmit={handleMapSubmit} className="space-y-4 pt-2">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Selected Deliverables:</span>
                <span className="font-bold text-white">{selectedIds.length} reports</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Aggregated Total Value:</span>
                <span className="font-mono font-extrabold text-emerald-400 text-sm">
                  ₹{selectedTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Custom Invoice Number (Optional)</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={e => setInvoiceNumber(e.target.value)}
                placeholder="e.g. HR-PWD-2026-0805"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Billing District</label>
              <select
                value={invoiceDistrict}
                onChange={e => setInvoiceDistrict(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {['Gurugram', 'Faridabad', 'Ambala', 'Hisar', 'Karnal', 'Rohtak'].map(d => (
                  <option key={d} value={d}>{d} District</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Mapping Remarks & QA Certification</label>
              <textarea
                value={invoiceNotes}
                onChange={e => setInvoiceNotes(e.target.value)}
                placeholder="Notes on quality audit verification and batched deliverable mapping..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={selectedIds.length === 0}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition shadow-lg ${
                selectedIds.length > 0
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <FilePlus className="w-4 h-4" />
              <span>Map {selectedIds.length} Deliverables to Invoice</span>
            </button>
          </form>
        </div>

      </div>

      {/* Certified Issued Invoices Registry */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center mb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-400 mr-2" />
          Certified Multi-Report Invoices Registry
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 uppercase text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4">Invoice ID</th>
                <th className="py-3 px-4">Invoice Number</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Billing Date</th>
                <th className="py-3 px-4">Mapped Reports</th>
                <th className="py-3 px-4">Certified Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-blue-400">{inv.id}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-white">{inv.invoice_number}</td>
                  <td className="py-3 px-4 font-semibold text-slate-200">{inv.district}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{inv.billing_date}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-slate-200">
                      {inv.deliverable_ids ? inv.deliverable_ids.length : 0} Reports Batched
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-extrabold text-white">
                    ₹{inv.total_amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Zero-Value Resolution */}
      {resolvingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <DollarSign className="w-5 h-5 text-amber-400 mr-2" />
              Resolve Zero-Value Status & QA Valuation
            </h3>
            <p className="text-xs text-slate-400">
              Deliverable: <span className="font-bold text-white">{resolvingItem.title}</span> ({resolvingItem.id})
            </p>

            <form onSubmit={handleResolveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">QA Certified Value (INR)</label>
                <input
                  type="number"
                  required
                  value={certifiedVal}
                  onChange={e => setCertifiedVal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">QA Certification Remarks</label>
                <textarea
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  placeholder="Verification details, structural audit sign-off..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setResolvingItem(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-emerald-600/20"
                >
                  Approve & Certify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Offline Record Reconciliation */}
      {showOfflineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <Upload className="w-5 h-5 text-emerald-400 mr-2" />
              Batch Reconcile Offline Ledger Records
            </h3>
            <p className="text-xs text-slate-400">
              Import historical offline inspection data trapped in desktop folders/Excel ledgers during portal downtime.
            </p>

            <form onSubmit={handleOfflineReconcileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  CSV Line Format: Title, District, Value, Engineer
                </label>
                <textarea
                  value={offlineInput}
                  onChange={e => setOfflineInput(e.target.value)}
                  placeholder={`Gurugram Flyover Pillar Inspection, Gurugram, 1200000, Er. Nitin Gupta\nFaridabad Drainage Survey, Faridabad, 650000, Er. Ritu Saini`}
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowOfflineModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-emerald-600/20"
                >
                  Batch Import Records
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
