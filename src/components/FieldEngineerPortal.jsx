import React, { useState } from 'react';
import { HardHat, UploadCloud, FileText, CheckCircle2, Clock, AlertTriangle, ShieldCheck, MapPin, DollarSign } from 'lucide-react';

export default function FieldEngineerPortal({ activeDistrict, deliverables, onSubmitDeliverable }) {
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [estimatedVal, setEstimatedVal] = useState('');
  const [notes, setNotes] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // STRICT DISTRICT ISOLATION (Tier 4 Requirement)
  // Field engineers ONLY see deliverables belonging to their active assigned district!
  const districtIsolatedDeliverables = deliverables.filter(d => d.district === activeDistrict);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !estimatedVal) return;

    onSubmitDeliverable({
      title,
      district: activeDistrict,
      engineer_name: 'Amit Kumar (Field Officer)',
      raw_file_name: fileName || `${title.replace(/\s+/g, '_')}_FieldScan.pdf`,
      estimated_value: Number(estimatedVal),
      notes
    });

    setTitle('');
    setFileName('');
    setEstimatedVal('');
    setNotes('');
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 3000);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tier 4 Banner & District Isolation Notice */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  Tier 4 • Field Engineer Portal
                </span>
                <span className="text-xs text-amber-400 font-bold flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  District Scope: {activeDistrict} (Isolated View)
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">Raw Deliverable Submission & Status Tracker</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Streamlined field upload suite isolated to {activeDistrict} District. Unfiltered global enterprise data is hidden.
              </p>
            </div>
          </div>

          <div className="bg-amber-950/40 border border-amber-800/60 px-4 py-2.5 rounded-xl text-xs text-amber-200 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>RBAC Security: Strict District Data Scoping Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (1 col): Upload Raw Inspection Deliverable Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center">
            <UploadCloud className="w-5 h-5 text-amber-400 mr-2" />
            Upload Raw Field Deliverable
          </h3>
          <p className="text-xs text-slate-400">
            Submit raw site inspection reports, ultrasonic scans, or civil engineering quality audits for QA valuation.
          </p>

          {submittedSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Deliverable submitted successfully! Initial status set to Zero-Value / Pending QA.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Inspection Deliverable Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Sector 29 Overbridge Concrete Core Audit"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Assigned District</label>
              <input
                type="text"
                disabled
                value={`${activeDistrict} District (Auto-Scoped)`}
                className="w-full bg-slate-950/60 border border-slate-800/80 text-amber-300 rounded-lg px-3 py-2 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Initial Estimated Valuation (INR)</label>
              <input
                type="number"
                required
                value={estimatedVal}
                onChange={e => setEstimatedVal(e.target.value)}
                placeholder="e.g. 1250000"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Drag & Drop File Zone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Raw Report Document / Scan</label>
              <div
                onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
                  dragActive ? 'border-amber-500 bg-amber-950/20' : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <UploadCloud className="w-8 h-8 text-amber-400 mx-auto mb-1.5" />
                <p className="text-xs text-slate-300 font-semibold">
                  {fileName ? fileName : 'Drag & drop field report PDF / ZIP or click'}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Supports PDF, DWG, ZIP, XLSX up to 50MB</p>
                <input
                  type="file"
                  onChange={e => e.target.files?.[0] && setFileName(e.target.files[0].name)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="inline-block mt-2 px-3 py-1 bg-slate-800 text-slate-300 text-[11px] font-semibold rounded cursor-pointer hover:bg-slate-700">
                  Browse File
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Field Engineer Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Observations, site conditions, testing equipment calibration numbers..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-amber-600/20 flex items-center justify-center space-x-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Submit Deliverable for QA Valuation</span>
            </button>
          </form>
        </div>

        {/* Right Column (2 cols): District-Isolated Deliverables & Status Tracker */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center">
                <FileText className="w-5 h-5 text-amber-400 mr-2" />
                Submitted Inspection Reports Status ({activeDistrict} District)
              </h3>
              <p className="text-xs text-slate-400">
                Track financial and QA certification progress for deliverables submitted within {activeDistrict}.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-lg border border-amber-800">
              {districtIsolatedDeliverables.length} Submissions
            </span>
          </div>

          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {districtIsolatedDeliverables.length === 0 ? (
              <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-xl text-slate-500 text-xs">
                No inspection deliverables submitted for {activeDistrict} District yet. Use the form on the left to submit a report.
              </div>
            ) : (
              districtIsolatedDeliverables.map(del => {
                const getStatusBadge = (status) => {
                  switch (status) {
                    case 'INVOICED':
                      return { label: 'INVOICED (LINKED)', style: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: CheckCircle2 };
                    case 'CERTIFIED':
                      return { label: 'QA CERTIFIED (READY)', style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 };
                    case 'ZERO_VALUE':
                      return { label: 'ZERO-VALUE (ORPHANED)', style: 'bg-rose-500/10 text-rose-400 border-rose-500/30', icon: AlertTriangle };
                    default:
                      return { label: 'PENDING QA REVIEW', style: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: Clock };
                  }
                };

                const statusInfo = getStatusBadge(del.status);
                const Icon = statusInfo.icon;

                return (
                  <div key={del.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-slate-300">{del.id}</span>
                          <span className="text-xs text-slate-400 font-mono">• {del.submission_date}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center ${statusInfo.style}`}>
                            <Icon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{del.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          File: <span className="font-mono text-slate-300">{del.raw_file_name}</span>
                        </p>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <p className="text-xs text-slate-400 uppercase font-semibold">Valuation Status</p>
                        <p className="text-sm font-mono font-extrabold text-white mt-0.5">
                          ₹{(del.certified_value > 0 ? del.certified_value : del.estimated_value).toLocaleString('en-IN')}
                        </p>
                        {del.invoice_id && (
                          <p className="text-xs font-mono font-bold text-blue-400 mt-1">
                            Invoice: {del.invoice_id}
                          </p>
                        )}
                      </div>
                    </div>

                    {del.notes && (
                      <div className="mt-3 pt-2 border-t border-slate-800/60 text-xs text-slate-400 italic">
                        Notes: {del.notes}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
