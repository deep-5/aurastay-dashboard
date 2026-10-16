import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Card, Badge, Button, Modal } from '../components/ui';
import {
  FileText,
  Search,
  Plus,
  CheckCircle2,
  Printer,
  Download,
  DollarSign,
  ArrowUpRight,
  Eye,
  Check,
  CreditCard
} from 'lucide-react';
import { Invoice } from '../types';

export const InvoicesView: React.FC = () => {
  const { invoices, selectedProperty } = useHotel();
  const [search, setSearch] = useState('');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('INV-3056');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const invoiceList = [
    { id: 'INV-3051', guest: 'Benjamin Carter', amount: '$1,280', date: 'Mar 14, 2035', status: 'Paid' },
    { id: 'INV-3052', guest: 'Emily Carter', amount: '$720', date: 'Mar 13, 2035', status: 'Paid' },
    { id: 'INV-3053', guest: 'Daniel Wong', amount: '$2,540', date: 'Mar 13, 2035', status: 'Paid' },
    { id: 'INV-3054', guest: 'Samantha Gray', amount: '$1,050', date: 'Mar 12, 2035', status: 'Unpaid' },
    { id: 'INV-3055', guest: 'Liam Johnson', amount: '$980', date: 'Mar 12, 2035', status: 'Paid' },
    { id: 'INV-3056', guest: 'Benjamin Carter', amount: '$650', date: 'Mar 11, 2035', status: 'Unpaid' },
    { id: 'INV-3057', guest: 'Grace Miller', amount: '$640', date: 'Mar 11, 2035', status: 'Paid' },
    { id: 'INV-3060', guest: 'Alexander Wright', amount: '$1,150', date: 'Mar 10, 2035', status: 'Paid' },
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

      {/* 1. TOP 3 STAT CARDS MATCHING REFERENCE IMAGE 5 TOP-LEFT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Solid Vibrant Blue Card matching reference */}
        <div className="bg-[#2583E9] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-blue-100">Total Issued Invoices</span>
              <h3 className="text-4xl font-black mt-2">140</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D2F829] text-[#19202D] text-[10px] font-extrabold">
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              <span>+8.4% from last month</span>
            </span>
          </div>
        </div>

        {/* Card 2: Paid Invoices */}
        <div className="bg-white rounded-2xl border border-[#E7EBF0] p-6 shadow-subtle flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6B7280]">Paid Invoices</span>
              <h3 className="text-3xl font-black text-[#19202D] mt-2">42</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#2583E9] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D2F829] text-[#19202D] text-[10px] font-extrabold">
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              <span>+4.2% from last month</span>
            </span>
          </div>
        </div>

        {/* Card 3: Unpaid Invoices */}
        <div className="bg-white rounded-2xl border border-[#E7EBF0] p-6 shadow-subtle flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6B7280]">Unpaid Invoices</span>
              <h3 className="text-3xl font-black text-[#19202D] mt-2">14</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#2583E9] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D2F829] text-[#19202D] text-[10px] font-extrabold">
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              <span>+0.8% from last month</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. SPLIT LAYOUT: INVOICE TABLE (LEFT) & INVOICE DETAILS FOLIO (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Table (6 cols) */}
        <div className="lg:col-span-6">
          <Card noPadding>
            <div className="p-4 border-b border-[#E7EBF0]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#8C95A6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search invoice number..."
                  className="w-full bg-[#F8FAFC] text-xs pl-9 pr-4 py-1.5 rounded-full border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E7EBF0] text-[#6B7280]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Invoice ID</th>
                    <th className="py-3 px-4 font-semibold">Total Amount</th>
                    <th className="py-3 px-4 font-semibold">Issued Date</th>
                    <th className="py-3 px-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7EBF0]">
                  {invoiceList.map(inv => (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInvoiceId(inv.id)}
                      className={`cursor-pointer transition-colors ${
                        selectedInvoiceId === inv.id ? 'bg-[#EAF3FF]/80' : 'hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-[#2583E9]">#{inv.id}</td>
                      <td className="py-3 px-4 font-bold text-[#19202D]">{inv.amount}</td>
                      <td className="py-3 px-4 text-[#6B7280]">{inv.date}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`text-[11px] font-bold ${
                          inv.status === 'Paid' ? 'text-[#2583E9]' : 'text-[#FA6B6B]'
                        }`}>
                          • {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Details Folio: Matching Image 5 top-left (6 cols) */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-2xl border border-[#E7EBF0] p-6 shadow-subtle space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7EBF0]">
              <h3 className="text-sm font-extrabold text-[#19202D]">Invoice Details</h3>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#19202D]">Invoice ID: #{selectedInvoiceId}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#FEECEC] text-[#FA6B6B] text-[10px] font-extrabold">
                  • Unpaid
                </span>
              </div>
            </div>

            {/* Bill From / Bill To */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-semibold text-[#8C95A6] block mb-0.5">Bill From</span>
                <p className="font-bold text-[#19202D]">AuraStay Hospitality Operations</p>
                <p className="text-[#6B7280] text-[11px]">+1 (555) 234-7418</p>
                <p className="text-[#6B7280] text-[11px]">finance@aurastay.com</p>
                <p className="text-[#6B7280] text-[11px]">532 Sunset Avenue, Los Angeles, CA 90028, USA</p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-[#8C95A6] block mb-0.5">Bill To</span>
                <p className="font-bold text-[#19202D]">Benjamin Carter</p>
                <p className="text-[#6B7280] text-[11px]">benjamin.carter@google.com</p>
                <p className="text-[#6B7280] text-[11px]">+1 (555) 874-2221</p>
                <p className="text-[#6B7280] text-[11px]">74 Maplewood Street, Pasadena, CA 91101, USA</p>
              </div>
            </div>

            {/* Dates row */}
            <div className="grid grid-cols-2 gap-4 text-xs p-3 bg-[#F8FAFC] rounded-xl border border-[#E7EBF0]">
              <div>
                <span className="text-[10px] text-[#8C95A6] block">Issue Date</span>
                <span className="font-bold text-[#19202D]">Mar 11, 2035</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8C95A6] block">Due Date</span>
                <span className="font-bold text-[#19202D]">Mar 18, 2035</span>
              </div>
            </div>

            {/* Itemized charges table matching reference image */}
            <div className="overflow-hidden border border-[#E7EBF0] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E7EBF0] text-[#6B7280]">
                  <tr>
                    <th className="py-2.5 px-3">Item Type</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-3 text-right">Qty</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7EBF0] text-[11px]">
                  <tr>
                    <td className="py-2 px-3 font-medium text-[#19202D]">Superior Room</td>
                    <td className="py-2 px-3 text-right text-[#6B7280]">$200</td>
                    <td className="py-2 px-3 text-right text-[#6B7280]">2 Nights</td>
                    <td className="py-2 px-3 text-right font-bold text-[#19202D]">$400</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-[#19202D]">Room Service (Dinner & Drinks)</td>
                    <td className="py-2 px-3 text-right text-[#6B7280]">$65</td>
                    <td className="py-2 px-3 text-right text-[#6B7280]">1 Order</td>
                    <td className="py-2 px-3 text-right font-bold text-[#19202D]">$65</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-[#19202D]">Laundry Service</td>
                    <td className="py-2 px-3 text-right text-[#6B7280]">$25</td>
                    <td className="py-2 px-3 text-right text-[#6B7280]">2 Loads</td>
                    <td className="py-2 px-3 text-right font-bold text-[#19202D]">$25</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-[#19202D]">Minibar Consumption</td>
                    <td className="py-2 px-3 text-right text-[#6B7280]">$20</td>
                    <td className="py-2 px-3 text-right text-[#6B7280]">1 Item</td>
                    <td className="py-2 px-3 text-right font-bold text-[#19202D]">$20</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-[#19202D]">Late Checkout Fee</td>
                    <td className="py-2 px-3 text-right text-[#6B7280]">$50</td>
                    <td className="py-2 px-3 text-right text-[#6B7280]">1 Time</td>
                    <td className="py-2 px-3 text-right font-bold text-[#19202D]">$50</td>
                  </tr>
                </tbody>
              </table>

              <div className="p-3 bg-[#F8FAFC] border-t border-[#E7EBF0] space-y-1 text-right text-xs">
                <div>Sub Total: <strong className="text-[#19202D]">$560</strong></div>
                <div>Tax (10%): <strong className="text-[#19202D]">$56</strong></div>
                <div>Service Fee: <strong className="text-[#19202D]">$34</strong></div>
                <div className="text-sm font-black text-[#19202D] pt-1 border-t border-[#E7EBF0]">
                  Total Amount: $650
                </div>
              </div>
            </div>

            <p className="text-[10px] text-[#8C95A6] leading-relaxed">
              Payment is currently unpaid and due within 7 days via hotel's online portal, bank wire, or front desk. A 2% late fee applies to payments received after Mar 18, 2035.
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-[#E7EBF0]">
              <Button size="sm" variant="outline" icon={<Printer className="w-3.5 h-3.5" />} onClick={() => window.print()}>
                Print Folio
              </Button>

              <Button size="sm" variant="primary" onClick={() => showToast('Payment received for #INV-3056')}>
                Record Payment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
