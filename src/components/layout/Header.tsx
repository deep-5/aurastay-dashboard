import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Building2,
  Bell,
  MessageSquare,
  ChevronDown,
  User,
  Shield,
  RotateCcw,
  LogOut,
  Menu,
  CheckCircle2,
  BookmarkCheck,
  BedDouble
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { UserRole } from '../../types';
import { RoleSwitcherModal } from '../modals/RoleSwitcherModal';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    switchRole,
    searchQuery,
    setSearchQuery,
    setMobileMenuOpen,
    inboxMessages,
    reservations,
    guests,
    rooms,
    auditLogs,
    resetDemoData,
  } = useHotel();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadMessagesCount = inboxMessages.filter(m => m.unread && m.folder === 'inbox').length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    inbox: 'Inbox',
    calendar: 'Calendar',
    campaigns: 'Campaigns',
    reservations: 'Reservation',
    rooms: 'Rooms',
    housekeeping: 'Housekeeping',
    inventory: 'Inventory',
    finance: 'Finance',
    invoices: 'Invoice',
    reviews: 'Reviews',
    reports: 'Reports',
    auth: 'Register & Login',
    settings: 'Settings',
  };

  const currentTitle = pageTitles[activeTab] || 'AuraStay OS';

  // Filtered search results
  const matchingReservations = searchQuery.trim()
    ? reservations.filter(r => r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.roomNumber.includes(searchQuery)).slice(0, 3)
    : [];

  const matchingGuests = searchQuery.trim()
    ? guests.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.email.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];

  const rolesList: UserRole[] = [
    'Owner',
    'Hotel Manager',
    'Receptionist',
    'Housekeeping Staff',
    'Accountant',
    'Maintenance Staff',
  ];

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-[#E7EBF0] h-16 px-4 lg:px-8 flex items-center justify-between transition-all">
      {/* Left: Hamburger & Current Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 text-[#6B7280] hover:text-[#19202D] hover:bg-[#F8FAFC] rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-lg lg:text-xl font-extrabold text-[#19202D] tracking-tight">
          {currentTitle}
        </h1>
      </div>

      {/* Right Controls: Search, Messages, Notifications, Polina Steward Profile */}
      <div className="flex items-center gap-3">
        {/* Search Placeholder Input matching reference */}
        <div className="relative hidden md:block w-64 lg:w-72" ref={searchRef}>
          <Search className="w-3.5 h-3.5 text-[#8C95A6] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder="Search placeholder"
            className="w-full bg-[#F8FAFC] text-xs text-[#19202D] placeholder-[#8C95A6] pl-9 pr-4 py-2 rounded-full border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9] focus:bg-white transition-all"
          />

          {searchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E7EBF0] rounded-xl shadow-lg p-2 z-50 animate-in fade-in text-xs">
              {matchingReservations.length === 0 && matchingGuests.length === 0 ? (
                <p className="text-xs text-[#6B7280] p-2 text-center">No matching records found.</p>
              ) : (
                <div className="space-y-1">
                  {matchingReservations.map(res => (
                    <div
                      key={res.id}
                      onClick={() => {
                        setActiveTab('reservations');
                        setSearchFocused(false);
                      }}
                      className="p-2 hover:bg-[#F8FAFC] rounded-lg cursor-pointer flex justify-between"
                    >
                      <span className="font-semibold text-[#19202D]">{res.guestName}</span>
                      <span className="text-[#2583E9]">Room {res.roomNumber}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Switch Role (RBAC) Pill Button */}
        <button
          onClick={() => setRoleModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAF3FF] hover:bg-[#2583E9] text-[#2583E9] hover:text-white border border-[#2583E9]/30 text-xs font-bold transition-all shadow-2xs group cursor-pointer"
          title="Switch Role (Role-Based Access Control)"
        >
          <Shield className="w-3.5 h-3.5 text-[#2583E9] group-hover:text-white transition-colors" />
          <span className="hidden sm:inline text-[11px] text-[#6B7280] group-hover:text-white/80">Role:</span>
          <span className="font-bold">{currentUser.role}</span>
        </button>

        {/* Message Bubble Icon */}
        <button
          onClick={() => setActiveTab('inbox')}
          title="Inbox"
          className="relative w-9 h-9 rounded-full bg-[#F8FAFC] hover:bg-[#EAF3FF] border border-[#E7EBF0] flex items-center justify-center text-[#6B7280] hover:text-[#2583E9] transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#2583E9] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadMessagesCount}
            </span>
          )}
        </button>

        {/* Notification Bell Icon */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            title="Notifications"
            className="relative w-9 h-9 rounded-full bg-[#F8FAFC] hover:bg-[#EAF3FF] border border-[#E7EBF0] flex items-center justify-center text-[#6B7280] hover:text-[#2583E9] transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#D2F829] rounded-full ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E7EBF0] rounded-2xl shadow-lg p-2 z-50 animate-in fade-in">
              <div className="px-3 py-2 border-b border-[#E7EBF0] flex justify-between items-center">
                <span className="text-xs font-bold text-[#19202D]">Recent Activity</span>
                <span className="text-[10px] text-[#2583E9] font-bold cursor-pointer" onClick={() => setActiveTab('settings')}>View All</span>
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-[#E7EBF0]">
                {auditLogs.slice(0, 4).map(log => (
                  <div key={log.id} className="p-2.5 text-xs hover:bg-[#F8FAFC]">
                    <p className="font-semibold text-[#19202D]">{log.action}</p>
                    <p className="text-[11px] text-[#6B7280] truncate">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile matching reference */}
        <div className="relative ml-1 pl-2 border-l border-[#E7EBF0]" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#F8FAFC] transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-[#E7EBF0]"
            />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-[#19202D] leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-[#6B7280] font-medium leading-tight">{currentUser.role}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E7EBF0] rounded-2xl shadow-lg p-2 z-50 animate-in fade-in text-xs">
              <div className="px-3 py-2 border-b border-[#E7EBF0] mb-1">
                <p className="font-bold text-[#19202D]">{currentUser.name}</p>
                <p className="text-[11px] text-[#6B7280]">{currentUser.email}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#EAF3FF] text-[#2583E9] text-[10px] font-bold">
                    {currentUser.role}
                  </span>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setRoleModalOpen(true);
                    }}
                    className="text-[10px] font-bold text-[#2583E9] hover:underline"
                  >
                    Switch Role (RBAC) &rarr;
                  </button>
                </div>
              </div>

              <div className="px-3 py-1.5">
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Quick Role Switch</span>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setRoleModalOpen(true);
                    }}
                    className="text-[9px] text-[#2583E9] underline"
                  >
                    View Permissions
                  </button>
                </p>
                {rolesList.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1 text-xs rounded-md flex justify-between items-center transition-colors ${
                      currentUser.role === r ? 'bg-[#EAF3FF] text-[#2583E9] font-bold' : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <span>{r}</span>
                    {currentUser.role === r && <span className="w-1.5 h-1.5 rounded-full bg-[#2583E9]" />}
                  </button>
                ))}
              </div>

              <div className="border-t border-[#E7EBF0] pt-1 mt-1 space-y-0.5">
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-[#19202D] hover:bg-[#F8FAFC] rounded-lg"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    resetDemoData();
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-[#D9A300] hover:bg-[#FEF9E7] rounded-lg"
                >
                  Reset Demo Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RBAC Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
      />
    </header>
  );
};
