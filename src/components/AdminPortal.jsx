import React, { useState } from 'react';
import { Server, Users, ShieldAlert, Activity, RefreshCw, CheckCircle2, AlertTriangle, Lock, Plus, Database, Cpu, HardDrive } from 'lucide-react';

export default function AdminPortal({ users, integrations, auditLogs, dbHealth, onSyncIntegration, onCreateUser, onUpdateUser }) {
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'FIELD_ENGINEER', district: 'Gurugram' });
  const [syncingId, setSyncingId] = useState(null);

  const handleCreateUser = (e) => {
    e.preventDefault();
    onCreateUser(newUser);
    setNewUser({ name: '', email: '', role: 'FIELD_ENGINEER', district: 'Gurugram' });
    setShowUserModal(false);
  };

  const triggerSync = (id) => {
    setSyncingId(id);
    onSyncIntegration(id);
    setTimeout(() => setSyncingId(null), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Tier 1 Header */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border border-purple-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                  Tier 1 • System Admin
                </span>
                <span className="text-xs text-slate-400">• Full Governance Privilege</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">System Architecture, RBAC & Database Telemetry</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Manage access permissions, monitor database metrics, and control external government/corporate portal integration resilience.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowUserModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-purple-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create New User / Grant Role</span>
          </button>
        </div>
      </div>

      {/* Database Health & Telemetry KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Database Engine</p>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">{dbHealth?.status || 'HEALTHY'}</p>
            <p className="text-xs text-slate-400">Latency: {dbHealth?.query_latency_ms || 3.8} ms</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Active Connections</p>
            <p className="text-lg font-bold text-white mt-0.5">{dbHealth?.active_connections || 42} Sessions</p>
            <p className="text-xs text-slate-400">Pool Size: 100 max</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Storage Allocated</p>
            <p className="text-lg font-bold text-white mt-0.5">{dbHealth?.allocated_storage_gb || 14.2} GB</p>
            <p className="text-xs text-slate-400">Limit: {dbHealth?.max_storage_gb || 100} GB</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Automated Backup</p>
            <p className="text-sm font-semibold text-slate-200 mt-0.5">Daily Backup Active</p>
            <p className="text-xs text-slate-400">Last: {dbHealth?.last_backup || '2026-09-13 00:00'}</p>
          </div>
        </div>
      </div>

      {/* External Portal Integration Health (Addresses "External Vulnerabilities" Deficit) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center">
              <RefreshCw className="w-5 h-5 text-blue-400 mr-2" />
              External Portal Integration Manager & Offline Resilience
            </h3>
            <p className="text-xs text-slate-400">
              Mitigates external government & corporate portal downtime by enabling offline tracking workarounds and automatic retry queues.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {integrations.map(portal => {
            const isOnline = portal.status === 'ONLINE';
            return (
              <div
                key={portal.id}
                className={`p-4 rounded-xl border transition-all ${
                  isOnline
                    ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    : 'bg-amber-950/20 border-amber-800/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      portal.type === 'GOVERNMENT' ? 'bg-blue-900/60 text-blue-300' :
                      portal.type === 'CORPORATE' ? 'bg-purple-900/60 text-purple-300' : 'bg-emerald-900/60 text-emerald-300'
                    }`}>
                      {portal.type} PORTAL
                    </span>
                    <h4 className="text-sm font-semibold text-white mt-1.5">{portal.name}</h4>
                  </div>

                  <span className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    isOnline
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {isOnline ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                    {portal.status}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs space-y-1.5 text-slate-400">
                  <div className="flex justify-between">
                    <span>Uptime SLA:</span>
                    <span className="text-slate-200 font-mono">{portal.uptime_percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Synced:</span>
                    <span className="text-slate-200 font-mono">{portal.last_sync}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retry Queue Count:</span>
                    <span className={portal.retry_queue > 0 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                      {portal.retry_queue} items pending
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Offline Workaround:</span>
                    <span className={portal.offline_workaround_active ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                      {portal.offline_workaround_active ? 'ACTIVE' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center space-x-2">
                  <button
                    onClick={() => triggerSync(portal.id)}
                    disabled={syncingId === portal.id}
                    className="flex-1 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingId === portal.id ? 'animate-spin' : ''}`} />
                    <span>{syncingId === portal.id ? 'Syncing...' : 'Trigger Sync'}</span>
                  </button>
                  <button
                    onClick={() => onSyncIntegration(portal.id, !portal.offline_workaround_active)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                      portal.offline_workaround_active
                        ? 'bg-amber-600/20 text-amber-300 border-amber-500/40 hover:bg-amber-600/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {portal.offline_workaround_active ? 'Disable Workaround' : 'Enable Offline Mode'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User RBAC Permission Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center">
              <Users className="w-5 h-5 text-purple-400 mr-2" />
              Role-Based Access Control (RBAC) & User Directory
            </h3>
            <p className="text-xs text-slate-400">Configure tier permission levels and district scoping across officers.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 uppercase text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Access Tier / Role</th>
                <th className="py-3 px-4">District Scope</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map(user => {
                const getRoleBadge = (role) => {
                  switch (role) {
                    case 'SYSTEM_ADMIN': return 'bg-purple-950 text-purple-300 border-purple-800';
                    case 'EXECUTIVE': return 'bg-blue-950 text-blue-300 border-blue-800';
                    case 'BILLING_QA': return 'bg-emerald-950 text-emerald-300 border-emerald-800';
                    default: return 'bg-amber-950 text-amber-300 border-amber-800';
                  }
                };
                return (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-semibold text-white flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-xs">
                        {user.avatar}
                      </div>
                      <span>{user.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      {user.district === 'ALL' ? (
                        <span className="text-blue-400">Global (All Districts)</span>
                      ) : (
                        <span className="text-amber-400">{user.district} District</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {user.active ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onUpdateUser(user.id, { active: !user.active })}
                        className="text-xs text-slate-400 hover:text-white underline font-mono"
                      >
                        {user.active ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-Time System Audit Log Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center">
              <ShieldAlert className="w-5 h-5 text-amber-400 mr-2" />
              Live Security & Audit Trail Logs
            </h3>
            <p className="text-xs text-slate-400">Immutable ledger of all RBAC operations, zero-value resolutions, and portal sync events.</p>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-h-64 overflow-y-auto space-y-2 font-mono text-xs">
          {auditLogs.map(log => (
            <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 hover:bg-slate-900 rounded border border-transparent hover:border-slate-800 transition text-slate-300">
              <div className="flex items-center space-x-3">
                <span className="text-slate-500 text-[11px]">{log.timestamp}</span>
                <span className="px-2 py-0.5 text-[10px] rounded bg-purple-950 text-purple-300 font-bold border border-purple-800">
                  {log.action}
                </span>
                <span className="font-semibold text-white">{log.user}</span>
                <span className="text-slate-400 text-xs hidden md:inline">— {log.details}</span>
              </div>
              <span className="text-slate-500 text-[10px] mt-1 sm:mt-0">{log.ip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Create User */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <Users className="w-5 h-5 text-purple-400 mr-2" />
              Provision New User & RBAC Tier
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. Er. Rajesh Khanna"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Government Email</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="e.g. rajesh@haryana.gov.in"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Assign Access Tier</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-semibold"
                >
                  <option value="SYSTEM_ADMIN">Tier 1: System Admin</option>
                  <option value="EXECUTIVE">Tier 2: Executive Management</option>
                  <option value="BILLING_QA">Tier 3: Billing & QA Specialist</option>
                  <option value="FIELD_ENGINEER">Tier 4: Field Engineer</option>
                </select>
              </div>

              {newUser.role === 'FIELD_ENGINEER' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Assigned District Scope</label>
                  <select
                    value={newUser.district}
                    onChange={e => setNewUser({ ...newUser, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    {['Gurugram', 'Faridabad', 'Ambala', 'Hisar', 'Karnal', 'Rohtak'].map(d => (
                      <option key={d} value={d}>{d} District</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg transition shadow-lg shadow-purple-600/20"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
