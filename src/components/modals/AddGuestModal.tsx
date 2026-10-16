import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Modal, Button } from '../ui';
import { GuestType } from '../../types';
import { User, Phone, Mail, Globe, CheckCircle2 } from 'lucide-react';

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddGuestModal: React.FC<AddGuestModalProps> = ({ isOpen, onClose }) => {
  const { addGuest } = useHotel();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guestType, setGuestType] = useState<GuestType>('Regular');
  const [nationality, setNationality] = useState('United States');
  const [idNumber, setIdNumber] = useState('');
  const [bedPreference, setBedPreference] = useState('King bed preferred');
  const [dietary, setDietary] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addGuest({
      name,
      email,
      phone,
      guestType,
      nationality,
      idNumber,
      totalStays: 0,
      lastVisit: new Date().toISOString().substring(0, 10),
      totalSpending: 0,
      preferences: {
        bedPreference,
        dietary,
        specialRequests,
      },
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Guest Profile"
      subtitle="Register guest contact info, preferences, and personal requirements"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {success && (
          <div className="p-3 bg-[#EBF7F0] border border-[#C6ECD7] text-[#20A66A] text-xs rounded-lg font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Guest profile added successfully!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#202938] mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Eleanor Vance"
              className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202938] mb-1">Guest Classification</label>
            <select
              value={guestType}
              onChange={(e) => setGuestType(e.target.value as GuestType)}
              className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
            >
              <option value="Regular">Regular Guest</option>
              <option value="VIP">VIP Guest</option>
              <option value="Corporate">Corporate Traveler</option>
              <option value="First-time">First-time Guest</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#202938] mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="guest@domain.com"
              className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202938] mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 234-5678"
              className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#202938] mb-1">Nationality</label>
            <input
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              placeholder="e.g. United States"
              className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202938] mb-1">ID / Passport Number</label>
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="e.g. US-PASS-992104"
              className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-[#E7EBF0]">
          <span className="text-xs font-bold text-[#202938] block mb-2">Guest Preferences & Special Notes</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">Bed Preference</label>
              <input
                type="text"
                value={bedPreference}
                onChange={(e) => setBedPreference(e.target.value)}
                placeholder="King bed, hypoallergenic pillows"
                className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">Dietary Requirements</label>
              <input
                type="text"
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                placeholder="Vegan, Gluten-free, Oat milk"
                className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">Special Handling Instructions</label>
            <textarea
              rows={2}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="High floor room preference, quiet location, honeymoon welcome amenity..."
              className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Guest Profile
          </Button>
        </div>
      </form>
    </Modal>
  );
};
