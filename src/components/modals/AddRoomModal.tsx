import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Modal, Button } from '../ui';
import { RoomStatus } from '../../types';
import { CheckCircle2 } from 'lucide-react';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddRoomModal: React.FC<AddRoomModalProps> = ({ isOpen, onClose }) => {
  const { roomTypes, addRoom } = useHotel();

  const [number, setNumber] = useState('');
  const [typeId, setTypeId] = useState(roomTypes[0]?.id || '');
  const [floor, setFloor] = useState(1);
  const [status, setStatus] = useState<RoomStatus>('Available');
  const [amenitiesInput, setAmenitiesInput] = useState('Ocean View, Balcony, Minibar, Smart TV');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  const selectedType = roomTypes.find(t => t.id === typeId) || roomTypes[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number) return;

    addRoom({
      number,
      typeId: selectedType.id,
      typeName: selectedType.name,
      floor: Number(floor),
      capacity: selectedType.capacity,
      bedType: selectedType.bedType,
      nightlyRate: selectedType.baseRate,
      amenities: amenitiesInput.split(',').map(s => s.trim()).filter(Boolean),
      status,
      housekeepingStatus: status === 'Dirty' ? 'Dirty' : status === 'Cleaning' ? 'In Progress' : 'Clean',
      maintenanceStatus: status === 'Maintenance' ? 'Pending' : 'None',
      notes,
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
      title="Add New Room"
      subtitle="Configure room number, floor assignment, type, and baseline amenities"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {success && (
          <div className="p-3 bg-[#EBF7F0] border border-[#C6ECD7] text-[#20A66A] text-xs rounded-lg font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Room {number} added successfully!
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#202938] mb-1">Room Number *</label>
            <input
              type="text"
              required
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="e.g. 204"
              className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202938] mb-1">Floor Level</label>
            <input
              type="number"
              min="1"
              max="20"
              value={floor}
              onChange={(e) => setFloor(Number(e.target.value))}
              className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#202938] mb-1">Room Type</label>
          <select
            value={typeId}
            onChange={(e) => setTypeId(e.target.value)}
            className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
          >
            {roomTypes.map(rt => (
              <option key={rt.id} value={rt.id}>
                {rt.name} (${rt.baseRate}/night - {rt.bedType})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#202938] mb-1">Initial Room Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as RoomStatus)}
            className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
          >
            <option value="Available">Available (Clean & Ready)</option>
            <option value="Dirty">Dirty (Needs turnover)</option>
            <option value="Cleaning">Cleaning in progress</option>
            <option value="Inspected">Inspected (Awaiting signoff)</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Out of Service">Out of Service</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#202938] mb-1">Room Amenities (comma-separated)</label>
          <input
            type="text"
            value={amenitiesInput}
            onChange={(e) => setAmenitiesInput(e.target.value)}
            placeholder="Balcony, Mini Bar, Ocean View, Smart TV"
            className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#202938] mb-1">Staff Notes / Description</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Corner suite facing east ocean horizon..."
            className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Room
          </Button>
        </div>
      </form>
    </Modal>
  );
};
