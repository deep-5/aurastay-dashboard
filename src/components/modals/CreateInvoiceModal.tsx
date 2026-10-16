import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Modal, Button } from '../ui';
import { InvoiceItem, InvoiceStatus } from '../../types';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedGuestId?: string;
  preselectedReservationId?: string;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  preselectedGuestId,
  preselectedReservationId,
}) => {
  const { guests, reservations, createInvoice, settings } = useHotel();

  const [guestId, setGuestId] = useState(preselectedGuestId || guests[0]?.id || '');
  const [reservationId, setReservationId] = useState(preselectedReservationId || reservations[0]?.id || '');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().substring(0, 10));
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().substring(0, 10));
  const [discount, setDiscount] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [notes, setNotes] = useState('Standard hotel service charges and room folio.');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Room Accommodation & Resort Service Fee', quantity: 1, unitPrice: 280, amount: 280 },
  ]);
  const [success, setSuccess] = useState(false);

  const selectedGuest = guests.find(g => g.id === guestId) || guests[0];

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: String(Date.now()), description: 'Spa Azure Treatment / In-Room Dining', quantity: 1, unitPrice: 50, amount: 50 }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter(i => i.id !== id));
  };

  const handleItemChange = (id: string, field: 'description' | 'quantity' | 'unitPrice', val: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: val };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.amount = Number(updated.quantity) * Number(updated.unitPrice);
        }
        return updated;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
  const taxes = Number((subtotal * (settings.taxRatePercent / 100)).toFixed(2));
  const total = Math.max(0, subtotal + taxes - discount);
  const balanceDue = Math.max(0, total - amountPaid);
  const status: InvoiceStatus = balanceDue === 0 ? 'Paid' : 'Issued';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuest) return;

    createInvoice({
      reservationId: reservationId || `RES-${Date.now()}`,
      guestId: selectedGuest.id,
      guestName: selectedGuest.name,
      guestEmail: selectedGuest.email,
      guestPhone: selectedGuest.phone,
      issueDate,
      dueDate,
      items,
      subtotal,
      taxes,
      discount,
      total,
      amountPaid,
      balanceDue,
      status,
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
      title="Create New Invoice Folio"
      subtitle="Generate an itemized invoice for guest room folio or auxiliary resort services"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {success && (
          <div className="p-3 bg-[#EBF7F0] border border-[#C6ECD7] text-[#20A66A] text-xs rounded-lg font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Invoice created successfully!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#202938] mb-1">Guest *</label>
            <select
              value={guestId}
              onChange={(e) => setGuestId(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
            >
              {guests.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202938] mb-1">Linked Reservation ID</label>
            <select
              value={reservationId}
              onChange={(e) => setReservationId(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
            >
              <option value="">-- No Direct Booking Link --</option>
              {reservations.map(r => (
                <option key={r.id} value={r.id}>
                  {r.id} - {r.guestName} (Room {r.roomNumber})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#202938] mb-1">Issue Date</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202938] mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
            />
          </div>
        </div>

        {/* Line Items */}
        <div className="border border-[#E7EBF0] rounded-lg p-3 space-y-2 bg-[#F8FAFC]">
          <div className="flex items-center justify-between pb-1 border-b border-[#E7EBF0]">
            <span className="text-xs font-bold text-[#202938]">Itemized Charges</span>
            <Button type="button" size="sm" variant="outline" icon={<Plus className="w-3 h-3" />} onClick={handleAddItem}>
              Add Line Item
            </Button>
          </div>

          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded border border-[#E7EBF0]">
              <div className="col-span-6">
                <input
                  type="text"
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                  className="w-full text-xs p-1.5 rounded border border-[#E7EBF0]"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                  className="w-full text-xs p-1.5 rounded border border-[#E7EBF0]"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                  className="w-full text-xs p-1.5 rounded border border-[#E7EBF0]"
                />
              </div>
              <div className="col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={items.length <= 1}
                  className="text-slate-400 hover:text-red-500 disabled:opacity-20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Pricing summary */}
          <div className="pt-2 text-xs space-y-1 text-right font-medium">
            <div className="text-[#6B7280]">Subtotal: <span className="text-[#202938] font-bold">${subtotal.toFixed(2)}</span></div>
            <div className="text-[#6B7280]">Taxes ({settings.taxRatePercent}%): <span className="text-[#202938] font-bold">${taxes.toFixed(2)}</span></div>
            <div className="text-[#6B7280]">Discount: <span className="text-[#202938] font-bold">-${discount.toFixed(2)}</span></div>
            <div className="text-sm font-extrabold text-[#2583E9] pt-1 border-t border-[#E7EBF0]">
              Total Due: ${total.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#202938] mb-1">Discount Amount ($)</label>
            <input
              type="number"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202938] mb-1">Payment Received Now ($)</label>
            <input
              type="number"
              min="0"
              max={total}
              value={amountPaid}
              onChange={(e) => setAmountPaid(Number(e.target.value))}
              className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#202938] mb-1">Invoice Notes / Payment Instructions</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create & Issue Invoice
          </Button>
        </div>
      </form>
    </Modal>
  );
};
