import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Card, Badge, Button, Modal } from '../components/ui';
import {
  Package,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const InventoryView: React.FC = () => {
  const { inventory, stockInInventory } = useHotel();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [timeFilter, setTimeFilter] = useState<'Week' | 'Month' | 'Year'>('Year');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Dual wavy area chart matching Image 3 "Supply Overview"
  const supplyOverviewData = [
    { month: 'Jan', total: 65, used: 38 },
    { month: 'Feb', total: 72, used: 42 },
    { month: 'Mar', total: 68, used: 39 },
    { month: 'Apr', total: 80, used: 48 },
    { month: 'May', total: 88, used: 55 },
    { month: 'Jun', total: 95, used: 64 },
    { month: 'Jul', total: 90, used: 60 },
    { month: 'Aug', total: 85, used: 52 },
    { month: 'Sept', total: 78, used: 46 },
    { month: 'Oct', total: 82, used: 50 },
    { month: 'Nov', total: 75, used: 44 },
    { month: 'Dec', total: 84, used: 49 },
  ];

  // Curated inventory items with real product images from Image 3
  const inventoryItemsWithImages = [
    {
      id: 'ITM-01',
      name: 'Bath Towels',
      category: 'Housekeeping Supplies',
      image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=120&auto=format&fit=crop&q=80',
      status: 'High',
      quantity: 240,
      unit: 'pcs',
      percentage: 100,
      reorderQty: 0,
    },
    {
      id: 'ITM-02',
      name: 'Shampoo Bottles',
      category: 'Bathroom & Toiletries',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120&auto=format&fit=crop&q=80',
      status: 'Low',
      quantity: 45,
      unit: 'pcs',
      percentage: 45,
      reorderQty: 100,
    },
    {
      id: 'ITM-03',
      name: 'Conditioner Bottles',
      category: 'Bathroom & Toiletries',
      image: 'https://images.unsplash.com/photo-1608248597359-5f28f23fcf93?w=120&auto=format&fit=crop&q=80',
      status: 'Low',
      quantity: 50,
      unit: 'pcs',
      percentage: 50,
      reorderQty: 80,
    },
    {
      id: 'ITM-04',
      name: 'Bedsheets',
      category: 'Housekeeping Supplies',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=120&auto=format&fit=crop&q=80',
      status: 'High',
      quantity: 180,
      unit: 'pcs',
      percentage: 85,
      reorderQty: 0,
    },
    {
      id: 'ITM-05',
      name: 'Slippers',
      category: 'Room Amenities',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=120&auto=format&fit=crop&q=80',
      status: 'Out of Stock',
      quantity: 0,
      unit: 'pcs',
      percentage: 0,
      reorderQty: 200,
    },
    {
      id: 'ITM-06',
      name: 'Coffee Capsules',
      category: 'Food & Beverage',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=120&auto=format&fit=crop&q=80',
      status: 'High',
      quantity: 120,
      unit: 'pcs',
      percentage: 80,
      reorderQty: 50,
    },
    {
      id: 'ITM-07',
      name: 'Light Bulbs',
      category: 'Office & Stationery',
      image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=120&auto=format&fit=crop&q=80',
      status: 'Low',
      quantity: 30,
      unit: 'pcs',
      percentage: 30,
      reorderQty: 70,
    },
  ];

  const handleReorder = (item: typeof inventoryItemsWithImages[0]) => {
    showToast(`Purchase order dispatched: +${item.reorderQty || 50} units of ${item.name}`);
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

      {/* TOP 2 CHARTS FROM REFERENCE IMAGE 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Supply Overview (6 cols) */}
        <Card
          className="lg:col-span-6"
          title="Supply Overview"
          headerAction={
            <div className="flex border border-[#E7EBF0] rounded-xl overflow-hidden bg-[#F8FAFC] p-0.5">
              {(['Week', 'Month', 'Year'] as const).map(pill => (
                <button
                  key={pill}
                  onClick={() => setTimeFilter(pill)}
                  className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${
                    timeFilter === pill
                      ? 'bg-[#D2F829] text-[#19202D] shadow-sm'
                      : 'text-[#6B7280] hover:text-[#19202D]'
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>
          }
        >
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={supplyOverviewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="limeSupplyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D2F829" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D2F829" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="blueSupplyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2583E9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2583E9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7EBF0" />
                <XAxis dataKey="month" stroke="#8C95A6" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#8C95A6" fontSize={11} tickLine={false} axisLine={false} domain={[0, 120]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-xl border border-[#E7EBF0] shadow-md text-xs space-y-1">
                          <p className="font-bold text-[#19202D]">{payload[0]?.payload.month}</p>
                          <p className="font-extrabold text-[#19202D] flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D2F829]" />
                            {payload[0]?.value} Rooms Total Supplies
                          </p>
                          <p className="font-bold text-[#2583E9] flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#2583E9]" />
                            {payload[1]?.value} Rooms Used Supplies
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="natural" dataKey="total" stroke="#C2E820" strokeWidth={3} fillOpacity={1} fill="url(#limeSupplyGrad)" />
                <Area type="natural" dataKey="used" stroke="#2583E9" strokeWidth={2.5} fillOpacity={1} fill="url(#blueSupplyGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right: Stock Category Segmented Bar Matching Image 3 */}
        <Card className="lg:col-span-6" title="Stock Category">
          <div className="space-y-4 pt-1">
            {/* Multi-segmented horizontal progress bar matching screenshot */}
            <div className="h-10 w-full rounded-xl overflow-hidden flex shadow-inner">
              <div style={{ width: '34%' }} className="bg-[#2583E9] h-full" title="Housekeeping Supplies" />
              <div style={{ width: '28%' }} className="bg-[#93C5FD] h-full" title="Bathroom & Toiletries" />
              <div style={{ width: '18%' }} className="bg-[#E2E8F0] h-full" title="Room Amenities" />
              <div style={{ width: '15%' }} className="bg-[#FEF9E7] h-full" title="Food & Beverage" />
              <div style={{ width: '13%' }} className="bg-[#D2F829] h-full" title="Maintenance Equipment" />
            </div>

            {/* Category breakdown table */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs pt-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#6B7280]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2583E9]" /> Housekeeping Supplies
                </span>
                <span className="font-bold text-[#19202D]">34% (36 Items)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#6B7280]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#93C5FD]" /> Food & Beverage
                </span>
                <span className="font-bold text-[#19202D]">15% (22 Items)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#6B7280]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#93C5FD]" /> Bathroom & Toiletries
                </span>
                <span className="font-bold text-[#19202D]">28% (30 Items)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#6B7280]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E2E8F0]" /> Maintenance Equipment
                </span>
                <span className="font-bold text-[#19202D]">13% (20 Items)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#6B7280]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FEF9E7]" /> Room Amenities
                </span>
                <span className="font-bold text-[#19202D]">18% (27 Items)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#6B7280]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D2F829]" /> Office & Stationery
                </span>
                <span className="font-bold text-[#19202D]">10% (15 Items)</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* MAIN INVENTORY TABLE WITH REAL PRODUCT IMAGES FROM IMAGE 3 */}
      <Card noPadding>
        <div className="p-4 border-b border-[#E7EBF0] flex items-center justify-between gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="w-3.5 h-3.5 text-[#8C95A6] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guest, status, etc"
              className="w-full bg-[#F8FAFC] text-xs pl-9 pr-4 py-1.5 rounded-full border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#F8FAFC] border border-[#E7EBF0] text-xs font-semibold text-[#19202D] px-3 py-1.5 rounded-full focus:outline-none"
          >
            <option value="All">All Status v</option>
            <option value="High">High</option>
            <option value="Low">Low</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E7EBF0] text-[#6B7280]">
              <tr>
                <th className="py-3 px-3 w-8">
                  <input type="checkbox" className="rounded text-[#2583E9]" />
                </th>
                <th className="py-3 px-3 font-semibold">Image</th>
                <th className="py-3 px-3 font-semibold">Item</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold">Quantity in Stock</th>
                <th className="py-3 px-3 font-semibold">Quantity in Reorder</th>
                <th className="py-3 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7EBF0]">
              {inventoryItemsWithImages.map(item => (
                <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3">
                    <input type="checkbox" className="rounded text-[#2583E9]" />
                  </td>
                  <td className="py-3 px-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#E7EBF0]"
                    />
                  </td>
                  <td className="py-3 px-3 font-bold text-[#19202D]">{item.name}</td>
                  <td className="py-3 px-3 text-[#6B7280]">{item.category}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      item.status === 'High' ? 'bg-[#D2F829] text-[#19202D]' :
                      item.status === 'Low' ? 'bg-[#EAF3FF] text-[#2583E9]' :
                      'bg-[#FEECEC] text-[#FA6B6B]'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-[#19202D]">
                        <span>{item.quantity} {item.unit}</span>
                        <span className="text-[#8C95A6] font-normal">{item.percentage}%</span>
                      </div>
                      <div className="w-28 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#2583E9] rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-bold text-[#19202D]">{item.reorderQty}</td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleReorder(item)}
                    >
                      Reorder
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
