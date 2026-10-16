import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Modal, Button } from '../ui';
import { BookingSource, PaymentStatus } from '../../types';
import { Calendar, User, BedDouble, DollarSign, CheckCircle2 } from 'lucide-react';

interface NewReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedRoomId?: string;
}

export const NewReservationModal: React.FC<NewReservationModalProps> = ({
  isOpen,
  onClose,
  preselectedRoomId,
}) => {
  const { rooms, roomTypes, createReservation, settings, guests } = useHotel();

  const todayStr = new Date().toISOString().substring(0, 10);
  const tomorrowStr = new Date(Date.now() + 86400000 * 2).toISOString().substring(0, 10);

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(tomorrowStr);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomTypeId, setRoomTypeId] = useState(roomTypes[0]?.id || '');
  const [roomId, setRoomId] = useState(preselectedRoomId || '');
  const [bookingSource, setBookingSource] = useState<BookingSource>('Direct');
  const [ratePlan, setRatePlan] = useState('Standard Flexible');
  const [specialRequests, setSpecialRequests] = useState('');
  const [discount, setDiscount] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Pending');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-fill guest contact if known guest selected
  const handleGuestSelect = (name: string) => {
    setGuestName(name);
    const existing = guests.find(g => g.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      setGuestEmail(existing.email);
      setGuestPhone(existing.phone);
    }
  };

  // Filter available rooms matching type and not out-of-service / maintenance
  const eligibleRooms = rooms.filter(r => {
    if (roomTypeId && r.typeId !== roomTypeId) return false;
    if (r.status === 'Out of Service' || r.status === 'Maintenance') return false;
    return true;
  });

  const selectedRoom = rooms.find(r => r.id === (roomId || eligibleRooms[0]?.id));
  const nightlyRate = selectedRoom?.nightlyRate || 200;

  // Calculate nights & pricing
  const nights = Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)));
  const subtotal = nightlyRate * nights;
  const taxes = Number((subtotal * (settings.taxRatePercent / 100)).toFixed(2));
  const total = Math.max(0, subtotal + taxes - discount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const targetRoomId = roomId || eligibleRooms[0]?.id;
    if (!targetRoomId) {
      setErrorMsg('No eligible room available for this room type. Please select another room type.');
      return;
    }

    const res = createReservation({
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      adults,
      children,
      roomTypeId,
      roomId: targetRoomId,
      bookingSource,
      ratePlan,
      nightlyRate,
      totalNights: nights,
      subtotal,
      taxes,
      discount,
      totalAmount: total,
      depositAmount: Number(depositAmount),
      paymentStatus: depositAmount >= total ? 'Paid' : depositAmount > 0 ? 'Partial' : paymentStatus,
      specialRequests,
    });

    if (!res.success) {
      setErrorMsg(res.message || 'Failed to create reservation.');
    } else {
      setSuccessMsg('Reservation created successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Reservation"
      subtitle="Complete booking details, verify stay dates and check room availability"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-[#FDF2F2] border border-[#F9CFD2] text-[#E85B63] text-xs rounded-lg font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-[#EBF7F0] border border-[#C6ECD7] text-[#20A66A] text-xs rounded-lg font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {successMsg}
          </div>
        )}

        {/* Guest Information */}
        <div className="p-4 bg-[#F8FAFC] border border-[#E7EBF0] rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#202938]">
            <User className="w-4 h-4 text-[#2583E9]" /> Guest Details
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#202938] mb-1">Guest Full Name *</label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => handleGuestSelect(e.target.value)}
                placeholder="e.g. Lady Genevieve Vance"
                className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9] bg-white"
                list="known-guests"
              />
              <datalist id="known-guests">
                {guests.map(g => (
                  <option key={g.id} value={g.name}>{g.name} ({g.guestType})</option>
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202938] mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="guest@example.com"
                className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9] bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202938] mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="+1 (555) 012-3456"
                className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9] bg-white"
              />
            </div>
          </div>
        </div>

        {/* Stay Dates & Occupants */}
        <div className="p-4 bg-[#F8FAFC] border border-[#E7EBF0] rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#202938]">
            <Calendar className="w-4 h-4 text-[#2583E9]" /> Stay Dates & Party Size
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#202938] mb-1">Check-in Date *</label>
              <input
                type="date"
                required
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9] bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202938] mb-1">Check-out Date *</label>
              <input
                type="date"
                required
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9] bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202938] mb-1">Adults</label>
              <input
                type="number"
                min="1"
                max="8"
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9] bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202938] mb-1">Children</label>
              <input
                type="number"
                min="0"
                max="6"
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9] bg-white"
              />
            </div>
          </div>
        </div>

        {/* Room & Rate Selection */}
        <div className="p-4 bg-[#F8FAFC] border border-[#E7EBF0] rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#202938]">
            <BedDouble className="w-4 h-4 text-[#2583E9]" /> Room & Rate Plan
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#202938] mb-1">Room Type *</label>
              <select
                value={roomTypeId}
                onChange={(e) => {
                  setRoomTypeId(e.target.value);
                  setRoomId('');
                }}
                className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9] bg-white"
              >
                {roomTypes.map(rt => (
                  <option key={rt.id} value={rt.id}>
                    {rt.name} (${rt.baseRate}/nt)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202938] mb-1">Assign Room *</label>
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9] bg-white"
              >
                <option value="">-- Auto-Assign Available Room --</option>
                {eligibleRooms.map(rm => (
                  <option key={rm.id} value={rm.id}>
                    Room {rm.number} (Floor {rm.floor} - {rm.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202938] mb-1">Booking Channel</label>
              <select
                value={bookingSource}
                onChange={(e) => setBookingSource(e.target.value as BookingSource)}
                className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9] bg-white"
              >
                <option value="Direct">Direct Website / Front Desk</option>
                <option value="Booking.com">Booking.com</option>
                <option value="Expedia">Expedia Group</option>
                <option value="Airbnb">Airbnb Luxe</option>
                <option value="Corporate">Corporate Negotiated</option>
                <option value="Walk-in">Walk-in</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-[#202938] mb-1">Rate Plan</label>
              <select
                value={ratePlan}
                onChange={(e) => setRatePlan(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9] bg-white"
              >
                <option value="Standard Flexible">Standard Flexible (Free cancellation up to 48h)</option>
                <option value="Bed & Breakfast">Bed & Breakfast Included</option>
                <option value="Non-Refundable Promo">Non-Refundable Promo (-10%)</option>
                <option value="Corporate VIP">Corporate VIP All-Inclusive</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202938] mb-1">Special Guest Requests</label>
              <input
                type="text"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="High floor, quiet corner, extra towels, early arrival..."
                className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9] bg-white"
              />
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="p-4 bg-white border border-[#E7EBF0] rounded-lg">
          <div className="flex items-center gap-2 text-xs font-bold text-[#202938] mb-3">
            <DollarSign className="w-4 h-4 text-[#20A66A]" /> Payment & Pricing Breakdown
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-3">
            <div>
              <span className="text-[#6B7280] block">Duration</span>
              <span className="font-bold text-[#202938]">{nights} Night(s)</span>
            </div>
            <div>
              <span className="text-[#6B7280] block">Nightly Rate</span>
              <span className="font-bold text-[#202938]">${nightlyRate}</span>
            </div>
            <div>
              <span className="text-[#6B7280] block">Subtotal</span>
              <span className="font-bold text-[#202938]">${subtotal.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[#6B7280] block">Taxes ({settings.taxRatePercent}%)</span>
              <span className="font-bold text-[#202938]">${taxes.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E7EBF0]">
            <div>
              <label className="block text-xs font-semibold text-[#202938] mb-1">Discount ($)</label>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9] bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202938] mb-1">Deposit Paid Now ($)</label>
              <input
                type="number"
                min="0"
                max={total}
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9] bg-white"
              />
            </div>
            <div className="flex flex-col justify-end">
              <span className="text-xs text-[#6B7280]">Total Reservation Folio</span>
              <span className="text-lg font-extrabold text-[#2583E9]">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Confirm Reservation
          </Button>
        </div>
      </form>
    </Modal>
  );
};
