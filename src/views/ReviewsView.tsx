import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Card, Badge, Button, Modal } from '../components/ui';
import {
  Star,
  Search,
  CheckCircle2,
  CornerUpLeft,
  ArrowUpRight,
  BedDouble
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

export const ReviewsView: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'This Week' | 'This Month' | 'This Year'>('This Month');

  // 4-Week bar chart alternating lime-yellow and blue matching reference
  const reviewStatsData = [
    { week: 'Week 1', rate: 48, fill: '#D2F829' },
    { week: 'Week 2', rate: 75, fill: '#2583E9' },
    { week: 'Week 3', rate: 88, fill: '#D2F829' },
    { week: 'Week 4', rate: 78, fill: '#2583E9' },
  ];

  const ratingDonut = [
    { name: 'Positive', value: 85, color: '#2583E9' },
    { name: 'Neutral', value: 15, color: '#D2F829' },
  ];

  const topRatedRooms = [
    {
      title: 'Deluxe Suite',
      price: '$280/night',
      rating: '4.7',
      occupancy: 'Occupancy Rate 92%',
      img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=160&auto=format&fit=crop&q=80',
    },
    {
      title: 'Executive Suite',
      price: '$320/night',
      rating: '4.8',
      occupancy: 'Occupancy Rate 88%',
      img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=160&auto=format&fit=crop&q=80',
    },
    {
      title: 'Premium Deluxe',
      price: '$250/night',
      rating: '4.6',
      occupancy: 'Occupancy Rate 85%',
      img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=160&auto=format&fit=crop&q=80',
    },
  ];

  const guestReviews = [
    {
      id: '1',
      name: 'Emily Carter',
      date: 'Mar 12 - Mar 15, 2035',
      room: 'Executive Suite',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      rating: 5.0,
      comment: 'Absolutely loved my stay! The staff were so attentive and courteous, and the room had an incredible view. Highly recommend for anyone seeking a peaceful retreat.',
    },
    {
      id: '2',
      name: 'Daniel Wong',
      date: 'Mar 13 - Mar 16, 2035',
      room: 'Superior Room',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 4.8,
      comment: 'Great value for money. The room was clean, though the lighting could be softer. Staff were very accommodating and quick to respond to requests.',
    },
    {
      id: '3',
      name: 'Hannah Lee',
      date: 'Mar 10 - Mar 14, 2035',
      room: 'Premium Deluxe',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 5.0,
      comment: 'The atmosphere was serene and elegant, I loved the modern design and plush beds. The breakfast was delicious and well presented!',
    },
    {
      id: '4',
      name: 'Liam Johnson',
      date: 'Mar 11 - Mar 15, 2035',
      room: 'Standard Room',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      rating: 4.5,
      comment: 'Comfortable bed and tidy for a short stay. Few minor amenities, but the staff made up for it with their great service.',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* 1. TOP SECTION: 3 CARDS MATCHING REFERENCE IMAGE 5 BOTTOM-LEFT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1: Review Statistics (4 cols) */}
        <Card
          className="lg:col-span-4"
          title="Review Statistics"
          headerAction={
            <div className="flex border border-[#E7EBF0] rounded-xl overflow-hidden bg-[#F8FAFC] p-0.5">
              {(['This Week', 'This Month', 'This Year'] as const).map(pill => (
                <button
                  key={pill}
                  onClick={() => setTimeFilter(pill)}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition-all ${
                    timeFilter === pill
                      ? 'bg-[#D2F829] text-[#19202D] shadow-sm'
                      : 'text-[#6B7280]'
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#8C95A6] block">Total Reviews</span>
                <span className="text-xl font-black text-[#19202D]">1,248 Reviews</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#8C95A6] block">Average Rating</span>
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="text-xl font-black text-[#19202D]">68.25%</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#D2F829] text-[#19202D] text-[10px] font-extrabold">
                    +2.8%
                  </span>
                </div>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reviewStatsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7EBF0" />
                  <XAxis dataKey="week" stroke="#8C95A6" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8C95A6" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Bar dataKey="rate" radius={[4, 4, 0, 0]} maxBarSize={32}>
                    {reviewStatsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Card 2: Ratings Donut Chart (4 cols) */}
        <Card className="lg:col-span-4" title="Ratings">
          <div className="space-y-4">
            <div className="flex items-center justify-center relative my-1">
              <div className="w-28 h-28 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ratingDonut}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={52}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {ratingDonut.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-[10px] text-[#8C95A6] font-semibold">Excellent</span>
                  <span className="text-base font-black text-[#19202D]">4.7<span className="text-xs font-normal text-[#8C95A6]">/5.0</span></span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280]">Location</span>
                <span className="font-bold text-[#19202D]">4.7 ★★★★★</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280]">Value for Money</span>
                <span className="font-bold text-[#19202D]">4.8 ★★★★★</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280]">Amenities</span>
                <span className="font-bold text-[#19202D]">4.5 ★★★★☆</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280]">Service / Staff</span>
                <span className="font-bold text-[#19202D]">4.9 ★★★★★</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280]">Cleanliness</span>
                <span className="font-bold text-[#19202D]">4.8 ★★★★★</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 3: Top-Rated Room Type (4 cols) */}
        <Card className="lg:col-span-4" title="Top-Rated Room Type">
          <div className="space-y-3">
            {topRatedRooms.map((room, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 bg-[#F8FAFC] rounded-xl border border-[#E7EBF0]">
                <img src={room.img} alt={room.title} className="w-14 h-12 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h5 className="text-xs font-bold text-[#19202D] truncate">{room.title}</h5>
                    <span className="text-xs font-black text-[#2583E9]">{room.price}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#6B7280]">
                    <span className="font-bold text-[#19202D] flex items-center gap-0.5 text-[#F4C928]">
                      ★ <span className="text-[#19202D]">{room.rating}</span>
                    </span>
                    <span>• {room.occupancy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 2. BOTTOM SECTION: REVIEWS CARDS MATCHING REFERENCE IMAGE 5 */}
      <Card noPadding title="Reviews" subtitle="Direct guest experiences and verified hospitality testimonials">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
          {guestReviews.map(r => (
            <div key={r.id} className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E7EBF0] space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <img src={r.avatar} alt={r.name} className="w-9 h-9 rounded-full object-cover border border-[#E7EBF0]" />
                  <div>
                    <h5 className="text-xs font-bold text-[#19202D]">{r.name}</h5>
                    <div className="flex items-center text-[#F4C928] text-xs">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-[#8C95A6] mb-1">
                  <span>{r.room}</span> • <span>{r.date}</span>
                </div>

                <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-4">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-2 border-t border-[#E7EBF0]">
                <button className="text-[11px] font-bold text-[#2583E9] hover:underline">
                  Respond to Guest
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
