import React from 'react';
import { useHotel } from '../context/HotelContext';
import { UserRole } from '../types';
import { ROLE_CONFIGS } from '../utils/rbac';
import { ShieldAlert, ArrowLeft, UserCheck, Shield } from 'lucide-react';

interface AccessRestrictedViewProps {
  tabId: string;
  role: UserRole;
  onResetRole?: () => void;
}

export const AccessRestrictedView: React.FC<AccessRestrictedViewProps> = ({ tabId, role, onResetRole }) => {
  const { setActiveTab, switchRole } = useHotel();
  const config = ROLE_CONFIGS[role];

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 animate-in fade-in">
      <div className="max-w-md w-full bg-white border border-[#E7EBF0] rounded-2xl p-8 shadow-sm text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-[#FDF2F2] text-[#E85B63] mx-auto flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 stroke-[2.3]" />
        </div>

        <div>
          <span className="text-[11px] font-bold text-[#E85B63] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FDF2F2] inline-block mb-2">
            Access Restricted (RBAC)
          </span>
          <h2 className="text-xl font-black text-[#19202D]">
            Module Locked for {role}
          </h2>
          <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
            You are currently logged in as <strong className="text-[#19202D]">{config?.userName || role}</strong> ({role}). 
            The requested module (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-[#2583E9] font-mono">{tabId}</code>) is outside this role's operational scope.
          </p>
        </div>

        <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E7EBF0] text-left text-xs space-y-1.5">
          <p className="font-bold text-[#19202D] text-[11px]">Authorized Roles for this module:</p>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded bg-[#EAF3FF] text-[#2583E9] font-semibold text-[10px]">
              👑 Hotel Manager / Admin
            </span>
            <span className="px-2 py-0.5 rounded bg-[#FEF9E7] text-[#D9A300] font-semibold text-[10px]">
              💰 Financial Auditor
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex-1 py-2.5 px-4 rounded-xl border border-[#E7EBF0] hover:bg-[#F8FAFC] text-xs font-bold text-[#19202D] transition-all flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go to Dashboard</span>
          </button>

          <button
            onClick={() => {
              switchRole('Hotel Manager');
              if (onResetRole) onResetRole();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#2583E9] hover:bg-[#1768C4] text-xs font-bold text-white shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Switch to Manager</span>
          </button>
        </div>
      </div>
    </div>
  );
};
