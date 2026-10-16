import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Card, Badge, Button, Modal } from '../components/ui';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertTriangle,
  Plus,
  Search,
  CheckSquare
} from 'lucide-react';

export const HousekeepingView: React.FC = () => {
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterFloor, setFilterFloor] = useState('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Orders matching Image 5 top-right exactly
  const housekeepingOrders = [
    {
      room: '101',
      floor: '1st',
      roomType: 'Standard Room',
      housekeepingStatus: 'Cleaning In Progress',
      priority: 'High',
      reservationStatus: 'Reserved',
      assignedStaff: 'Amelia Brown',
      notes: 'Urgent prep for new check-in',
    },
    {
      room: '102',
      floor: '1st',
      roomType: 'Standard Room',
      housekeepingStatus: 'Pending',
      priority: 'Normal',
      reservationStatus: 'Occupied',
      assignedStaff: 'Leo Tan',
      notes: 'Fresh towels and toiletries replaced',
    },
    {
      room: '103',
      floor: '1st',
      roomType: 'Deluxe Suite',
      housekeepingStatus: 'Pending',
      priority: 'High',
      reservationStatus: 'Reserved',
      assignedStaff: 'Grace Miller',
      notes: 'VIP guest arriving this afternoon',
    },
    {
      room: '104',
      floor: '1st',
      roomType: 'Standard Room',
      housekeepingStatus: 'Cleaning In Progress',
      priority: 'Low',
      reservationStatus: 'Available',
      assignedStaff: 'Ryan Park',
      notes: 'Regular turnover',
    },
    {
      room: '201',
      floor: '2nd',
      roomType: 'Executive Suite',
      housekeepingStatus: 'Completed',
      priority: 'Normal',
      reservationStatus: 'Reserved',
      assignedStaff: 'Maria Lopez',
      notes: 'Room sanitized, minibar restocked',
    },
    {
      room: '202',
      floor: '2nd',
      roomType: 'Deluxe Suite',
      housekeepingStatus: 'Pending',
      priority: 'High',
      reservationStatus: 'Occupied',
      assignedStaff: 'Daniel Cruz',
      notes: 'Requires maintenance follow-up',
    },
    {
      room: '203',
      floor: '2nd',
      roomType: 'Superior Room',
      housekeepingStatus: 'Cleaning In Progress',
      priority: 'Normal',
      reservationStatus: 'Available',
      assignedStaff: 'Hannah Smith',
      notes: 'Deep cleaning required. Sandy checkout',
    },
    {
      room: '204',
      floor: '2nd',
      roomType: 'Deluxe Suite',
      housekeepingStatus: 'Completed',
      priority: 'Low',
      reservationStatus: 'Available',
      assignedStaff: 'Oliver Green',
      notes: 'Routine daily cleaning done',
    },
    {
      room: '301',
      floor: '3rd',
      roomType: 'Executive Suite',
      housekeepingStatus: 'Pending',
      priority: 'High',
      reservationStatus: 'Occupied',
      assignedStaff: 'Clara Lee',
      notes: 'Awaiting linen delivery',
    },
    {
      room: '302',
      floor: '3rd',
      roomType: 'Superior Room',
      housekeepingStatus: 'Completed',
      priority: 'Normal',
      reservationStatus: 'Available',
      assignedStaff: 'Jacob Flores',
      notes: 'Inspection scheduled tomorrow',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#19202D] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom">
          <CheckCircle2 className="w-4 h-4 text-[#D2F829]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Housekeeping Orders Card Matching Reference Image 5 Top-Right */}
      <Card noPadding title="List Orders" subtitle="Turnover orders and daily tidying queue">
        <div className="p-4 border-b border-[#E7EBF0] flex items-center justify-between gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="w-3.5 h-3.5 text-[#8C95A6] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search room number, staff, etc"
              className="w-full bg-[#F8FAFC] text-xs pl-9 pr-4 py-1.5 rounded-full border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
            />
          </div>

          {/* Filter Pills matching reference with bright lime-yellow buttons! */}
          <div className="flex items-center gap-2 text-xs">
            <select className="bg-[#F8FAFC] border border-[#E7EBF0] text-xs font-semibold text-[#19202D] px-3 py-1.5 rounded-full focus:outline-none">
              <option>All Status v</option>
              <option>Pending</option>
              <option>Cleaning In Progress</option>
              <option>Completed</option>
            </select>

            <button className="px-3.5 py-1.5 rounded-full bg-[#D2F829] text-[#19202D] text-xs font-bold transition-all shadow-sm">
              Priority v
            </button>

            <button className="px-3.5 py-1.5 rounded-full bg-[#D2F829] text-[#19202D] text-xs font-bold transition-all shadow-sm">
              Floor v
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E7EBF0] text-[#6B7280]">
              <tr>
                <th className="py-3 px-3 font-semibold">Room #</th>
                <th className="py-3 px-3 font-semibold">Floor</th>
                <th className="py-3 px-3 font-semibold">Room Type</th>
                <th className="py-3 px-3 font-semibold">Housekeeping Status</th>
                <th className="py-3 px-3 font-semibold">Priority</th>
                <th className="py-3 px-3 font-semibold">Reservation Status</th>
                <th className="py-3 px-3 font-semibold">Assigned Staff</th>
                <th className="py-3 px-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7EBF0]">
              {housekeepingOrders.map((ord, idx) => (
                <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3 font-black text-sm text-[#19202D]">Room {ord.room}</td>
                  <td className="py-3 px-3 text-[#6B7280]">{ord.floor}</td>
                  <td className="py-3 px-3 font-medium text-[#19202D]">{ord.roomType}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      ord.housekeepingStatus === 'Completed'
                        ? 'bg-[#EBF7F0] text-[#20A66A]'
                        : ord.housekeepingStatus === 'Cleaning In Progress'
                        ? 'bg-[#D2F829] text-[#19202D]'
                        : 'bg-[#FEECEC] text-[#FA6B6B]'
                    }`}>
                      {ord.housekeepingStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      ord.priority === 'High' ? 'bg-[#FEECEC] text-[#FA6B6B]' :
                      ord.priority === 'Normal' ? 'bg-[#D2F829] text-[#19202D]' :
                      'bg-[#EAF3FF] text-[#2583E9]'
                    }`}>
                      {ord.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#19202D]">{ord.reservationStatus}</td>
                  <td className="py-3 px-3 font-semibold text-[#19202D]">{ord.assignedStaff}</td>
                  <td className="py-3 px-3 text-[#6B7280] truncate max-w-[200px]">{ord.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
