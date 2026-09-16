import React, { useState } from 'react';
import { FileCheck, Link2, CheckSquare, Square, DollarSign, Upload, AlertCircle, FilePlus, Sparkles, CheckCircle2, ShieldCheck, ChevronDown } from 'lucide-react';

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

  const [showActionsDropdown, setShowActionsDropdown] = useState(false);

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
      {/* Tier 3 Header */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-zinc-400">
              <span className="font-mono text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 uppercase tracking-wider text-[10px]">
                Tier 3 • Billing & QA Specialist
              </span>
              <span>• Invoice Mapping & Audit Desk</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-2">Billing & QA Operations</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Certify zero-value report valuations, map unbilled deliverables into government invoices, and reconcile offline ledgers.
            </p>
          </div>

          {/* Action Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowActionsDropdown(!showActionsDropdown)}
              className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-semibold rounded-lg transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>QA & Import Actions</span>
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </button>

            {showActionsDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 py-1.5">
                <button
                  onClick={() => {
                    setShowOfflineModal(true);
                    setShowActionsDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4 text-zinc-400" />
                  <span>Reconcile Offline Ledger (CSV)</span>
                </button>
                <button
                  onClick={() => {
                    selectAllUnmapped();
                    setShowActionsDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 flex items-center space-x-2 border-t border-zinc-800/60"
                >
                  <CheckSquare className="w-4 h-4 text-zinc-400" />
                  <span>Select All Unbilled Reports</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center space-x-4 shadow-sm">
          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Zero-Value Reports</p>
            <p className="text-xl font-bold text-white mt-0.5">{zeroValueDeliverables.length} Submissions</p>
            <p className="text-[11px] text-zinc-500">Requires QA valuation sign-off</p>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center space-x-4 shadow-sm">
          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Unbilled Pool</p>
            <p className="text-xl font-bold text-white mt-0.5">{unmappedDeliverables.length} Ready</p>
            <p className="text-[11px] text-zinc-500">Available for batch invoicing</p>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center space-x-4 shadow-sm">
          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Total Invoices</p>
            <p className="text-xl font-bold text-white mt-0.5">{invoices.length} Issued</p>
            <p className="text-[11px] text-zinc-500">Multi-report batch registry</p>
          </div>
        </div>
      </div>

      {/* Main Mapping Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Unmapped Deliverables */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center">
                <CheckSquare className="w-4 h-4 text-zinc-400 mr-2" />
                Select Deliverables for Batch Invoicing
              </h3>
              <p className="text-xs text-zinc-400">Click deliverables to batch into 1 consolidated invoice.</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={selectAllUnmapped}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs rounded border border-zinc-800 transition"
              >
                Select All
              </button>
              <button
                onClick={clearSelection}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs rounded border border-zinc-800 transition"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
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
                      ? 'bg-zinc-950/40 border-zinc-800/40 opacity-40 cursor-not-allowed'
                      : isSelected
                      ? 'bg-zinc-900 border-white text-white'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-white" />
                      ) : (
                        <Square className="w-4 h-4 text-zinc-600" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-zinc-300">{del.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-black text-zinc-300 font-semibold border border-zinc-800">{del.district}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono uppercase bg-zinc-800 text-zinc-300">
                          {del.status}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white mt-1">{del.title}</h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Engineer: {del.engineer_name} • File: <span className="font-mono text-zinc-400">{del.raw_file_name}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-zinc-500 uppercase font-mono">Valuation</p>
                    <p className="text-sm font-mono font-bold text-white mt-0.5">
                      ₹{(del.certified_value > 0 ? del.certified_value : del.estimated_value).toLocaleString('en-IN')}
                    </p>
                    {isZeroValue && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setResolvingItem(del);
                          setCertifiedVal(del.estimated_value);
                        }}
                        className="mt-2 px-2.5 py-1 bg-white hover:bg-zinc-200 text-black text-[11px] font-semibold rounded transition"
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
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center">
            <Link2 className="w-4 h-4 text-zinc-400 mr-2" />
            Batch Invoice Generation
          </h3>
          <p className="text-xs text-zinc-400">
            Map {selectedIds.length} selected report deliverables into 1 single certified government invoice.
          </p>

          <form onSubmit={handleMapSubmit} className="space-y-4 pt-2">
            <div className="bg-black p-4 rounded-xl border border-zinc-800 space-y-2">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Selected Deliverables:</span>
                <span className="font-bold text-white">{selectedIds.length} reports</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Aggregated Total Value:</span>
                <span className="font-mono font-bold text-white text-sm">
                  ₹{selectedTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Custom Invoice Number (Optional)</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={e => setInvoiceNumber(e.target.value)}
                placeholder="e.g. HR-PWD-2026-0805"
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Billing District</label>
              <select
                value={invoiceDistrict}
                onChange={e => setInvoiceDistrict(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500 font-semibold"
              >
                {['Gurugram', 'Faridabad', 'Ambala', 'Hisar', 'Karnal', 'Rohtak'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">QA Certification Notes</label>
              <textarea
                value={invoiceNotes}
                onChange={e => setInvoiceNotes(e.target.value)}
                placeholder="QA audit notes..."
                rows={3}
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            <button
              type="submit"
              disabled={selectedIds.length === 0}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition ${
                selectedIds.length > 0
                  ? 'bg-white hover:bg-zinc-200 text-black shadow-sm'
                  : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
              }`}
            >
              <FilePlus className="w-4 h-4" />
              <span>Map {selectedIds.length} Reports to Invoice</span>
            </button>
          </form>
        </div>

      </div>

      {/* Certified Issued Invoices Registry */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-white flex items-center mb-4">
          <ShieldCheck className="w-4 h-4 text-zinc-400 mr-2" />
          Certified Multi-Report Invoices Registry
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-black uppercase text-zinc-500 border-b border-zinc-800 font-mono text-[10px]">
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
            <tbody className="divide-y divide-zinc-800/60">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-zinc-900/60 transition">
                  <td className="py-3 px-4 font-mono font-bold text-white">{inv.id}</td>
                  <td className="py-3 px-4 font-mono text-zinc-300">{inv.invoice_number}</td>
                  <td className="py-3 px-4 font-semibold text-zinc-300">{inv.district}</td>
                  <td className="py-3 px-4 font-mono text-zinc-500">{inv.billing_date}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-mono text-zinc-300 text-[10px]">
                      {inv.deliverable_ids ? inv.deliverable_ids.length : 0} Reports Mapped
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-white">
                    ₹{inv.total_amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px]">
                    {inv.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Zero-Value Resolution */}
      {resolvingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center">
              <DollarSign className="w-4 h-4 text-zinc-400 mr-2" />
              Resolve Zero-Value & QA Valuation
            </h3>
            <p className="text-xs text-zinc-400">
              Deliverable: <span className="font-bold text-white">{resolvingItem.title}</span> ({resolvingItem.id})
            </p>

            <form onSubmit={handleResolveSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">QA Certified Value (INR)</label>
                <input
                  type="number"
                  required
                  value={certifiedVal}
                  onChange={e => setCertifiedVal(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">QA Certification Remarks</label>
                <textarea
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  placeholder="Verification details..."
                  rows={3}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setResolvingItem(null)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-semibold rounded-lg"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center">
              <Upload className="w-4 h-4 text-zinc-400 mr-2" />
              Batch Reconcile Offline Ledger Records
            </h3>
            <p className="text-xs text-zinc-400">
              Import historical offline inspection data logged during portal downtime.
            </p>

            <form onSubmit={handleOfflineReconcileSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                  CSV Line Format: Title, District, Value, Engineer
                </label>
                <textarea
                  value={offlineInput}
                  onChange={e => setOfflineInput(e.target.value)}
                  placeholder={`Gurugram Flyover Pillar Inspection, Gurugram, 1200000, Er. Nitin Gupta\nFaridabad Drainage Survey, Faridabad, 650000, Er. Ritu Saini`}
                  rows={5}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowOfflineModal(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-semibold rounded-lg"
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

