import React, { useState } from 'react';
import { HardHat, UploadCloud, FileText, CheckCircle2, Clock, AlertTriangle, ShieldCheck, MapPin, DollarSign, ChevronDown } from 'lucide-react';

export default function FieldEngineerPortal({ activeDistrict, deliverables, onSubmitDeliverable }) {
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [estimatedVal, setEstimatedVal] = useState('');
  const [notes, setNotes] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Field engineers ONLY see deliverables belonging to their active assigned district
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
      {/* Tier 4 Header */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-zinc-400">
              <span className="font-mono text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 uppercase tracking-wider text-[10px]">
                Tier 4 • Field Engineer Portal
              </span>
              <span className="text-zinc-300 font-bold flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                District: {activeDistrict}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-2">Raw Field Submission Desk</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Submit site inspection reports, ultrasonic scans, or civil audits for QA valuation in {activeDistrict} District.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-xl text-xs text-zinc-300 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-zinc-400 shrink-0" />
            <span>District Scope Enforced</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (1 col): Upload Form */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center">
            <UploadCloud className="w-4 h-4 text-zinc-400 mr-2" />
            Upload Raw Field Deliverable
          </h3>

          {submittedSuccess && (
            <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-200 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
              <span>Deliverable submitted successfully! Initial status set to Zero-Value / Pending QA.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Deliverable Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Sector 29 Overbridge Concrete Core Audit"
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Assigned District</label>
              <input
                type="text"
                disabled
                value={`${activeDistrict} District (Auto-Scoped)`}
                className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-400 rounded-lg px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Initial Valuation (INR)</label>
              <input
                type="number"
                required
                value={estimatedVal}
                onChange={e => setEstimatedVal(e.target.value)}
                placeholder="e.g. 1250000"
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-zinc-500"
              />
            </div>

            {/* Drag & Drop File Zone */}
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Report Document / File</label>
              <div
                onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleFileDrop}
                className={`border border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
                  dragActive ? 'border-white bg-zinc-900' : 'border-zinc-800 bg-black hover:border-zinc-700'
                }`}
              >
                <UploadCloud className="w-6 h-6 text-zinc-400 mx-auto mb-1" />
                <p className="text-xs text-zinc-300 font-semibold">
                  {fileName ? fileName : 'Drag & drop field report PDF / ZIP or browse'}
                </p>
                <input
                  type="file"
                  onChange={e => e.target.files?.[0] && setFileName(e.target.files[0].name)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="inline-block mt-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-semibold rounded cursor-pointer hover:bg-zinc-800">
                  Browse File
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Field Observations</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Observations..."
                rows={3}
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center space-x-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Submit Deliverable for QA Valuation</span>
            </button>
          </form>
        </div>

        {/* Right Column (2 cols): District Deliverables Table */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center">
                <FileText className="w-4 h-4 text-zinc-400 mr-2" />
                Submitted Inspection Reports ({activeDistrict} Scope)
              </h3>
              <p className="text-xs text-zinc-400">
                Track financial and QA certification progress for deliverables in {activeDistrict}.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-white bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800">
              {districtIsolatedDeliverables.length} Submissions
            </span>
          </div>

          <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
            {districtIsolatedDeliverables.length === 0 ? (
              <div className="p-8 text-center bg-black border border-zinc-800 rounded-xl text-zinc-500 text-xs">
                No inspection deliverables submitted for {activeDistrict} District yet. Use the form on the left to submit a report.
              </div>
            ) : (
              districtIsolatedDeliverables.map(del => (
                <div key={del.id} className="p-4 bg-black border border-zinc-800 rounded-xl hover:border-zinc-700 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-white">{del.id}</span>
                        <span className="text-[11px] text-zinc-500 font-mono">• {del.submission_date}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-900 border border-zinc-800 text-zinc-300">
                          {del.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1">{del.title}</h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        File: <span className="font-mono text-zinc-400">{del.raw_file_name}</span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <p className="text-[10px] text-zinc-500 uppercase font-mono">Valuation</p>
                      <p className="text-sm font-mono font-bold text-white mt-0.5">
                        ₹{(del.certified_value > 0 ? del.certified_value : del.estimated_value).toLocaleString('en-IN')}
                      </p>
                      {del.invoice_id && (
                        <p className="text-xs font-mono font-bold text-zinc-400 mt-0.5">
                          Invoice: {del.invoice_id}
                        </p>
                      )}
                    </div>
                  </div>

                  {del.notes && (
                    <div className="mt-2 pt-2 border-t border-zinc-900 text-[11px] text-zinc-500 italic">
                      Notes: {del.notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

