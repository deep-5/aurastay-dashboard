import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Card, Badge, Button, Modal } from '../components/ui';
import {
  BedDouble,
  Search,
  Plus,
  CheckCircle2,
  Users,
  Maximize2,
  Coffee,
  Tv,
  Wifi,
  Sparkles,
  UploadCloud,
  Check,
  CheckSquare
} from 'lucide-react';
import { Room } from '../types';

export const RoomsView: React.FC = () => {
  const { rooms, roomTypes, addRoom } = useHotel();

  const [activeTab, setActiveTab] = useState<'browse' | 'new-room'>('browse');
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Room Form State
  const [newRoomName, setNewRoomName] = useState('Premier Garden Suite');
  const [newRoomAbout, setNewRoomAbout] = useState(
    'The Premier Garden Suite offers a serene escape with elegant interiors, modern amenities, and direct access to the hotel\'s lush garden. Perfect for guests seeking comfort, privacy, and natural surroundings.'
  );
  const [newRoomAdults, setNewRoomAdults] = useState(3);
  const [newRoomChildren, setNewRoomChildren] = useState(2);
  const [newRoomActive, setNewRoomActive] = useState('Active');
  const [newRoomSize, setNewRoomSize] = useState('50');
  const [bedKing, setBedKing] = useState(true);
  const [bedSofa, setBedSofa] = useState(true);
  const [bedTwin, setBedTwin] = useState(false);
  const [bedQueen, setBedQueen] = useState(false);
  const [viewType, setViewType] = useState('City View');
  const [smokingPolicy, setSmokingPolicy] = useState('Non-Smoking');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Curated room items matching the reference photo gallery
  const roomCards = [
    {
      id: 'RC-01',
      title: 'Deluxe Suite',
      price: 280,
      size: '85 m²',
      bed: '1 King Bed',
      guests: '3 guests',
      available: '20 / 25 Rooms Available',
      occupiedPct: 80,
      status: 'Available',
      mainImg: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=300&auto=format&fit=crop&q=80',
      ],
      description: 'The Deluxe Suite offers a premium stay experience, blending luxury and functionality. Guests enjoy spacious interiors, elegant decor, and a private balcony overlooking the city skyline. Ideal for leisure or business travelers seeking extra comfort and privacy.',
      features: [
        'Private Balcony with City View',
        'Soundproof Windows',
        'Smart Room Controls',
        'Espresso Machine & Minibar'
      ]
    },
    {
      id: 'RC-02',
      title: 'Superior Room',
      price: 190,
      size: '55 m²',
      bed: '1 Queen Bed',
      guests: '2 guests',
      available: 'Fully Booked',
      occupiedPct: 100,
      status: 'Fully Booked',
      mainImg: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=300&auto=format&fit=crop&q=80',
      ],
      description: 'Comfortable and stylish room designed for business or leisure travelers seeking quality amenities and serene courtyard garden views.',
      features: [
        'Courtyard Garden View',
        'Workstation with High-speed Wi-Fi',
        'Rainfall Shower',
        'Smart TV with Streaming'
      ]
    },
    {
      id: 'RC-03',
      title: 'Executive Suite',
      price: 320,
      size: '110 m²',
      bed: '1 King Bed + 1 Sofa Bed',
      guests: '4 guests',
      available: '18 / 24 Rooms Available',
      occupiedPct: 75,
      status: 'Available',
      mainImg: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=300&auto=format&fit=crop&q=80',
      ],
      description: 'Spacious and modern suite featuring a lounge area, marble bathroom with soaking tub, and dedicated work desk.',
      features: [
        'Panoramic Ocean View',
        'Soaking Bathtub',
        'Dedicated Workspace',
        'Wine Refrigerator'
      ]
    }
  ];

  const currentRoom = roomCards[selectedRoomIndex] || roomCards[0];

  const handleSaveNewRoom = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`New room "${newRoomName}" created and added to inventory!`);
    setActiveTab('browse');
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#19202D] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom">
          <CheckCircle2 className="w-4 h-4 text-[#D2F829]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* View Switcher Bar */}
      <div className="flex items-center justify-between">
        <div className="flex border border-[#E7EBF0] rounded-xl overflow-hidden bg-[#F8FAFC] p-1">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'browse'
                ? 'bg-white text-[#2583E9] shadow-sm'
                : 'text-[#6B7280] hover:text-[#19202D]'
            }`}
          >
            Room Rack & Categories
          </button>
          <button
            onClick={() => setActiveTab('new-room')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'new-room'
                ? 'bg-white text-[#2583E9] shadow-sm'
                : 'text-[#6B7280] hover:text-[#19202D]'
            }`}
          >
            + Create New Room
          </button>
        </div>

        {activeTab === 'browse' && (
          <Button
            variant="lime"
            size="sm"
            onClick={() => setActiveTab('new-room')}
          >
            + Add Room
          </Button>
        )}
      </div>

      {/* BROWSE TAB: EXACT LAYOUT FROM REFERENCE IMAGE 2 (BOTTOM-LEFT) */}
      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Room Category List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Filter row */}
            <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E7EBF0]">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-[#8C95A6] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search room category..."
                  className="w-full bg-[#F8FAFC] text-xs pl-8 pr-3 py-1.5 rounded-full border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
                />
              </div>

              <div className="flex items-center gap-2">
                <select className="bg-[#F8FAFC] border border-[#E7EBF0] text-xs font-semibold text-[#19202D] px-3 py-1.5 rounded-full focus:outline-none">
                  <option>Sort By: Popular v</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>

                <select className="bg-[#F8FAFC] border border-[#E7EBF0] text-xs font-semibold text-[#19202D] px-3 py-1.5 rounded-full focus:outline-none">
                  <option>All Type v</option>
                  <option>Suites</option>
                  <option>Standard</option>
                </select>
              </div>
            </div>

            {/* Room Category Cards matching reference */}
            <div className="space-y-4">
              {roomCards.map((rc, idx) => {
                const isSelected = selectedRoomIndex === idx;

                return (
                  <div
                    key={rc.id}
                    onClick={() => setSelectedRoomIndex(idx)}
                    className={`bg-white rounded-2xl border p-4 shadow-subtle hover:shadow-card transition-all cursor-pointer flex flex-col sm:flex-row items-center gap-4 ${
                      isSelected ? 'border-[#2583E9] ring-2 ring-[#2583E9]/20' : 'border-[#E7EBF0]'
                    }`}
                  >
                    <img
                      src={rc.mainImg}
                      alt={rc.title}
                      className="w-full sm:w-44 h-32 rounded-xl object-cover border border-[#E7EBF0] flex-shrink-0"
                    />

                    <div className="flex-1 w-full flex flex-col justify-between h-32">
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-extrabold text-[#19202D]">{rc.title}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            rc.status === 'Fully Booked'
                              ? 'bg-[#FEECEC] text-[#FA6B6B]'
                              : 'bg-[#EAF3FF] text-[#2583E9]'
                          }`}>
                            {rc.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6B7280] line-clamp-1 mt-0.5">{rc.description}</p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-[#8C95A6]">
                        <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" /> {rc.size}</span>
                        <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /> {rc.bed}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {rc.guests}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#E7EBF0]">
                        <span className="text-[11px] font-bold text-[#6B7280]">{rc.available}</span>
                        <span className="text-sm font-black text-[#19202D]">${rc.price} <span className="text-[10px] font-normal text-[#6B7280]">/ night</span></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Room Card with 4-thumbnail gallery (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-[#E7EBF0] p-5 shadow-subtle space-y-4 sticky top-20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#19202D]">{currentRoom.title}</h3>
                  <p className="text-xs text-[#6B7280]">{currentRoom.available}</p>
                </div>
                <span className="text-base font-black text-[#2583E9]">${currentRoom.price}/nt</span>
              </div>

              {/* Large Main Photo */}
              <div className="h-48 w-full rounded-xl overflow-hidden border border-[#E7EBF0]">
                <img
                  src={currentRoom.mainImg}
                  alt={currentRoom.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 4-Thumbnail Gallery Matching Reference */}
              <div className="grid grid-cols-4 gap-2">
                {currentRoom.gallery.map((thumb, i) => (
                  <div key={i} className="h-16 rounded-lg overflow-hidden border border-[#E7EBF0] hover:border-[#2583E9] cursor-pointer">
                    <img src={thumb} alt="Gallery" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              {/* Occupancy bar */}
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E7EBF0] space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#19202D]">
                  <span>20 / 25 Rooms</span>
                  <span>{currentRoom.occupiedPct}% Occupied</span>
                </div>
                <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2583E9] rounded-full"
                    style={{ width: `${currentRoom.occupiedPct}%` }}
                  />
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#6B7280] leading-relaxed">
                {currentRoom.description}
              </p>

              {/* Features Grid */}
              <div className="space-y-2 pt-2 border-t border-[#E7EBF0]">
                <h4 className="text-xs font-bold text-[#19202D]">Features</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#19202D]">
                  {currentRoom.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-[#F8FAFC] p-2 rounded-lg border border-[#E7EBF0]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2583E9] flex-shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="lime"
                size="md"
                className="w-full"
                onClick={() => showToast(`Booking flow initialized for ${currentRoom.title}`)}
              >
                Book This Category
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* NEW ROOM FORM TAB: MATCHING IMAGE 2 BOTTOM-RIGHT */}
      {activeTab === 'new-room' && (
        <form onSubmit={handleSaveNewRoom} className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E7EBF0]">
            <div>
              <h2 className="text-base font-extrabold text-[#19202D]">New Room</h2>
              <p className="text-xs text-[#6B7280]">Configure specifications, bedding options, view type, and amenities</p>
            </div>

            <Button type="submit" variant="lime" size="sm">
              Save
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card title="Basic Information">
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#19202D] mb-1">Room Type Name *</label>
                  <input
                    type="text"
                    required
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E7EBF0] bg-[#F8FAFC]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#19202D] mb-1">About Room *</label>
                  <textarea
                    rows={4}
                    required
                    value={newRoomAbout}
                    onChange={(e) => setNewRoomAbout(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E7EBF0] bg-[#F8FAFC] leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#19202D] mb-1">Max Adults</label>
                    <input
                      type="number"
                      min="1"
                      value={newRoomAdults}
                      onChange={(e) => setNewRoomAdults(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-[#E7EBF0] bg-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#19202D] mb-1">Max Children</label>
                    <input
                      type="number"
                      min="0"
                      value={newRoomChildren}
                      onChange={(e) => setNewRoomChildren(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-[#E7EBF0] bg-[#F8FAFC]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#19202D] mb-2">Availability Status</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-[#19202D]">
                      <input
                        type="radio"
                        name="activeStatus"
                        checked={newRoomActive === 'Active'}
                        onChange={() => setNewRoomActive('Active')}
                        className="text-[#2583E9]"
                      />
                      Active
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-[#19202D]">
                      <input
                        type="radio"
                        name="activeStatus"
                        checked={newRoomActive === 'Inactive'}
                        onChange={() => setNewRoomActive('Inactive')}
                        className="text-[#2583E9]"
                      />
                      Inactive
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            {/* Room Configuration */}
            <Card title="Room Configuration">
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#19202D] mb-1">Room Size (m²)</label>
                  <input
                    type="text"
                    value={newRoomSize}
                    onChange={(e) => setNewRoomSize(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E7EBF0] bg-[#F8FAFC]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#19202D] mb-2">Bed Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E7EBF0] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bedKing}
                        onChange={(e) => setBedKing(e.target.checked)}
                        className="text-[#2583E9]"
                      />
                      <span>King Bed (1)</span>
                    </label>

                    <label className="flex items-center gap-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E7EBF0] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bedTwin}
                        onChange={(e) => setBedTwin(e.target.checked)}
                        className="text-[#2583E9]"
                      />
                      <span>Twin Beds</span>
                    </label>

                    <label className="flex items-center gap-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E7EBF0] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bedQueen}
                        onChange={(e) => setBedQueen(e.target.checked)}
                        className="text-[#2583E9]"
                      />
                      <span>Queen Beds</span>
                    </label>

                    <label className="flex items-center gap-2 bg-[#D2F829]/20 border border-[#D2F829] p-2.5 rounded-xl cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={bedSofa}
                        onChange={(e) => setBedSofa(e.target.checked)}
                        className="text-[#19202D]"
                      />
                      <span>Sofa Bed</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#19202D] mb-2">Smoking Policy</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                      <input
                        type="radio"
                        name="smoking"
                        checked={smokingPolicy === 'Non-Smoking'}
                        onChange={() => setSmokingPolicy('Non-Smoking')}
                      />
                      Non-Smoking
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                      <input
                        type="radio"
                        name="smoking"
                        checked={smokingPolicy === 'Smoking'}
                        onChange={() => setSmokingPolicy('Smoking')}
                      />
                      Smoking
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#19202D] mb-2">View Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['City View', 'Sea View', 'Garden View', 'Pool View'].map(v => (
                      <label key={v} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer font-medium ${
                        viewType === v ? 'bg-[#EAF3FF] border-[#2583E9] text-[#2583E9] font-bold' : 'bg-[#F8FAFC] border-[#E7EBF0]'
                      }`}>
                        <input
                          type="radio"
                          name="viewType"
                          checked={viewType === v}
                          onChange={() => setViewType(v)}
                        />
                        {v}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Media Upload Area */}
          <Card title="Media & Photographs" subtitle="Upload high-resolution photography for guest showcase">
            <div className="border-2 border-dashed border-[#E7EBF0] hover:border-[#2583E9] rounded-2xl p-8 text-center transition-colors cursor-pointer bg-[#F8FAFC]">
              <UploadCloud className="w-10 h-10 text-[#2583E9] mx-auto mb-2" />
              <p className="text-xs font-bold text-[#19202D]">Drop hotel suite photographs here or click to browse</p>
              <p className="text-[11px] text-[#8C95A6] mt-1">Supports PNG, JPG, WebP up to 10MB</p>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
};
