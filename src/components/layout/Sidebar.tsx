import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  Calendar,
  Megaphone,
  BookmarkCheck,
  BedDouble,
  Sparkles,
  Package,
  TrendingUp,
  FileText,
  Star,
  BarChart3,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Hotel,
  ArrowUpRight,
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { isTabAllowedForRole, ROLE_CONFIGS } from '../../utils/rbac';
import { AuraStayLogo } from '../common/AuraStayLogo';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeVariant?: 'info' | 'warning' | 'error' | 'default' | 'lime';
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    inboxMessages,
    mobileMenuOpen,
    setMobileMenuOpen,
    currentUser,
    switchRole,
  } = useHotel();

  const unreadMessagesCount = inboxMessages.filter(m => m.unread && m.folder === 'inbox').length;

  const allNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inbox', label: 'Inbox', icon: Inbox, badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined, badgeVariant: 'info' },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'reservations', label: 'Reservation', icon: BookmarkCheck },
    { id: 'rooms', label: 'Rooms', icon: BedDouble },
    { id: 'housekeeping', label: 'Housekeeping', icon: Sparkles },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'finance', label: 'Finance', icon: TrendingUp },
    { id: 'invoices', label: 'Invoice', icon: FileText },
    { id: 'reviews', label: 'Reviews', icon: Star, badge: 5, badgeVariant: 'info' },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'auth', label: 'Register & Login', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // RBAC Filtering: Show only allowed tabs for current role
  const navItems = allNavItems.filter(item => isTabAllowedForRole(currentUser.role, item.id));

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white select-none">
      {/* AuraStay Original Brand Header */}
      <div className={`flex items-center h-16 border-b border-[#E7EBF0] px-4 ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div
          className="cursor-pointer"
          onClick={() => handleNavClick('dashboard')}
        >
          <AuraStayLogo size="sm" showText={!sidebarCollapsed} />
        </div>
        {!sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="hidden lg:flex items-center justify-center w-6 h-6 text-[#6B7280] hover:text-[#19202D] hover:bg-[#F8FAFC] rounded-md transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {!sidebarCollapsed && currentUser.role !== 'Hotel Manager' && currentUser.role !== 'Owner' && (
          <div className="mb-2.5 p-2 bg-[#EAF3FF] rounded-lg border border-[#2583E9]/20 text-[10px] animate-in fade-in">
            <div className="flex items-center justify-between font-bold text-[#2583E9]">
              <span className="truncate">Role: {currentUser.role}</span>
              <button
                onClick={() => switchRole('Hotel Manager')}
                className="underline hover:text-[#1768C4] flex-shrink-0 ml-1 font-semibold"
                title="Switch back to General Manager"
              >
                All Tabs
              </button>
            </div>
            <p className="text-[#6B7280] text-[9px] mt-0.5">
              {navItems.length} of 14 modules accessible
            </p>
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-[#EAF3FF] text-[#2583E9]'
                  : 'text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#19202D]'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <Icon
                className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                  isActive ? 'text-[#2583E9] stroke-[2.4]' : 'text-[#8C95A6] group-hover:text-[#19202D] stroke-[1.8]'
                }`}
              />

              {!sidebarCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {!sidebarCollapsed && item.badge !== undefined && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#2583E9] text-white">
                  {item.badge}
                </span>
              )}

              {sidebarCollapsed && item.badge !== undefined && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2583E9]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Original Reference Promo Card: "Manage Smarter, Serve Better" */}
      {!sidebarCollapsed && (
        <div className="p-3 border-t border-[#E7EBF0]">
          <div className="bg-[#F8FAFC] border border-[#E7EBF0] rounded-xl p-3 relative overflow-hidden">
            <div className="h-20 w-full rounded-lg overflow-hidden mb-2.5 relative">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=80"
                alt="Modern Resort"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <h4 className="text-xs font-bold text-[#19202D] leading-tight">
              AuraStay Luxury Suite
            </h4>
            <p className="text-[10px] text-[#6B7280] mt-0.5 leading-snug">
              Intelligent guest analytics, automated room turnover, and cloud billing.
            </p>
            <button
              onClick={() => handleNavClick('campaigns')}
              className="mt-2.5 w-full py-1.5 px-3 rounded-lg bg-[#D2F829] hover:bg-[#C2E820] text-[#19202D] text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>AuraStay Enterprise</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* Collapsed expand button */}
      {sidebarCollapsed && (
        <div className="hidden lg:flex items-center justify-center p-3 border-t border-[#E7EBF0]">
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="flex items-center justify-center w-8 h-8 text-[#6B7280] hover:text-[#19202D] hover:bg-[#F8FAFC] rounded-lg transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:block fixed top-0 left-0 bottom-0 z-30 border-r border-[#E7EBF0] bg-white transition-all duration-200 ${
          sidebarCollapsed ? 'w-20' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed top-0 bottom-0 left-0 w-64 bg-white shadow-xl z-50 border-r border-[#E7EBF0]">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
