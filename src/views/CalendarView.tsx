import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Card, Badge, Button, Modal } from '../components/ui';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  BedDouble,
  CheckCircle2,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { CalendarEvent, CalendarEventCategory } from '../types';

export const CalendarView: React.FC = () => {
  const { calendarEvents, createCalendarEvent, deleteCalendarEvent } = useHotel();

  const [currentDate, setCurrentDate] = useState(new Date('2035-03-01'));
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CalendarEventCategory>('Guest Check-in');
  const [startDate, setStartDate] = useState('2035-03-10');
  const [startTime, setStartTime] = useState('08:00');

  // Exact categories from Image 1
  const categoriesList = [
    { label: 'Staff Schedule', color: '#2583E9', bg: 'bg-[#EAF3FF]', text: 'text-[#2583E9]', border: 'border-[#BEDCFF]' },
    { label: 'Guest Appointment', color: '#D2F829', bg: 'bg-[#F5FDD6]', text: 'text-[#19202D]', border: 'border-[#E4F878]' },
    { label: 'Maintenance Task', color: '#FA6B6B', bg: 'bg-[#FEECEC]', text: 'text-[#FA6B6B]', border: 'border-[#FCD2D2]' },
  ];

  // March 2035 calendar grid mock events matching Image 1
  const marchEvents: Record<number, Array<{ id: string; time: string; title: string; type: 'Staff Schedule' | 'Guest Appointment' | 'Maintenance Task' }>> = {
    10: [
      { id: '1', time: '08:00 AM', title: 'Front Desk Morning Shift', type: 'Staff Schedule' },
      { id: '2', time: '02:30 PM', title: 'Air Conditioning Service', type: 'Maintenance Task' },
    ],
    11: [
      { id: '3', time: '10:00 AM', title: 'Corporate Meeting: TechVision Ltd', type: 'Maintenance Task' },
    ],
    15: [
      { id: '4', time: '03:00 PM', title: 'VIP Arrival: Sophia M.', type: 'Guest Appointment' },
    ],
    18: [
      { id: '5', time: '11:00 AM', title: 'Penthouse Deep Inspection', type: 'Staff Schedule' },
    ],
    22: [
      { id: '6', time: '09:30 AM', title: 'Pool Filtration Flushing', type: 'Maintenance Task' },
    ],
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top Header Controls matching Image 1 */}
      <div className="bg-white border border-[#E7EBF0] rounded-2xl p-4 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Month selector & Switchers */}
        <div className="flex items-center gap-3">
          <div className="flex border border-[#E7EBF0] rounded-xl overflow-hidden bg-[#F8FAFC] p-0.5">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-1 text-xs font-black rounded-lg transition-all ${
                viewMode === 'month'
                  ? 'bg-[#D2F829] text-[#19202D] shadow-sm'
                  : 'text-[#6B7280]'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-1 text-xs font-black rounded-lg transition-all ${
                viewMode === 'week'
                  ? 'bg-[#D2F829] text-[#19202D] shadow-sm'
                  : 'text-[#6B7280]'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-1 text-xs font-black rounded-lg transition-all ${
                viewMode === 'day'
                  ? 'bg-[#D2F829] text-[#19202D] shadow-sm'
                  : 'text-[#6B7280]'
              }`}
            >
              Day
            </button>
          </div>

          <h2 className="text-base font-extrabold text-[#19202D] flex items-center gap-1 cursor-pointer">
            March, 2035 <ChevronDown className="w-4 h-4 text-[#8C95A6]" />
          </h2>
        </div>

        {/* Category & + Add New button in Lime-Yellow */}
        <div className="flex items-center gap-2">
          <select className="bg-[#F8FAFC] border border-[#E7EBF0] text-xs font-semibold text-[#19202D] px-3 py-1.5 rounded-full focus:outline-none">
            <option>All Category v</option>
            <option>Staff Schedule</option>
            <option>Guest Appointment</option>
            <option>Maintenance Task</option>
          </select>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-1.5 rounded-full bg-[#D2F829] hover:bg-[#C2E820] text-[#19202D] text-xs font-black transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add new</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Schedule Overview Left Card + Calendar Grid Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Schedule Overview matching Image 1 (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <Card title="Schedule Overview">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E7EBF0]">
                <span className="text-[#6B7280]">Total All Schedules</span>
                <span className="font-extrabold text-[#19202D]">12</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E7EBF0]">
                <span className="text-[#6B7280]">Staff Schedule</span>
                <span className="font-extrabold text-[#19202D]">5</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E7EBF0]">
                <span className="text-[#6B7280]">Guest Appointment</span>
                <span className="font-extrabold text-[#19202D]">4</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E7EBF0]">
                <span className="text-[#6B7280]">Maintenance Task</span>
                <span className="font-extrabold text-[#19202D]">3</span>
              </div>

              {/* Categories dots matching Image 1 */}
              <div className="pt-3 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C95A6] block">
                  Categories
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2583E9]" />
                  <span className="text-[#19202D] font-medium">Staff Schedule</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D2F829]" />
                  <span className="text-[#19202D] font-medium">Guest Appointment</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FA6B6B]" />
                  <span className="text-[#19202D] font-medium">Maintenance Task</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Calendar Month Grid matching Image 1 (9 cols) */}
        <div className="lg:col-span-9">
          <div className="bg-white border border-[#E7EBF0] rounded-2xl shadow-subtle overflow-hidden">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-[#E7EBF0] bg-[#F8FAFC] text-center text-xs font-bold text-[#6B7280] py-2.5">
              <span>Sunday</span>
              <span>Monday</span>
              <span>Tuesday</span>
              <span>Wednesday</span>
              <span>Thursday</span>
              <span>Friday</span>
              <span>Saturday</span>
            </div>

            {/* Days Grid: March 2035 starts on Thursday (index 4) */}
            <div className="grid grid-cols-7 divide-x divide-y divide-[#E7EBF0]">
              {/* Previous month trailing days (Feb 25, 26, 27, 28) */}
              {['25', '26', '27', '28'].map((day, i) => (
                <div key={`prev-${i}`} className="min-h-[105px] p-2 bg-[#FAFAFA] text-[#CBD5E1] text-xs font-bold">
                  {day}
                </div>
              ))}

              {/* March days 1 to 31 */}
              {[...Array(31)].map((_, i) => {
                const dayNum = i + 1;
                const events = marchEvents[dayNum] || [];

                return (
                  <div
                    key={dayNum}
                    className="min-h-[105px] p-2 hover:bg-slate-50 transition-colors flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-[#19202D]">{dayNum}</span>

                    <div className="space-y-1 my-1">
                      {events.map(ev => {
                        const isBlue = ev.type === 'Staff Schedule';
                        const isSalmon = ev.type === 'Maintenance Task';
                        const isLime = ev.type === 'Guest Appointment';

                        return (
                          <div
                            key={ev.id}
                            className={`p-1.5 rounded-lg border text-[10px] font-bold leading-tight ${
                              isBlue ? 'bg-[#EAF3FF] text-[#2583E9] border-[#BEDCFF]' :
                              isSalmon ? 'bg-[#FEECEC] text-[#FA6B6B] border-[#FCD2D2]' :
                              'bg-[#F5FDD6] text-[#19202D] border-[#E4F878]'
                            }`}
                          >
                            <span className="block opacity-75">{ev.time}</span>
                            <span className="truncate block">{ev.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {addModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setAddModalOpen(false)}
          title="Schedule New Appointment"
          subtitle="Add event to the master March 2035 calendar"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#19202D] mb-1">Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. VIP Penthouse Check-in"
                className="w-full p-2.5 rounded-xl border border-[#E7EBF0]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#19202D] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#E7EBF0]"
              >
                <option value="Staff Schedule">Staff Schedule (Blue)</option>
                <option value="Guest Appointment">Guest Appointment (Lime)</option>
                <option value="Maintenance Task">Maintenance Task (Salmon)</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="lime" size="sm">
                Save Schedule
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
