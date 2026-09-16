import React, { useState } from 'react';
import { Server, Users, ShieldAlert, Activity, RefreshCw, CheckCircle2, AlertTriangle, Lock, Plus, Database, Cpu, HardDrive, ChevronDown } from 'lucide-react';

export default function AdminPortal({ users, integrations, auditLogs, dbHealth, onSyncIntegration, onCreateUser, onUpdateUser }) {
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'FIELD_ENGINEER', district: 'Gurugram' });
  const [syncingId, setSyncingId] = useState(null);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

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
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-zinc-400">
              <span className="font-mono text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 uppercase tracking-wider text-[10px]">
                Tier 1 • System Admin
              </span>
              <span>• Full Governance</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-2">Governance & Database Telemetry</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Manage user permissions, monitor system metrics, and control portal integration resilience.
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowAdminMenu(!showAdminMenu)}
              className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-semibold rounded-lg transition"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Admin Actions</span>
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </button>

            {showAdminMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 py-1.5">
                <button
                  onClick={() => {
                    setShowUserModal(true);
                    setShowAdminMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4 text-zinc-400" />
                  <span>Provision New User</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Database Telemetry KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center space-x-4 shadow-sm">
          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Database Status</p>
            <p className="text-lg font-bold text-white mt-0.5">{dbHealth?.status || 'HEALTHY'}</p>
            <p className="text-[11px] text-zinc-500 font-mono">Latency: {dbHealth?.query_latency_ms || 3.8} ms</p>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center space-x-4 shadow-sm">
          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Active Connections</p>
            <p className="text-lg font-bold text-white mt-0.5">{dbHealth?.active_connections || 42} Sessions</p>
            <p className="text-[11px] text-zinc-500 font-mono">Pool: 100 max</p>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center space-x-4 shadow-sm">
          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Storage Allocated</p>
            <p className="text-lg font-bold text-white mt-0.5">{dbHealth?.allocated_storage_gb || 14.2} GB</p>
            <p className="text-[11px] text-zinc-500 font-mono">Limit: {dbHealth?.max_storage_gb || 100} GB</p>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center space-x-4 shadow-sm">
          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Automated Backup</p>
            <p className="text-sm font-semibold text-white mt-0.5">Active</p>
            <p className="text-[11px] text-zinc-500 font-mono">Daily Schedule</p>
          </div>
        </div>
      </div>

      {/* External Integration Resiliency */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-white flex items-center mb-1">
          <RefreshCw className="w-4 h-4 text-zinc-400 mr-2" />
          External Integration Resiliency
        </h3>
        <p className="text-xs text-zinc-400 mb-4">
          Monitor government & corporate portal integration uptime and retry queues.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {integrations.map(portal => (
            <div key={portal.id} className="p-4 rounded-xl border border-zinc-800 bg-black space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                    {portal.type}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1.5">{portal.name}</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                  {portal.status}
                </span>
              </div>

              <div className="pt-2 border-t border-zinc-900 text-[11px] space-y-1 text-zinc-400 font-mono">
                <div className="flex justify-between">
                  <span>Uptime SLA:</span>
                  <span className="text-white">{portal.uptime_percentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Retry Queue:</span>
                  <span className="text-white">{portal.retry_queue} pending</span>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  onClick={() => triggerSync(portal.id)}
                  disabled={syncingId === portal.id}
                  className="flex-1 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition"
                >
                  <RefreshCw className={`w-3 h-3 ${syncingId === portal.id ? 'animate-spin' : ''}`} />
                  <span>{syncingId === portal.id ? 'Syncing...' : 'Sync Portal'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User RBAC Directory */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-white flex items-center mb-4">
          <Users className="w-4 h-4 text-zinc-400 mr-2" />
          Role-Based Access Control (RBAC) User Directory
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-black uppercase text-zinc-500 border-b border-zinc-800 font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role Tier</th>
                <th className="py-3 px-4">District Scope</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-zinc-900/60 transition">
                  <td className="py-3 px-4 font-semibold text-white flex items-center space-x-2.5">
                    <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-300 text-[10px]">
                      {user.avatar}
                    </div>
                    <span>{user.name}</span>
                  </td>
                  <td className="py-3 px-4 text-zinc-400 font-mono text-[11px]">{user.email}</td>
                  <td className="py-3 px-4 font-mono text-[10px]">{user.role}</td>
                  <td className="py-3 px-4 text-zinc-300">{user.district}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 font-mono text-[10px]">
                      {user.active ? 'ACTIVE' : 'DEACTIVATED'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onUpdateUser(user.id, { active: !user.active })}
                      className="text-[11px] text-zinc-400 hover:text-white underline font-mono"
                    >
                      {user.active ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Audit Log Stream */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-white flex items-center mb-1">
          <ShieldAlert className="w-4 h-4 text-zinc-400 mr-2" />
          Live Security Audit Trail
        </h3>
        <p className="text-xs text-zinc-400 mb-4">Immutable security events and status resolution log.</p>

        <div className="bg-black border border-zinc-800 rounded-xl p-4 max-h-60 overflow-y-auto space-y-2 font-mono text-xs">
          {auditLogs.map(log => (
            <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 hover:bg-zinc-900/60 rounded border border-transparent hover:border-zinc-800 transition text-zinc-300 text-[11px]">
              <div className="flex items-center space-x-3">
                <span className="text-zinc-600">{log.timestamp}</span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 font-bold border border-zinc-800">
                  {log.action}
                </span>
                <span className="font-semibold text-white">{log.user}</span>
                <span className="text-zinc-400 hidden md:inline">— {log.details}</span>
              </div>
              <span className="text-zinc-600 text-[10px] mt-1 sm:mt-0">{log.ip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Provision User */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center">
              <Users className="w-4 h-4 text-zinc-400 mr-2" />
              Provision New User
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. Er. Rajesh Khanna"
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Government Email</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="e.g. rajesh@haryana.gov.in"
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Access Tier</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500 font-semibold"
                >
                  <option value="SYSTEM_ADMIN">Tier 1: System Admin</option>
                  <option value="EXECUTIVE">Tier 2: Executive Management</option>
                  <option value="BILLING_QA">Tier 3: Billing & QA Specialist</option>
                  <option value="FIELD_ENGINEER">Tier 4: Field Engineer</option>
                </select>
              </div>

              {newUser.role === 'FIELD_ENGINEER' && (
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Assigned District</label>
                  <select
                    value={newUser.district}
                    onChange={e => setNewUser({ ...newUser, district: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
                  >
                    {['Gurugram', 'Faridabad', 'Ambala', 'Hisar', 'Karnal', 'Rohtak'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-semibold rounded-lg"
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

