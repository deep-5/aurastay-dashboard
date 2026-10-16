import React from 'react';
import { useHotel } from '../../context/HotelContext';
import { UserRole } from '../../types';
import { ROLE_CONFIGS, isTabAllowedForRole } from '../../utils/rbac';
import { Modal } from '../ui';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, switchRole, activeTab, setActiveTab } = useHotel();

  const handleSelectRole = (role: UserRole) => {
    switchRole(role);
    // If current tab is not allowed for this role, auto-switch to their first allowed tab
    const config = ROLE_CONFIGS[role];
    if (config && !config.allowedTabs.includes(activeTab)) {
      setActiveTab(config.allowedTabs[0] || 'dashboard');
    }
    onClose();
  };

  const roleKeys: UserRole[] = [
    'Hotel Manager',
    'Receptionist',
    'Housekeeping Staff',
    'Accountant',
    'Maintenance Staff',
    'Guest',
    'Owner',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Role-Based Access Control (RBAC)"
      subtitle="Switch between hotel roles to test how navigation, dashboards, and operational permissions adapt."
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Active Role Notice */}
        <div className="p-3.5 bg-[#EAF3FF] border border-[#2583E9]/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2583E9] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#2583E9] uppercase tracking-wider block">
                Current Active Session
              </span>
              <p className="text-xs font-bold text-[#19202D]">
                {currentUser.name} — <span className="text-[#2583E9]">{currentUser.role}</span>
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-white text-[#2583E9] text-xs font-bold border border-[#2583E9]/20 shadow-2xs">
            {ROLE_CONFIGS[currentUser.role]?.allowedTabs.length || 14} Modules Accessible
          </span>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[60vh] overflow-y-auto pr-1">
          {roleKeys.map((r) => {
            const config = ROLE_CONFIGS[r];
            if (!config) return null;
            const isCurrent = currentUser.role === r;

            return (
              <div
                key={r}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'border-[#2583E9] bg-[#EAF3FF]/30 ring-2 ring-[#2583E9]/20 shadow-sm'
                    : 'border-[#E7EBF0] bg-white hover:border-[#2583E9]/50 hover:bg-[#F8FAFC]'
                }`}
              >
                <div>
                  {/* Header: Avatar, Name & Title */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={config.avatar}
                        alt={config.userName}
                        className="w-10 h-10 rounded-full object-cover border border-[#E7EBF0] flex-shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-[#19202D] leading-tight">
                          {config.userName}
                        </h4>
                        <p className="text-[11px] font-semibold text-[#2583E9] leading-tight mt-0.5">
                          {config.title}
                        </p>
                        <span className="text-[10px] text-[#6B7280]">
                          {config.department}
                        </span>
                      </div>
                    </div>

                    {isCurrent ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#20A66A] text-white text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[#475569] text-[10px] font-medium">
                        {config.allowedTabs.length} Tabs
                      </span>
                    )}
                  </div>

                  {/* Summary */}
                  <p className="text-[11px] text-[#475569] leading-snug mb-3">
                    {config.summary}
                  </p>

                  {/* Allowed / What they see */}
                  <div className="space-y-1.5 mb-3 bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E7EBF0]">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#20A66A] uppercase tracking-wider">
                      <Eye className="w-3 h-3" />
                      <span>What this role sees & can do:</span>
                    </div>
                    <ul className="space-y-0.5">
                      {config.visibleFeatures.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="text-[10px] text-[#19202D] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#20A66A] flex-shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {config.restrictedFeatures.length > 0 && (
                      <div className="pt-1.5 mt-1.5 border-t border-[#E7EBF0]">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#E85B63] uppercase tracking-wider mb-0.5">
                          <EyeOff className="w-3 h-3" />
                          <span>Restricted (Hidden / Locked):</span>
                        </div>
                        <p className="text-[10px] text-[#6B7280] truncate">
                          {config.restrictedFeatures.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Switch Button */}
                <button
                  onClick={() => handleSelectRole(r)}
                  disabled={isCurrent}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-[#EAF3FF] text-[#2583E9] cursor-default'
                      : 'bg-[#19202D] hover:bg-[#2583E9] text-white shadow-xs'
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Currently Logged In</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Switch to {config.userName.split(' ')[0]} ({r})</span>
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
