import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Card, Badge, Button, Modal } from '../components/ui';
import {
  Search,
  Plus,
  Download,
  Calendar,
  User,
  BedDouble,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Share2,
  Gift,
  ShieldCheck,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Reservation, Guest } from '../types';
import { NewReservationModal } from '../components/modals/NewReservationModal';

export const ReservationsView: React.FC = () => {
  const {
    reservations,
    rooms,
    roomTypes,
    guests,
    checkInReservation,
    checkOutReservation,
    cancelReservation,
    changeReservationRoom,
    extendStay,
  } = useHotel();

  const [activeSubTab, setActiveSubTab] = useState<'reservations' | 'guests'>('reservations');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [newResOpen, setNewResOpen] = useState(false);
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

  // Reference charts data
  const reservationTrendData = [
    { month: 'Jan', confirmed: 14, cancelled: 6 },
    { month: 'Feb', confirmed: 18, cancelled: 8 },
    { month: 'Mar', confirmed: 24, cancelled: 10 },
    { month: 'Apr', confirmed: 20, cancelled: 7 },
    { month: 'May', confirmed: 26, cancelled: 12 },
    { month: 'Jun', confirmed: 32, cancelled: 14 },
    { month: 'Jul', confirmed: 17, cancelled: 25 },
    { month: 'Aug', confirmed: 28, cancelled: 9 },
    { month: 'Sep', confirmed: 22, cancelled: 8 },
    { month: 'Oct', confirmed: 30, cancelled: 11 },
    { month: 'Nov', confirmed: 25, cancelled: 7 },
    { month: 'Dec', confirmed: 34, cancelled: 12 },
  ];

  const mostBookedData = [
    { name: 'Deluxe Suite', value: 324, color: '#2583E9' },
    { name: 'Superior Room', value: 182, color: '#D2F829' },
    { name: 'Executive Suite', value: 142, color: '#60A5FA' },
    { name: 'Standard Room', value: 98, color: '#38BDF8' },
    { name: 'Premium Deluxe', value: 76, color: '#FCD34D' },
    { name: 'Family Suite', value: 42, color: '#F87171' },
  ];

  const filteredReservations = reservations.filter(res => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!res.guestName.toLowerCase().includes(q) && !res.id.toLowerCase().includes(q) && !res.roomNumber.includes(q)) {
        return false;
      }
    }
    if (filterStatus !== 'All' && res.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Sub-tab navigation */}
      <div className="flex items-center justify-between">
        <div className="flex border border-[#E7EBF0] rounded-xl overflow-hidden bg-[#F8FAFC] p-1">
          <button
            onClick={() => setActiveSubTab('reservations')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'reservations'
                ? 'bg-white text-[#2583E9] shadow-sm'
                : 'text-[#6B7280] hover:text-[#19202D]'
            }`}
          >
            Reservation Overview & Bookings
          </button>
          <button
            onClick={() => setActiveSubTab('guests')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'guests'
                ? 'bg-white text-[#2583E9] shadow-sm'
                : 'text-[#6B7280] hover:text-[#19202D]'
            }`}
          >
            Guest Profile (Ethan Brown)
          </button>
        </div>

        <Button
          variant="lime"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
          onClick={() => setNewResOpen(true)}
        >
          New Reservation
        </Button>
      </div>

      {activeSubTab === 'reservations' && (
        <>
          {/* 1. 4 Metric Cards Matching Reference Screenshot Exactly */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Reservations Today */}
            <div className="bg-white rounded-2xl border border-[#E7EBF0] p-5 shadow-subtle flex flex-col justify-between">
              <span className="text-3xl font-black text-[#19202D]">42</span>
              <div className="mt-2">
                <span className="text-xs font-semibold text-[#6B7280] block">Total Reservations Today</span>
                <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-[#D2F829] text-[#19202D] text-[10px] font-extrabold">
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  <span>+8.2% from last month</span>
                </div>
              </div>
            </div>

            {/* Average Stay Duration */}
            <div className="bg-white rounded-2xl border border-[#E7EBF0] p-5 shadow-subtle flex flex-col justify-between">
              <span className="text-3xl font-black text-[#19202D]">3.6</span>
              <div className="mt-2">
                <span className="text-xs font-semibold text-[#6B7280] block">Average Stay Duration</span>
                <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-[#D2F829] text-[#19202D] text-[10px] font-extrabold">
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  <span>+12.5% from last month</span>
                </div>
              </div>
            </div>

            {/* Confirmed Rate */}
            <div className="bg-white rounded-2xl border border-[#E7EBF0] p-5 shadow-subtle flex flex-col justify-between">
              <span className="text-3xl font-black text-[#19202D]">80%</span>
              <div className="mt-2">
                <span className="text-xs font-semibold text-[#6B7280] block">Confirmed Rate</span>
                <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-[#D2F829] text-[#19202D] text-[10px] font-extrabold">
                  <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                  <span>-2.1% from last month</span>
                </div>
              </div>
            </div>

            {/* Cancellation Rate */}
            <div className="bg-white rounded-2xl border border-[#E7EBF0] p-5 shadow-subtle flex flex-col justify-between">
              <span className="text-3xl font-black text-[#19202D]">4.8%</span>
              <div className="mt-2">
                <span className="text-xs font-semibold text-[#6B7280] block">Cancellation Rate</span>
                <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-[#D2F829] text-[#19202D] text-[10px] font-extrabold">
                  <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                  <span>-3.2% from last month</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Dual Charts from Original Reference: Reservation Trend & Most Booked */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reservation Trend Double Bar Chart */}
            <Card
              className="lg:col-span-2"
              title="Reservation Trend"
              headerAction={
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2583E9]" />
                    <span className="text-[#6B7280]">Confirmed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D2F829]" />
                    <span className="text-[#6B7280]">Cancelled</span>
                  </div>
                </div>
              }
            >
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reservationTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7EBF0" />
                    <XAxis dataKey="month" stroke="#8C95A6" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8C95A6" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2.5 rounded-xl border border-[#E7EBF0] shadow-md text-xs">
                              <p className="font-bold text-[#19202D] mb-1">{payload[0]?.payload.month} Bookings</p>
                              <p className="text-[#2583E9] font-semibold">{payload[0]?.value} Rooms Confirmed</p>
                              <p className="text-[#19202D] font-semibold">{payload[1]?.value} Rooms Cancelled</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="confirmed" fill="#2583E9" radius={[4, 4, 0, 0]} maxBarSize={14} />
                    <Bar dataKey="cancelled" fill="#D2F829" radius={[4, 4, 0, 0]} maxBarSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Most Booked Donut Chart */}
            <Card title="Most Booked" subtitle="Distribution by category">
              <div className="flex items-center justify-between gap-4">
                <div className="w-32 h-32 relative flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mostBookedData}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={56}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {mostBookedData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Isometric box indicator in center matching reference */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <BedDouble className="w-5 h-5 text-[#2583E9]" />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs flex-1">
                  {mostBookedData.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-[#6B7280] text-[11px] truncate">{item.name}</span>
                      </div>
                      <span className="font-bold text-[#19202D] text-[11px]">{item.value} Booked</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* 3. Reference Table: Reservation List */}
          <Card noPadding title="Reservation" subtitle="Search and manage booking folios">
            <div className="p-4 border-b border-[#E7EBF0] flex items-center justify-between gap-3">
              <div className="relative max-w-sm flex-1">
                <Search className="w-3.5 h-3.5 text-[#8C95A6] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search guest, status, etc"
                  className="w-full bg-[#F8FAFC] text-xs pl-8 pr-3 py-1.5 rounded-full border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#F8FAFC] border border-[#E7EBF0] text-xs font-semibold text-[#19202D] px-3 py-1.5 rounded-full focus:outline-none"
              >
                <option value="All">All Status v</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Checked-in">Checked-in</option>
                <option value="Checked-out">Checked-out</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E7EBF0] text-[#6B7280]">
                  <tr>
                    <th className="py-3 px-3 font-semibold">Booking ID & Guest Name</th>
                    <th className="py-3 px-3 font-semibold">Room Type</th>
                    <th className="py-3 px-3 font-semibold">Room #</th>
                    <th className="py-3 px-3 font-semibold">Request</th>
                    <th className="py-3 px-3 font-semibold">Duration</th>
                    <th className="py-3 px-3 font-semibold">Check-In & Check-Out</th>
                    <th className="py-3 px-3 font-semibold">Status</th>
                    <th className="py-3 px-3 font-semibold">Source</th>
                    <th className="py-3 px-3 font-semibold">Payment</th>
                    <th className="py-3 px-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7EBF0]">
                  {filteredReservations.map(res => (
                    <tr key={res.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3 px-3">
                        <p className="font-bold text-[#19202D]">{res.guestName}</p>
                        <p className="font-mono text-[10px] text-[#2583E9]">#{res.id}</p>
                      </td>
                      <td className="py-3 px-3 text-[#19202D] font-medium">{res.roomTypeName}</td>
                      <td className="py-3 px-3 font-bold text-[#19202D]">{res.roomNumber}</td>
                      <td className="py-3 px-3 text-[#6B7280] truncate max-w-[120px]">{res.specialRequests || 'Standard'}</td>
                      <td className="py-3 px-3 text-[#19202D]">{res.totalNights} Nights</td>
                      <td className="py-3 px-3 text-[#19202D]">
                        {res.checkIn} - {res.checkOut}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          res.status === 'Cancelled' ? 'bg-[#FEECEC] text-[#FA6B6B]' :
                          res.status === 'Pending' ? 'bg-[#D2F829] text-[#19202D]' :
                          'bg-[#EAF3FF] text-[#2583E9]'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#6B7280]">{res.bookingSource}</td>
                      <td className="py-3 px-3">
                        <span className={`text-[11px] font-bold ${res.paymentStatus === 'Paid' ? 'text-[#2583E9]' : 'text-[#FA6B6B]'}`}>
                          • {res.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedRes(res)}
                          className="p-1.5 text-[#8C95A6] hover:text-[#2583E9] rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* GUEST PROFILE (ETHAN BROWN) MATCHING REFERENCE EXACTLY */}
      {activeSubTab === 'guests' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Ethan Brown Bio Card */}
            <div className="bg-white border border-[#E7EBF0] rounded-2xl p-6 shadow-subtle space-y-4">
              <div className="flex flex-col items-center text-center">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&auto=format&fit=crop&q=80"
                  alt="Ethan Brown"
                  className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md mb-3"
                />
                <h3 className="text-base font-extrabold text-[#19202D]">Ethan Brown</h3>
                <p className="text-xs text-[#6B7280]">Male • Canadian</p>
              </div>

              <div className="space-y-2 text-xs pt-3 border-t border-[#E7EBF0]">
                <div className="flex justify-between">
                  <span className="text-[#8C95A6]">Date of Birth</span>
                  <span className="font-semibold text-[#19202D]">July 19, 1995</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C95A6]">Phone Number</span>
                  <span className="font-semibold text-[#19202D]">+1 647-880-2356</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C95A6]">Email Address</span>
                  <span className="font-semibold text-[#19202D]">ethan.brown@example.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C95A6]">Address</span>
                  <span className="font-semibold text-[#19202D]">Toronto, Canada</span>
                </div>
              </div>
            </div>

            {/* Right: Gold Member Card & Rewards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Gold Member Card Matching Reference */}
              <div className="bg-gradient-to-r from-[#C29D59] via-[#DDBE7E] to-[#B38D48] text-white p-6 rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between h-44">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-100 block">Membership Status</span>
                    <h3 className="text-xl font-extrabold text-white mt-1">Gold Member</h3>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-black/20 text-xs font-bold backdrop-blur-sm">
                      4,520 pts
                    </span>
                  </div>
                  <Award className="w-10 h-10 text-amber-100" />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Earn 927,728 points before 04 September 2037 to become Platinum Points</span>
                    <button className="underline text-amber-100">Learn How &gt;</button>
                  </div>
                  <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
              </div>

              {/* Rewards 3 Tiles */}
              <div>
                <h4 className="text-xs font-bold text-[#19202D] mb-3">Rewards</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-white border border-[#E7EBF0] rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#2583E9] flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#19202D]">Free Reschedule</p>
                      <span className="text-[10px] text-[#6B7280]">1 Available</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-[#E7EBF0] rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#2583E9] flex items-center justify-center flex-shrink-0">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#19202D]">Up to 10% Off</p>
                      <span className="text-[10px] text-[#6B7280]">On Direct Bookings</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-[#E7EBF0] rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#2583E9] flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#19202D]">Complimentary</p>
                      <span className="text-[10px] text-[#6B7280]">Late Check-Out</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking History Table with Room Images */}
          <Card noPadding title="Booking History" subtitle="Verified stays and folio archives">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E7EBF0] text-[#6B7280]">
                  <tr>
                    <th className="py-3 px-3 font-semibold">Image</th>
                    <th className="py-3 px-3 font-semibold">Booking ID</th>
                    <th className="py-3 px-3 font-semibold">Booking Date</th>
                    <th className="py-3 px-3 font-semibold">Room Type</th>
                    <th className="py-3 px-3 font-semibold">Room #</th>
                    <th className="py-3 px-3 font-semibold">Check-In / Out</th>
                    <th className="py-3 px-3 font-semibold">Duration</th>
                    <th className="py-3 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7EBF0]">
                  <tr>
                    <td className="py-3 px-3">
                      <img
                        src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=120&auto=format&fit=crop&q=80"
                        alt="Deluxe Suite"
                        className="w-12 h-10 rounded-lg object-cover border border-[#E7EBF0]"
                      />
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#2583E9]">#BK-1025</td>
                    <td className="py-3 px-3 text-[#6B7280]">Jan 10, 2035</td>
                    <td className="py-3 px-3 font-semibold text-[#19202D]">Deluxe Suite</td>
                    <td className="py-3 px-3 font-bold text-[#19202D]">Room 101</td>
                    <td className="py-3 px-3 text-[#19202D]">Jan 12 - Jan 16, 2035</td>
                    <td className="py-3 px-3 text-[#6B7280]">4 Nights</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#EBF7F0] text-[#20A66A] text-[10px] font-bold">
                        Completed
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3">
                      <img
                        src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=120&auto=format&fit=crop&q=80"
                        alt="Superior Room"
                        className="w-12 h-10 rounded-lg object-cover border border-[#E7EBF0]"
                      />
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#2583E9]">#BK-1892</td>
                    <td className="py-3 px-3 text-[#6B7280]">Nov 18, 2034</td>
                    <td className="py-3 px-3 font-semibold text-[#19202D]">Superior Room</td>
                    <td className="py-3 px-3 font-bold text-[#19202D]">Room 215</td>
                    <td className="py-3 px-3 text-[#19202D]">Nov 20 - Nov 22, 2034</td>
                    <td className="py-3 px-3 text-[#6B7280]">2 Nights</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#EBF7F0] text-[#20A66A] text-[10px] font-bold">
                        Completed
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3">
                      <img
                        src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=120&auto=format&fit=crop&q=80"
                        alt="Executive Suite"
                        className="w-12 h-10 rounded-lg object-cover border border-[#E7EBF0]"
                      />
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#2583E9]">#BK-1820</td>
                    <td className="py-3 px-3 text-[#6B7280]">Sep 02, 2034</td>
                    <td className="py-3 px-3 font-semibold text-[#19202D]">Executive Suite</td>
                    <td className="py-3 px-3 font-bold text-[#19202D]">Room 205</td>
                    <td className="py-3 px-3 text-[#19202D]">Sep 05 - Sep 08, 2034</td>
                    <td className="py-3 px-3 text-[#6B7280]">3 Nights</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#FEECEC] text-[#FA6B6B] text-[10px] font-bold">
                        Cancelled
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* New Reservation Modal */}
      <NewReservationModal isOpen={newResOpen} onClose={() => setNewResOpen(false)} />
    </div>
  );
};
