import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Card, Badge, Button, Modal } from '../components/ui';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Building2,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
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
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const FinanceView: React.FC = () => {
  const [trackerMode, setTrackerMode] = useState<'Income' | 'Expenses'>('Expenses');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Cashflow dual-direction bars matching Image 4
  const cashflowData = [
    { month: 'Jan', income: 14200, expense: -9800 },
    { month: 'Feb', income: 16800, expense: -11200 },
    { month: 'Mar', income: 19400, expense: -12500 },
    { month: 'Apr', income: 18200, expense: -13000 },
    { month: 'May', income: 22000, expense: -14500 },
    { month: 'Jun', income: 24500, expense: -16200 },
    { month: 'Jul', income: 21500, expense: -15600 },
    { month: 'Aug', income: 26000, expense: -17000 },
    { month: 'Sep', income: 20500, expense: -14200 },
    { month: 'Oct', income: 23800, expense: -15900 },
    { month: 'Nov', income: 19000, expense: -12800 },
    { month: 'Dec', income: 25400, expense: -16800 },
  ];

  // Money tracker donut
  const moneyTrackerDonut = [
    { name: 'Housekeeping Supplies', value: 28, color: '#2583E9' },
    { name: 'Utilities', value: 22, color: '#D2F829' },
    { name: 'F&B Procurement', value: 18, color: '#93C5FD' },
    { name: 'Maintenance & Repairs', value: 16, color: '#38BDF8' },
    { name: 'Staff Salaries', value: 16, color: '#FCD34D' },
  ];

  const recentTransactions = [
    {
      id: 'TXN-01',
      dateTime: 'Mar 14, 2035 09:20 AM',
      name: 'Online Booking Payment',
      category: 'Room Revenue',
      amount: '+$1,280',
      isIncome: true,
      note: '3-night stay, Deluxe Suite',
      status: 'Success',
    },
    {
      id: 'TXN-02',
      dateTime: 'Mar 14, 2035 08:30 AM',
      name: 'Utility Bill',
      category: 'Electricity',
      amount: '-$1,050',
      isIncome: false,
      note: 'March power payment',
      status: 'Pending',
    },
    {
      id: 'TXN-03',
      dateTime: 'Mar 13, 2035 09:20 AM',
      name: 'Restaurant Supplies',
      category: 'F&B',
      amount: '-$720',
      isIncome: false,
      note: 'Beverage restock',
      status: 'Success',
    },
    {
      id: 'TXN-04',
      dateTime: 'Mar 13, 2035 09:20 AM',
      name: 'Corporate Event Booking',
      category: 'Venue Revenue',
      amount: '+$2,540',
      isIncome: true,
      note: 'TechVision Ltd. group booking',
      status: 'Success',
    },
    {
      id: 'TXN-05',
      dateTime: 'Mar 12, 2035 09:20 AM',
      name: 'Maintenance Tools',
      category: 'Repairs',
      amount: '-$480',
      isIncome: false,
      note: 'Tool set replacement',
      status: 'Pending',
    },
    {
      id: 'TXN-06',
      dateTime: 'Mar 12, 2035 09:20 AM',
      name: 'Guest Refund',
      category: 'Reimbursement',
      amount: '-$220',
      isIncome: false,
      note: 'Early checkout refund',
      status: 'Success',
    },
    {
      id: 'TXN-07',
      dateTime: 'Mar 12, 2035 09:20 AM',
      name: 'Walk-In Reservation',
      category: 'Room Revenue',
      amount: '+$640',
      isIncome: true,
      note: '2-night Superior Room',
      status: 'Success',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* 1. TOP 3 STAT CARDS MATCHING REFERENCE IMAGE 4 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance */}
        <div className="bg-white rounded-2xl border border-[#E7EBF0] p-6 shadow-subtle flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6B7280]">Balance</span>
              <h3 className="text-3xl font-black text-[#19202D] mt-1">$82,450</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#2583E9] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D2F829] text-[#19202D] text-[10px] font-extrabold">
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              <span>+6.4% from last month</span>
            </span>
          </div>
        </div>

        {/* Total Income */}
        <div className="bg-white rounded-2xl border border-[#E7EBF0] p-6 shadow-subtle flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6B7280]">Total Income</span>
              <h3 className="text-3xl font-black text-[#19202D] mt-1">$145,200</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#2583E9] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D2F829] text-[#19202D] text-[10px] font-extrabold">
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              <span>+10.8% from last month</span>
            </span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-2xl border border-[#E7EBF0] p-6 shadow-subtle flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6B7280]">Total Expenses</span>
              <h3 className="text-3xl font-black text-[#19202D] mt-1">$62,750</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#2583E9] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D2F829] text-[#19202D] text-[10px] font-extrabold">
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              <span>+8.2% from last month</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. DUAL ANALYTICS: CASHFLOW & MONEY TRACKER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cashflow Chart (8 cols) */}
        <Card
          className="lg:col-span-8"
          title="Cashflow"
          headerAction={
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D2F829]" />
                <span className="text-[#6B7280]">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2583E9]" />
                <span className="text-[#6B7280]">Expense</span>
              </div>
              <select className="bg-[#F8FAFC] border border-[#E7EBF0] text-xs font-semibold px-2.5 py-1 rounded-lg">
                <option>2035 v</option>
              </select>
            </div>
          }
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowData} stackOffset="sign" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7EBF0" />
                <XAxis dataKey="month" stroke="#8C95A6" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#8C95A6" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${Math.abs(v) / 1000}k`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2.5 rounded-xl border border-[#E7EBF0] shadow-md text-xs">
                          <p className="font-bold text-[#19202D] mb-1">{payload[0]?.payload.month} 2035</p>
                          <p className="text-[#19202D] font-extrabold">Income: ${payload[0]?.value?.toLocaleString()}</p>
                          <p className="text-[#2583E9] font-bold">Expense: ${Math.abs(Number(payload[1]?.value)).toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="income" fill="#D2F829" radius={[4, 4, 0, 0]} maxBarSize={18} />
                <Bar dataKey="expense" fill="#2583E9" radius={[0, 0, 4, 4]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Money Tracker Donut (4 cols) */}
        <Card
          className="lg:col-span-4"
          title="Money Tracker"
          headerAction={
            <div className="flex border border-[#E7EBF0] rounded-xl overflow-hidden bg-[#F8FAFC] p-0.5">
              <button
                onClick={() => setTrackerMode('Income')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  trackerMode === 'Income' ? 'bg-[#D2F829] text-[#19202D] shadow-sm' : 'text-[#6B7280]'
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setTrackerMode('Expenses')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  trackerMode === 'Expenses' ? 'bg-[#D2F829] text-[#19202D] shadow-sm' : 'text-[#6B7280]'
                }`}
              >
                Expenses
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-center relative my-2">
              <div className="w-32 h-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moneyTrackerDonut}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={58}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {moneyTrackerDonut.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Hotel className="w-5 h-5 text-[#2583E9]" />
                </div>
              </div>
            </div>

            <div className="text-center">
              <span className="text-xs text-[#8C95A6]">Total Expense</span>
              <h4 className="text-2xl font-black text-[#19202D] mt-0.5">$62,750</h4>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#D2F829] text-[#19202D] text-[10px] font-extrabold">
                +8.2% from last month
              </span>
            </div>

            <div className="space-y-2 text-xs pt-2 border-t border-[#E7EBF0]">
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5 text-[#6B7280]">
                  <span className="w-2 h-2 rounded-full bg-[#2583E9]" /> Housekeeping Supplies
                </span>
                <span className="font-bold text-[#19202D]">$17,570 (28%)</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5 text-[#6B7280]">
                  <span className="w-2 h-2 rounded-full bg-[#D2F829]" /> Utilities (Water, Power)
                </span>
                <span className="font-bold text-[#19202D]">$13,800 (22%)</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5 text-[#6B7280]">
                  <span className="w-2 h-2 rounded-full bg-[#93C5FD]" /> F&B Procurement
                </span>
                <span className="font-bold text-[#19202D]">$11,300 (18%)</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5 text-[#6B7280]">
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8]" /> Maintenance & Repairs
                </span>
                <span className="font-bold text-[#19202D]">$10,040 (16%)</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. RECENT TRANSACTIONS TABLE MATCHING REFERENCE IMAGE 4 */}
      <Card noPadding title="Recent Transactions" subtitle="Verified financial transaction ledger">
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

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E7EBF0] text-xs font-semibold text-[#19202D] px-3 py-1.5 rounded-full focus:outline-none"
            >
              <option value="All">All Status v</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
            </select>

            <button className="px-3.5 py-1.5 rounded-full bg-[#D2F829] text-[#19202D] text-xs font-bold transition-all shadow-sm">
              This Month v
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E7EBF0] text-[#6B7280]">
              <tr>
                <th className="py-3 px-3 font-semibold">Date & Time</th>
                <th className="py-3 px-3 font-semibold">Transaction Name</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold">Amount</th>
                <th className="py-3 px-3 font-semibold">Note</th>
                <th className="py-3 px-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7EBF0]">
              {recentTransactions.map(txn => (
                <tr key={txn.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3 text-[#6B7280] font-medium">{txn.dateTime}</td>
                  <td className="py-3 px-3 font-bold text-[#19202D]">{txn.name}</td>
                  <td className="py-3 px-3 text-[#6B7280]">{txn.category}</td>
                  <td className="py-3 px-3 font-black text-sm">
                    <span className={txn.isIncome ? 'text-[#2583E9]' : 'text-[#FA6B6B]'}>
                      {txn.amount}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#6B7280]">{txn.note}</td>
                  <td className="py-3 px-3 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      txn.status === 'Success'
                        ? 'bg-[#EBF7F0] text-[#20A66A]'
                        : 'bg-[#D2F829] text-[#19202D]'
                    }`}>
                      {txn.status}
                    </span>
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
