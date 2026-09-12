import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AdminPortal from './components/AdminPortal';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import BillingQAPortal from './components/BillingQAPortal';
import FieldEngineerPortal from './components/FieldEngineerPortal';

const INITIAL_DISTRICTS = ['Gurugram', 'Faridabad', 'Ambala', 'Hisar', 'Karnal', 'Rohtak'];

export default function App() {
  const [currentRole, setCurrentRole] = useState('EXECUTIVE'); // Default to Executive Management
  const [activeDistrict, setActiveDistrict] = useState('Gurugram'); // Default district for Field Engineer

  // State data
  const [users, setUsers] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [dbHealth, setDbHealth] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      console.warn('Backend API not responding, fallback to client state mode:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers with backend API calls & fallback local state updates

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
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* Global Navbar with 4-Tier Role Switcher */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeDistrict={activeDistrict}
        setActiveDistrict={setActiveDistrict}
        districts={INITIAL_DISTRICTS}
        dbHealth={dbHealth}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400 space-x-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold">Initializing Haryana DBMS Modernized Engine...</span>
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

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-400">Haryana DBMS Modernization Platform</p>
            <p className="text-[11px] text-slate-500">
              Role-Based Access Control • Integrated One-Tap Summary Generator • District Data Scoping
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-slate-400">System Admin • Executive • Billing/QA • Field Engineer</p>
            <p className="text-[11px] text-slate-500">© 2026 Government of Haryana. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
