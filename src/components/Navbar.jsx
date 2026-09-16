import React, { useState } from 'react';
import { ShieldCheck, BarChart3, FileCheck, HardHat, Server, Database, ChevronDown, Play, Sparkles, Building2 } from 'lucide-react';

export default function Navbar({ currentRole, setCurrentRole, activeDistrict, setActiveDistrict, districts, dbHealth, onTriggerDemoSubmission }) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roles = [
    {
      id: 'SYSTEM_ADMIN',
      name: 'Tier 1: System Admin',
      icon: Server,
      description: 'System Config, Access Permissions & DB Health'
    },
    {
      id: 'EXECUTIVE',
      name: 'Tier 2: Executive Management',
      icon: BarChart3,
      description: 'Global District Metrics & One-Tap Summary Generator'
    },
    {
      id: 'BILLING_QA',
      name: 'Tier 3: Billing & QA Specialist',
      icon: FileCheck,
      description: 'Multi-Report Invoice Mapping & Zero-Value Resolution'
    },
    {
      id: 'FIELD_ENGINEER',
      name: 'Tier 4: Field Engineer',
      icon: HardHat,
      description: 'District-Isolated Portal & Raw Deliverable Submission'
    }
  ];

  const activeRoleObj = roles.find(r => r.id === currentRole) || roles[1];
  const ActiveIcon = activeRoleObj.icon;

  return (
    <header className="bg-black border-b border-zinc-800 sticky top-0 z-40">
      {/* Top Minimal Utility Bar */}
      <div className="bg-zinc-950 border-b border-zinc-800/80 px-4 py-2 text-xs flex flex-wrap items-center justify-between text-zinc-400">
        <div className="flex items-center space-x-3">
          <span className="flex items-center text-zinc-200 font-semibold tracking-wide uppercase text-[11px]">
            <Building2 className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
            Government of Haryana • DBMS Modernization
          </span>
          <span className="text-zinc-700">•</span>
          <span className="flex items-center text-zinc-300 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
            DB Health: {dbHealth?.status || 'ONLINE'} ({dbHealth?.active_connections || 42} conns)
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-zinc-400 text-[11px]">
            Role Scope: <span className="text-white font-mono">{currentRole}</span>
          </span>
          <span className="text-zinc-700">•</span>
          <span className="text-zinc-300 font-mono text-[11px] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            Minimalist v2.7
          </span>
        </div>
      </div>

      {/* Main Navbar Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shadow-sm">
              <Database className="w-4 h-4 text-zinc-200" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight flex items-center">
                Haryana DBMS
                <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                  Antigravity Monochrome Edition
                </span>
              </h1>
              <p className="text-[11px] text-zinc-400">Public Works Modernization & Reconciliation Engine</p>
            </div>
          </div>

          {/* Action Toolbar: Demo Showcase Trigger & Decluttered Role Dropdown */}
          <div className="flex items-center space-x-3">
            
            {/* Quick Demo Showcase Trigger Button */}
            <button
              onClick={onTriggerDemoSubmission}
              className="flex items-center space-x-2 px-3.5 py-1.5 bg-white hover:bg-zinc-200 text-black text-xs font-semibold rounded-lg transition shadow-sm"
              title="Click to simulate an instant field engineer submission and test cross-role data sync!"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Simulate Field Submission</span>
            </button>

            {/* Decluttered Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-lg border border-zinc-700 transition"
              >
                <ActiveIcon className="w-3.5 h-3.5 text-zinc-300" />
                <span className="font-semibold">{activeRoleObj.name.split(':')[1]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-1" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 py-1.5">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
                    Switch User Role View
                  </div>
                  {roles.map(r => {
                    const Icon = r.icon;
                    const isSel = currentRole === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          setCurrentRole(r.id);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-start space-x-2.5 hover:bg-zinc-800 transition ${
                          isSel ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 mt-0.5 text-zinc-400 shrink-0" />
                        <div>
                          <div className="text-white text-xs font-medium">{r.name}</div>
                          <div className="text-[10px] text-zinc-500 leading-tight mt-0.5">{r.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Field Engineer District Scope Dropdown */}
            {currentRole === 'FIELD_ENGINEER' && (
              <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs">
                <span className="text-zinc-400 text-[11px]">District:</span>
                <select
                  value={activeDistrict}
                  onChange={(e) => setActiveDistrict(e.target.value)}
                  className="bg-black text-white border border-zinc-700 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-zinc-500 font-medium"
                >
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}

