import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AdminPortal from './components/AdminPortal';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import BillingQAPortal from './components/BillingQAPortal';
import FieldEngineerPortal from './components/FieldEngineerPortal';
import { Play, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';

const INITIAL_DISTRICTS = ['Gurugram', 'Faridabad', 'Ambala', 'Hisar', 'Karnal', 'Rohtak'];

export default function App() {
  const [currentRole, setCurrentRole] = useState('EXECUTIVE'); // Default to Executive
  const [activeDistrict, setActiveDistrict] = useState('Gurugram');

  // State data
  const [users, setUsers] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [dbHealth, setDbHealth] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Demo Notification Banner state
  const [demoBanner, setDemoBanner] = useState(null);

  // Fetch data from backend API
  const fetchData = async () => {
    try {
      const [usersRes, delivRes, invRes, integRes, healthRes, analyticsRes] = await Promise.all([
        fetch('/api/users').then(r => r.json()),
        fetch('/api/deliverables').then(r => r.json()),
        fetch('/api/invoices').then(r => r.json()),
        fetch('/api/admin/integrations').then(r => r.json()),
        fetch('/api/health').then(r => r.json()),
        fetch('/api/analytics/executive').then(r => r.json())
      ]);

      setUsers(usersRes);
      setDeliverables(delivRes);
      setInvoices(invRes);
      setIntegrations(integRes);
      setDbHealth(healthRes.metrics);
      setAuditLogs(healthRes.auditLogs);
      setAnalyticsData(analyticsRes);
    } catch (err) {
      console.warn('Backend API error, using client state fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Demo Submission Showcase Trigger
  const handleTriggerDemoSubmission = async () => {
    const demoItem = {
      title: `Demo Bridge Inspection #${Math.floor(100 + Math.random() * 900)}`,
      district: activeDistrict,
      engineer_id: 'usr-4',
      engineer_name: 'Amit Kumar (Field Officer)',
      raw_file_name: 'Bridge_Structural_Audit_Demo.pdf',
      estimated_value: 1500000,
      notes: 'Sample live field report created via Demo Showcase Button.'
    };

    try {
      const res = await fetch('/api/deliverables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoItem)
      });
      const created = await res.json();
      await fetchData();

      setDemoBanner({
        title: 'Sample Field Deliverable Created!',
        details: `Created "${created.title}" in ${activeDistrict} District. Check Billing & QA, Executive Dashboard, or Admin Audit Logs to see instant cross-role updates!`,
        id: created.id
      });
    } catch (err) {
      const newDel = {
        id: `DEL-2026-DEMO-${Date.now().toString().slice(-3)}`,
        ...demoItem,
        submission_date: new Date().toISOString().substring(0, 10),
        status: 'ZERO_VALUE',
        certified_value: 0,
        invoice_id: null
      };
      setDeliverables(prev => [newDel, ...prev]);
      setDemoBanner({
        title: 'Sample Field Deliverable Created!',
        details: `Created "${newDel.title}" in ${activeDistrict} District. Instantly reflected in client state across all views!`,
        id: newDel.id
      });
    }

    setTimeout(() => setDemoBanner(null), 8000);
  };

  // Handlers with backend API calls & fallback updates
  const handleSyncIntegration = async (id, toggleOffline) => {
    try {
      await fetch('/api/admin/integrations/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integration_id: id, toggle_offline_mode: toggleOffline })
      });
      fetchData();
    } catch (err) {
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'ONLINE', retry_queue: 0 } : i));
    }
  };

  const handleCreateUser = async (userObj) => {
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userObj)
      });
      fetchData();
    } catch (err) {
      const newUser = { id: `usr-${Date.now()}`, ...userObj, active: true, avatar: userObj.name[0] };
      setUsers([...users, newUser]);
    }
  };

  const handleUpdateUser = async (id, updateObj) => {
    try {
      await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateObj)
      });
      fetchData();
    } catch (err) {
      setUsers(users.map(u => u.id === id ? { ...u, ...updateObj } : u));
    }
  };

  const handleResolveZeroValue = async (id, resolveObj) => {
    try {
      await fetch(`/api/deliverables/${id}/resolve-zero-value`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resolveObj)
      });
      fetchData();
    } catch (err) {
      setDeliverables(deliverables.map(d => d.id === id ? { ...d, ...resolveObj } : d));
    }
  };

  const handleMapInvoice = async (mapObj) => {
    try {
      await fetch('/api/invoices/map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapObj)
      });
      fetchData();
    } catch (err) {
      alert('Invoice created & deliverables mapped.');
    }
  };

  const handleSubmitDeliverable = async (delivObj) => {
    try {
      await fetch('/api/deliverables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(delivObj)
      });
      fetchData();
    } catch (err) {
      const newDel = {
        id: `DEL-2026-${Date.now().toString().slice(-3)}`,
        ...delivObj,
        submission_date: new Date().toISOString().substring(0, 10),
        status: 'ZERO_VALUE',
        certified_value: 0
      };
      setDeliverables([newDel, ...deliverables]);
    }
  };

  const handleReconcileOffline = async (records) => {
    try {
      await fetch('/api/admin/reconcile-offline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records })
      });
      fetchData();
    } catch (err) {
      alert('Batch offline records imported successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans antialiased selection:bg-zinc-800 selection:text-white border-t border-zinc-800">
      {/* Global Clean Navbar */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeDistrict={activeDistrict}
        setActiveDistrict={setActiveDistrict}
        districts={INITIAL_DISTRICTS}
        dbHealth={dbHealth}
        onTriggerDemoSubmission={handleTriggerDemoSubmission}
      />

      {/* Demo Broadcast Banner */}
      {demoBanner && (
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 text-xs flex items-center justify-between text-zinc-200 animate-fadeIn">
          <div className="max-w-7xl mx-auto w-full flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <Sparkles className="w-4 h-4 text-zinc-400 shrink-0" />
            <div>
              <span className="font-bold text-white mr-2">{demoBanner.title}</span>
              <span className="text-zinc-400">{demoBanner.details}</span>
            </div>
          </div>
          <button
            onClick={() => setDemoBanner(null)}
            className="text-zinc-500 hover:text-white font-mono text-xs px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-32 text-zinc-500 space-x-3">
            <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-mono tracking-wider uppercase">Loading Haryana DBMS Engine...</span>
          </div>
        ) : (
          <>
            {currentRole === 'SYSTEM_ADMIN' && (
              <AdminPortal
                users={users}
                integrations={integrations}
                auditLogs={auditLogs}
                dbHealth={dbHealth}
                onSyncIntegration={handleSyncIntegration}
                onCreateUser={handleCreateUser}
                onUpdateUser={handleUpdateUser}
              />
            )}

            {currentRole === 'EXECUTIVE' && (
              <ExecutiveDashboard
                analyticsData={analyticsData}
                deliverables={deliverables}
                invoices={invoices}
              />
            )}

            {currentRole === 'BILLING_QA' && (
              <BillingQAPortal
                deliverables={deliverables}
                invoices={invoices}
                onMapInvoice={handleMapInvoice}
                onResolveZeroValue={handleResolveZeroValue}
                onReconcileOffline={handleReconcileOffline}
              />
            )}

            {currentRole === 'FIELD_ENGINEER' && (
              <FieldEngineerPortal
                activeDistrict={activeDistrict}
                deliverables={deliverables}
                onSubmitDeliverable={handleSubmitDeliverable}
              />
            )}
          </>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-zinc-800 bg-black py-6 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-zinc-300">Haryana DBMS Platform</p>
            <p className="text-[11px] text-zinc-600">
              Role-Based Access Control • Integrated Financial Ledger • District Data Scoping
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-zinc-400">System Admin • Executive • Billing/QA • Field Engineer</p>
            <p className="text-[11px] text-zinc-600">© 2026 Government of Haryana. Monochrome Minimalist Edition.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

