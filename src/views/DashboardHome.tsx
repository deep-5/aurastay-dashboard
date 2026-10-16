import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Card, Badge, Button, Modal } from '../components/ui';
import {
  DollarSign,
  CalendarCheck,
  Users,
  LogOut,
  BedDouble,
  TrendingUp,
  Plus,
  Calendar as CalendarIcon,
  UserPlus,
  FilePlus,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  Check,
  Shield,
  Eye,
  ShieldCheck,
  Hotel
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { NewReservationModal } from '../components/modals/NewReservationModal';
import { AddGuestModal } from '../components/modals/AddGuestModal';
import { AddRoomModal } from '../components/modals/AddRoomModal';
import { CreateInvoiceModal } from '../components/modals/CreateInvoiceModal';
import { RoleSwitcherModal } from '../components/modals/RoleSwitcherModal';
import { ROLE_CONFIGS } from '../utils/rbac';

export const DashboardHome: React.FC = () => {
  const {
    currentUser,
    selectedProperty,
    dateRange,
    setDateRange,
    reservations,
    rooms,
    invoices,
    checkInReservation,
    checkOutReservation,
    setActiveTab,
    switchRole,
  } = useHotel();

  // Modals state
  const [newResOpen, setNewResOpen] = useState(false);
  const [addGuestOpen, setAddGuestOpen] = useState(false);
  const [addRoomOpen, setAddRoomOpen] = useState(false);
  const [createInvOpen, setCreateInvOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Table filters
  const [bookingSearch, setBookingSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Selected Booking Details Modal
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  // Interactive Tasks state
  const [taskList, setTaskList] = useState([
    { id: 'T-1', title: 'Confirm Group Booking for Corporate Summit', date: 'March 15, 2035', priority: 'High', done: false, room: 'Room 302', staff: 'Sarah Jenkins' },
    { id: 'T-2', title: 'Update Room Maintenance Schedule (Floor 3)', date: 'March 14, 2035', priority: 'High', done: false, room: 'Floor 3 HVAC', staff: 'David Chen' },
    { id: 'T-3', title: 'Review Monthly Linen & Toiletries Supply', date: 'March 14, 2035', priority: 'Medium', done: true, room: 'Central Pantry', staff: 'Carlos Mendez' },
    { id: 'T-4', title: 'Coordinate Staff Shift for Weekend Gala', date: 'March 13, 2035', priority: 'Medium', done: false, room: 'Grand Ballroom', staff: 'Polina Steward' },
    { id: 'T-5', title: 'Approve Special Dietary Menu for VIP Suite', date: 'March 12, 2035', priority: 'Normal', done: true, room: 'Suite 501', staff: 'Elena Rostova' },
  ]);

  const toggleTask = (id: string) => {
    setTaskList(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    showToast('Task updated successfully');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Revenue Chart Data matching reference curve (Smooth Spline with $255,060 Peak)
  const revenueChartData = [
    { month: 'Apr', revenue: 140000 },
    { month: 'May', revenue: 190000 },
    { month: 'Jun', revenue: 165000 },
    { month: 'Jul', revenue: 255060 }, // Peak point
    { month: 'Aug', revenue: 180000 },
    { month: 'Sep', revenue: 220000 },
    { month: 'Oct', revenue: 215000 },
  ];

  // 2. Occupancy 7-Day Dual Bar Data matching reference
  const occupancy7Days = [
    { day: '12 Jun', occupied: 65, available: 35 },
    { day: '13 Jun', occupied: 78, available: 22 },
    { day: '14 Jun', occupied: 70, available: 30 },
    { day: '15 Jun', occupied: 72, available: 28 }, // Tooltip highlighted
    { day: '16 Jun', occupied: 85, available: 15 },
    { day: '17 Jun', occupied: 90, available: 10 },
    { day: '18 Jun', occupied: 68, available: 32 },
  ];

  // 3. Booking Source Data matching reference
  const bookingSources = [
    { name: 'Direct Website', percentage: 42, color: '#2583E9', bg: 'bg-[#2583E9]' },
    { name: 'Online Travel Agencies (OTA)', percentage: 33, color: '#3298E8', bg: 'bg-[#3298E8]' },
    { name: 'Walk-in Guests', percentage: 15, color: '#D2F829', bg: 'bg-[#D2F829]' },
    { name: 'Corporate Partnerships', percentage: 10, color: '#60A5FA', bg: 'bg-[#60A5FA]' },
  ];

  // 4. Overall Rating Breakdown matching reference
  const ratingCategories = [
    { name: 'Cleanliness', score: 4.8, percent: 96 },
    { name: 'Comfort', score: 4.6, percent: 92 },
    { name: 'Service / Staff', score: 4.9, percent: 98 },
    { name: 'Facilities / Amenities', score: 4.5, percent: 90 },
    { name: 'Value for Money', score: 4.6, percent: 92 },
    { name: 'Location', score: 4.7, percent: 94 },
  ];

  // 5. Recent Activities matching reference
  const recentActivities = [
    {
      id: 'ACT-1',
      iconBg: 'bg-[#FEF9E7] text-[#D9A300]',
      icon: BedDouble,
      title: 'Front Desk Admin assigned Room 210 to Emily Carter',
      time: '09:30 AM',
      tag: 'Check-in'
    },
    {
      id: 'ACT-2',
      iconBg: 'bg-[#EAF3FF] text-[#2583E9]',
      icon: Sparkles,
      title: 'Housekeeping Team completed cleaning Suite 302',
      time: '09:00 AM',
      tag: 'Turnover'
    },
    {
      id: 'ACT-3',
      iconBg: 'bg-[#EBF7F0] text-[#20A66A]',
      icon: CheckCircle2,
      title: 'Manager approved complimentary champagne & breakfast',
      time: '08:45 AM',
      tag: 'Approved'
    },
    {
      id: 'ACT-4',
      iconBg: 'bg-[#EAF3FF] text-[#2583E9]',
      icon: Users,
      title: 'Reservation Staff processed VIP airport pickup',
      time: '08:30 AM',
      tag: 'Concierge'
    },
    {
      id: 'ACT-5',
      iconBg: 'bg-[#FEF9E7] text-[#D9A300]',
      icon: TrendingUp,
      title: 'System Update: Night audit completed successfully',
      time: '07:00 AM',
      tag: 'Audit'
    },
  ];

  // 6. Booking List records matching reference
  const bookingListRecords = [
    {
      id: '#BKG-0024',
      guestName: 'Emily Carter',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      roomType: 'Deluxe Suite',
      roomNo: '210',
      duration: '3 Nights',
      dates: 'Mar 10 - Mar 13, 2035',
      status: 'Checked In',
      statusColor: 'bg-[#D2F829] text-[#19202D] font-black',
      rate: '$320 / night',
    },
    {
      id: '#BKG-0025',
      guestName: 'Daniel Wong',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      roomType: 'Superior Room',
      roomNo: '315',
      duration: '2 Nights',
      dates: 'Mar 11 - Mar 13, 2035',
      status: 'Pending',
      statusColor: 'bg-[#FA6B6B] text-white font-bold',
      rate: '$240 / night',
    },
    {
      id: '#BKG-0026',
      guestName: 'Sophia Montgomery',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      roomType: 'Executive Suite',
      roomNo: '108',
      duration: '4 Nights',
      dates: 'Mar 09 - Mar 13, 2035',
      status: 'Checked In',
      statusColor: 'bg-[#D2F829] text-[#19202D] font-black',
      rate: '$450 / night',
    },
    {
      id: '#BKG-0027',
      guestName: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      roomType: 'Penthouse Ocean',
      roomNo: '501',
      duration: '5 Nights',
      dates: 'Mar 12 - Mar 17, 2035',
      status: 'Confirmed',
      statusColor: 'bg-[#2583E9] text-white font-bold',
      rate: '$850 / night',
    },
    {
      id: '#BKG-0028',
      guestName: 'Liam Hemsworth',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      roomType: 'Standard Double Queen',
      roomNo: '104',
      duration: '1 Night',
      dates: 'Mar 13 - Mar 14, 2035',
      status: 'Confirmed',
      statusColor: 'bg-[#2583E9] text-white font-bold',
      rate: '$190 / night',
    },
    {
      id: '#BKG-0029',
      guestName: 'Charlotte Sterling',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      roomType: 'Deluxe Suite',
      roomNo: '202',
      duration: '3 Nights',
      dates: 'Mar 08 - Mar 11, 2035',
      status: 'Checked Out',
      statusColor: 'bg-slate-100 text-[#475569] font-medium',
      rate: '$320 / night',
    },
  ];

  // Filter booking records
  const filteredBookings = bookingListRecords.filter((b) => {
    if (statusFilter !== 'All' && b.status !== statusFilter) return false;
    if (bookingSearch.trim()) {
      const q = bookingSearch.toLowerCase();
      return b.guestName.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.roomNo.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#19202D] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom">
          <CheckCircle2 className="w-4 h-4 text-[#D2F829]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP GREETING & RBAC STATUS ROW MATCHING REFERENCE IMAGE */}
      <div className="bg-white border border-[#E7EBF0] rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EAF3FF] text-[#2583E9] flex items-center gap-1.5">
              <Hotel className="w-3.5 h-3.5" />
              <span>{selectedProperty.name}</span>
            </span>
            <span className="text-xs text-[#6B7280]">
              Saturday, 25 November 2028
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#19202D] tracking-tight">
            Hi, {currentUser.name.split(' ')[0]}
          </h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Operations overview: <span className="font-semibold text-[#19202D]">88 Total Rooms</span> • 68 Occupied • 20 Ready for check-in
          </p>
        </div>

        {/* Right side: Active Role & Switcher + Date filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* RBAC Active Role Pill */}
          <button
            onClick={() => setRoleModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F8FAFC] hover:bg-[#EAF3FF] border border-[#E7EBF0] hover:border-[#2583E9] text-xs transition-all shadow-2xs group cursor-pointer"
            title="Click to switch role or inspect permissions"
          >
            <ShieldCheck className="w-4 h-4 text-[#2583E9]" />
            <div className="text-left">
              <span className="text-[10px] text-[#6B7280] block leading-none">RBAC View</span>
              <span className="text-xs font-bold text-[#19202D] group-hover:text-[#2583E9] leading-tight">
                {currentUser.role}
              </span>
            </div>
            <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#D2F829] text-[#19202D]">
              Switch Role
            </span>
          </button>

          {/* Quick Action: New Reservation */}
          <button
            onClick={() => setNewResOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2583E9] hover:bg-[#1768C4] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Reservation</span>
          </button>
        </div>
      </div>

      {/* 2. TOP 5 KPI STAT CARDS MATCHING REFERENCE IMAGE 100% */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* CARD 1: Solid Vibrant Blue Card matching reference */}
        <div className="bg-[#2583E9] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-100">Total Earnings</span>
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <h3 className="text-3xl font-black tracking-tight text-white">$58,240</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#D2F829] text-[#19202D] text-[11px] font-black shadow-2xs">
              +15.6%
            </span>
            <span className="text-[11px] text-blue-100 font-medium">from last week</span>
          </div>
        </div>

        {/* CARD 2: New Reservations */}
        <div className="bg-white border border-[#E7EBF0] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">New Reservations</span>
            <div className="w-8 h-8 rounded-full bg-[#EAF3FF] text-[#2583E9] flex items-center justify-center">
              <CalendarCheck className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="my-3">
            <h3 className="text-3xl font-black text-[#19202D]">128</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#EBF7F0] text-[#20A66A] text-[11px] font-bold">
              +12.4%
            </span>
            <span className="text-[11px] text-[#6B7280]">from last week</span>
          </div>
        </div>

        {/* CARD 3: Guests Checked In */}
        <div className="bg-white border border-[#E7EBF0] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Guests Checked In</span>
            <div className="w-8 h-8 rounded-full bg-[#EAF3FF] text-[#2583E9] flex items-center justify-center">
              <Users className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="my-3">
            <h3 className="text-3xl font-black text-[#19202D]">94</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#EBF7F0] text-[#20A66A] text-[11px] font-bold">
              +8.7%
            </span>
            <span className="text-[11px] text-[#6B7280]">week over week</span>
          </div>
        </div>

        {/* CARD 4: Guests Checked Out */}
        <div className="bg-white border border-[#E7EBF0] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Guests Checked Out</span>
            <div className="w-8 h-8 rounded-full bg-[#EAF3FF] text-[#2583E9] flex items-center justify-center">
              <LogOut className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="my-3">
            <h3 className="text-3xl font-black text-[#19202D]">76</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#FDF2F2] text-[#E85B63] text-[11px] font-bold">
              -2.1%
            </span>
            <span className="text-[11px] text-[#6B7280]">from previous week</span>
          </div>
        </div>

        {/* CARD 5: Room Availability with striped barcode representation */}
        <div className="bg-white border border-[#E7EBF0] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6B7280] block">Room Availability</span>
              <h4 className="text-base font-black text-[#19202D] mt-0.5">Total 88 Rooms</h4>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#FEF9E7] text-[#D9A300] flex items-center justify-center">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>

          {/* Visual Striped Barcode Graphic matching reference */}
          <div className="my-2 py-1.5 px-2 bg-[#F8FAFC] rounded-xl border border-[#E7EBF0]">
            <div className="flex items-end gap-[3px] h-8 justify-between">
              {Array.from({ length: 28 }).map((_, i) => {
                const isOccupied = i < 21; // ~75% occupied
                return (
                  <div
                    key={i}
                    className={`w-[4px] rounded-full transition-all ${
                      isOccupied ? 'bg-[#2583E9] h-full' : 'bg-[#D2F829] h-3/4'
                    }`}
                    title={isOccupied ? 'Occupied Suite' : 'Reserved / Available'}
                  />
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#19202D]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2583E9]" />
              <span>68 Occupied</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D2F829] border border-black/20" />
              <span>20 Reserved</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. ROW 2: REVENUE SPLINE + OCCUPANCY 7-DAY BARS + TASKS WIDGET */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 of 12 cols): Dual Main Charts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Chart 1: Revenue Smooth Spline Area Chart */}
          <div className="bg-white border border-[#E7EBF0] rounded-2xl p-5 shadow-xs relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#19202D]">Revenue</h3>
                <p className="text-xs text-[#6B7280]">Total booking gross and room stay income</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-[#D2F829] text-[#19202D] text-xs font-black">
                  Peak: $255,060
                </span>
                <select className="text-xs font-bold bg-[#F8FAFC] border border-[#E7EBF0] text-[#19202D] px-3 py-1.5 rounded-xl focus:outline-none">
                  <option>Last 6 Months</option>
                  <option>Last 30 Days</option>
                  <option>This Year (2028)</option>
                </select>
              </div>
            </div>

            <div className="h-60 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2583E9" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2583E9" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 11 }}
                    tickFormatter={(val) => `$${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#19202D', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    formatter={(val: any) => [`$${val.toLocaleString()}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2583E9"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                    dot={{ fill: '#D2F829', stroke: '#19202D', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#D2F829' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Occupancy Trend 7-Day Dual Bar Chart */}
          <div className="bg-white border border-[#E7EBF0] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#19202D]">Occupancy Trend</h3>
                <p className="text-xs text-[#6B7280]">Daily occupancy vs available rooms</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 text-xs font-semibold text-[#6B7280]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2583E9]" />
                    <span>Occupied</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1]" />
                    <span>Available</span>
                  </span>
                </div>

                <select className="text-xs font-bold bg-[#F8FAFC] border border-[#E7EBF0] text-[#19202D] px-3 py-1.5 rounded-xl focus:outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 14 Days</option>
                  <option>This Month</option>
                </select>
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occupancy7Days} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#19202D', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    formatter={(val: any, name: any) => [`${val} Rooms`, name === 'occupied' ? 'Occupied' : 'Available']}
                  />
                  <Bar dataKey="occupied" fill="#2583E9" radius={[6, 6, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="available" fill="#CBD5E1" radius={[6, 6, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column (4 of 12 cols): Real Hotel Tasks Card */}
        <div className="lg:col-span-4 bg-white border border-[#E7EBF0] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E7EBF0]">
              <div>
                <h3 className="text-base font-bold text-[#19202D]">Tasks</h3>
                <span className="text-xs text-[#6B7280]">
                  {taskList.filter(t => !t.done).length} pending actions today
                </span>
              </div>
              <button
                onClick={() => {
                  const newTaskTitle = prompt('Enter new task description:');
                  if (newTaskTitle) {
                    setTaskList(prev => [
                      { id: `T-${Date.now()}`, title: newTaskTitle, date: 'Today', priority: 'Medium', done: false, room: 'Front Desk', staff: currentUser.name },
                      ...prev
                    ]);
                    showToast('Task added successfully');
                  }
                }}
                className="p-1.5 rounded-lg bg-[#F8FAFC] hover:bg-[#EAF3FF] text-[#2583E9] border border-[#E7EBF0] text-xs font-bold"
                title="Add Task"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
              {taskList.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    task.done
                      ? 'bg-[#F8FAFC] border-[#E7EBF0] opacity-60'
                      : 'bg-white border-[#E7EBF0] hover:border-[#2583E9]/50 hover:bg-[#EAF3FF]/20 shadow-2xs'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      task.done ? 'bg-[#20A66A] text-white' : 'border border-[#CBD5E1] bg-white'
                    }`}
                  >
                    {task.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold text-[#19202D] leading-snug ${task.done ? 'line-through text-[#6B7280]' : ''}`}>
                      {task.title}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[10px] text-[#6B7280] flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {task.date}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-[#475569] font-medium">
                        {task.room}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          task.priority === 'High'
                            ? 'bg-[#FDF2F2] text-[#E85B63]'
                            : 'bg-[#FEF9E7] text-[#D9A300]'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E7EBF0] mt-4 flex items-center justify-between text-xs text-[#6B7280]">
            <span>Assigned to: {currentUser.name}</span>
            <button
              onClick={() => setActiveTab('calendar')}
              className="text-[#2583E9] font-bold hover:underline"
            >
              View Schedule &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 4. ROW 3: BOOKING SOURCE + OVERALL RATING + RECENT ACTIVITIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Card 1: Booking Source (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E7EBF0] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E7EBF0]">
              <h3 className="text-base font-bold text-[#19202D]">Booking Source</h3>
              <span className="text-xs text-[#6B7280]">Channel share</span>
            </div>

            {/* Donut Chart with Bed Icon in center */}
            <div className="h-44 w-full relative flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="percentage"
                  >
                    {bookingSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#19202D', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    formatter={(val: any) => [`${val}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Centered Hotel Bed Icon */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-[#EAF3FF] text-[#2583E9] flex items-center justify-center">
                  <BedDouble className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Progress Bars Breakdown */}
            <div className="space-y-2.5 mt-2">
              {bookingSources.map((src) => (
                <div key={src.name}>
                  <div className="flex justify-between text-xs font-semibold text-[#19202D] mb-1">
                    <span className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${src.bg}`} />
                      <span className="truncate">{src.name}</span>
                    </span>
                    <span className="font-bold">{src.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${src.bg} rounded-full`}
                      style={{ width: `${src.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Overall Rating (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E7EBF0] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E7EBF0]">
              <h3 className="text-base font-bold text-[#19202D]">Overall Rating</h3>
              <span className="text-xs text-[#20A66A] font-bold">Top 5% in Miami</span>
            </div>

            {/* Semicircle Speedometer Arc Meter */}
            <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E7EBF0] text-center my-2">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-white shadow-2xs border border-[#E7EBF0] mb-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#19202D]">4.7</span>
                  <span className="text-sm font-bold text-[#6B7280]">/ 5.0</span>
                </div>
              </div>
              <p className="text-xs font-semibold text-[#19202D]">1,248 Verified Guest Reviews</p>
              <div className="flex items-center justify-center gap-1 mt-1 text-[#F4C928]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F4C928]" />
                ))}
              </div>
            </div>

            {/* Rating Category Progress Bars */}
            <div className="space-y-2 mt-3">
              {ratingCategories.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <span className="text-[#475569] font-medium">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2583E9] rounded-full" style={{ width: `${cat.percent}%` }} />
                    </div>
                    <span className="font-bold text-[#19202D] w-8 text-right">{cat.score} ★</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Recent Activities (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E7EBF0] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E7EBF0]">
              <h3 className="text-base font-bold text-[#19202D]">Recent Activities</h3>
              <span className="text-xs text-[#2583E9] font-bold cursor-pointer" onClick={() => setActiveTab('settings')}>
                Audit Log
              </span>
            </div>

            {/* Timeline matching reference icons */}
            <div className="space-y-3.5 mt-2">
              {recentActivities.map((act) => {
                const IconComponent = act.icon;
                return (
                  <div key={act.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full ${act.iconBg} flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#19202D] leading-snug">
                        {act.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-[#6B7280] font-medium">{act.time}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-[#475569] font-semibold">
                          {act.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('settings')}
            className="w-full mt-4 py-2 px-3 rounded-xl bg-[#F8FAFC] hover:bg-[#EAF3FF] border border-[#E7EBF0] text-xs font-bold text-[#2583E9] transition-all text-center"
          >
            View Complete Operations Audit Trail &rarr;
          </button>
        </div>
      </div>

      {/* 5. ROW 4: BOOKING LIST / RECENT RESERVATIONS TABLE */}
      <div className="bg-white border border-[#E7EBF0] rounded-2xl p-5 shadow-xs">
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#19202D]">Booking List</h3>
            <p className="text-xs text-[#6B7280]">Real-time guest check-in desk and folio status</p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#8C95A6] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                placeholder="Search guest, status, etc."
                className="w-full bg-[#F8FAFC] text-xs pl-8 pr-3 py-1.5 rounded-xl border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9] focus:bg-white"
              />
            </div>

            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold bg-[#F8FAFC] border border-[#E7EBF0] text-[#19202D] px-3 py-1.5 rounded-xl focus:outline-none"
            >
              <option value="All">All Status</option>
              <option value="Checked In">Checked In</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Checked Out">Checked Out</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E7EBF0] text-[#6B7280] font-semibold text-[11px] uppercase tracking-wider bg-[#F8FAFC]">
                <th className="py-3 px-4">Booking ID & Guest Name</th>
                <th className="py-3 px-4">Room Type</th>
                <th className="py-3 px-4 text-center">Room No.</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Check-in & Check-Out</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7EBF0]">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#F8FAFC] transition-colors">
                  {/* Guest Name & Avatar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={b.avatar}
                        alt={b.guestName}
                        className="w-8 h-8 rounded-full object-cover border border-[#E7EBF0]"
                      />
                      <div>
                        <span className="font-mono text-[10px] text-[#2583E9] block font-bold leading-none">
                          {b.id}
                        </span>
                        <span className="font-bold text-[#19202D] leading-tight">
                          {b.guestName}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Room Type */}
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1.5 text-[#19202D] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2583E9]" />
                      <span>{b.roomType}</span>
                    </span>
                    <span className="text-[10px] text-[#6B7280] block ml-3">{b.rate}</span>
                  </td>

                  {/* Room No */}
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-mono font-bold text-[#19202D]">
                      {b.roomNo}
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="py-3 px-4 font-medium text-[#19202D]">
                    {b.duration}
                  </td>

                  {/* Dates */}
                  <td className="py-3 px-4 text-[#6B7280] font-medium">
                    {b.dates}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] ${b.statusColor} shadow-2xs`}>
                      {b.status}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="px-2 py-1 rounded-lg bg-[#EAF3FF] hover:bg-[#2583E9] text-[#2583E9] hover:text-white font-bold text-[11px] transition-colors"
                      >
                        Details
                      </button>
                      {b.status === 'Confirmed' && (
                        <button
                          onClick={() => showToast(`Checked in ${b.guestName} to Room ${b.roomNo}`)}
                          className="px-2 py-1 rounded-lg bg-[#D2F829] hover:bg-[#C2E820] text-[#19202D] font-bold text-[11px] transition-colors"
                        >
                          Check In
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title={`Booking Folio: ${selectedBooking.id}`}
          subtitle={`Guest folio and stay summary for ${selectedBooking.guestName}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#E7EBF0]">
              <img
                src={selectedBooking.avatar}
                alt={selectedBooking.guestName}
                className="w-12 h-12 rounded-full object-cover border border-[#E7EBF0]"
              />
              <div>
                <h4 className="font-bold text-[#19202D] text-sm">{selectedBooking.guestName}</h4>
                <p className="text-xs text-[#2583E9] font-medium">{selectedBooking.roomType} • Room {selectedBooking.roomNo}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] ${selectedBooking.statusColor}`}>
                  {selectedBooking.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-white border border-[#E7EBF0] rounded-lg">
                <span className="text-[#6B7280] text-[10px] block">Duration</span>
                <span className="font-bold text-[#19202D]">{selectedBooking.duration}</span>
              </div>
              <div className="p-2.5 bg-white border border-[#E7EBF0] rounded-lg">
                <span className="text-[#6B7280] text-[10px] block">Nightly Rate</span>
                <span className="font-bold text-[#19202D]">{selectedBooking.rate}</span>
              </div>
              <div className="p-2.5 bg-white border border-[#E7EBF0] rounded-lg col-span-2">
                <span className="text-[#6B7280] text-[10px] block">Stay Dates</span>
                <span className="font-bold text-[#19202D]">{selectedBooking.dates}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  setSelectedBooking(null);
                  setActiveTab('reservations');
                }}
              >
                Open in Reservations
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Original Proprietary Platform Footer */}
      <div className="pt-6 border-t border-[#E7EBF0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] gap-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#19202D]">AuraStay Cloud Hospitality Suite</span>
          <span>•</span>
          <span>Version 3.4.0-PRO</span>
          <span>•</span>
          <span className="text-[#20A66A] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#20A66A]" /> All Systems Operational
          </span>
        </div>
        <p className="text-[11px]">
          © 2028-2029 AuraStay Inc. Proprietary Hotel Management & Operating Architecture.
        </p>
      </div>

      {/* Quick Action Modals */}
      <NewReservationModal isOpen={newResOpen} onClose={() => setNewResOpen(false)} />
      <AddGuestModal isOpen={addGuestOpen} onClose={() => setAddGuestOpen(false)} />
      <AddRoomModal isOpen={addRoomOpen} onClose={() => setAddRoomOpen(false)} />
      <CreateInvoiceModal isOpen={createInvOpen} onClose={() => setCreateInvOpen(false)} />
      <RoleSwitcherModal isOpen={roleModalOpen} onClose={() => setRoleModalOpen(false)} />
    </div>
  );
};
