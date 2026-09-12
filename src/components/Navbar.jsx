import React from 'react';
import { ShieldCheck, BarChart3, FileCheck, HardHat, Building2, Server, Database, ChevronDown } from 'lucide-react';

export default function Navbar({ currentRole, setCurrentRole, activeDistrict, setActiveDistrict, districts, dbHealth }) {
  const roles = [
    {
      id: 'SYSTEM_ADMIN',
      name: 'Tier 1: System Admin',
      icon: Server,
      badge: 'bg-purple-950 text-purple-300 border-purple-800',
      description: 'System Config, Access Permissions & DB Health'
    },
    {
      id: 'EXECUTIVE',
      name: 'Tier 2: Executive Management',
      icon: BarChart3,
      badge: 'bg-blue-950 text-blue-300 border-blue-800',
      description: 'Global District Metrics & One-Tap Summary Generator'
    },
    {
      id: 'BILLING_QA',
      name: 'Tier 3: Billing & QA Specialist',
      icon: FileCheck,
      badge: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      description: 'Multi-Report Invoice Mapping & Zero-Value Resolution'
    },
    {
      id: 'FIELD_ENGINEER',
      name: 'Tier 4: Field Engineer',
      icon: HardHat,
      badge: 'bg-amber-950 text-amber-300 border-amber-800',
      description: 'District-Isolated Portal & Raw Deliverable Submission'
    }
  ];

  const activeRoleObj = roles.find(r => r.id === currentRole) || roles[1];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl">
      {/* Top Banner: Enterprise Branding & Status */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-2 text-xs flex flex-wrap items-center justify-between text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="flex items-center text-blue-400 font-semibold tracking-wider uppercase">
            <Building2 className="w-3.5 h-3.5 mr-1.5" />
            Government of Haryana • Public Works DBMS Modernization
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>
            DB Health: {dbHealth?.status || '99.98% Healthy'} ({dbHealth?.active_connections || 42} active conns)
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-slate-400 hidden sm:inline">
            RBAC Enforcement Engine: <span className="text-blue-400 font-mono">Strict 4-Tier Isolation</span>
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-300 font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            v2.6.4 Modernized
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center">
                Haryana DBMS
                <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Modernized Portal
                </span>
              </h1>
              <p className="text-xs text-slate-400">Role-Based Access & Inspection-to-Billing Reconciliation System</p>
            </div>
          </div>

          {/* Role Switcher Toolbar (Crucial for RBAC Demonstration) */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shadow-inner">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-400" />
              Switch Role View:
            </span>

            {roles.map(role => {
              const Icon = role.icon;
              const isActive = currentRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setCurrentRole(role.id)}
                  title={role.description}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{role.name.split(':')[1]}</span>
                </button>
              );
            })}
          </div>

          {/* District Context Selector for Field Engineers */}
          {currentRole === 'FIELD_ENGINEER' && (
            <div className="flex items-center space-x-2 bg-amber-950/40 border border-amber-800/60 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-amber-400 font-semibold">Assigned District Scope:</span>
              <select
                value={activeDistrict}
                onChange={(e) => setActiveDistrict(e.target.value)}
                className="bg-slate-900 text-amber-200 border border-amber-700/60 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
              >
                {districts.map(d => (
                  <option key={d} value={d}>{d} District</option>
                ))}
              </select>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
