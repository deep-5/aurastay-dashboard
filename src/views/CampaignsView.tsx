import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Card, Badge, Button, Modal } from '../components/ui';
import {
  Megaphone,
  Plus,
  Send,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Pause,
  Play,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { Campaign, CampaignStatus } from '../types';

export const CampaignsView: React.FC = () => {
  const { campaigns, createCampaign, updateCampaign, sendCampaignSimulation } = useHotel();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [campName, setCampName] = useState('');
  const [targetSegment, setTargetSegment] = useState('VIP Guests');
  const [offerDetails, setOfferDetails] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(15);
  const [startDate, setStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000 * 30).toISOString().substring(0, 10));
  const [channel, setChannel] = useState<'Email' | 'SMS' | 'Push'>('Email');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName || !offerDetails) return;

    createCampaign({
      name: campName,
      targetSegment,
      offerDetails,
      discountCode: discountCode || `${campName.substring(0, 4).toUpperCase()}15`,
      discountPercent: Number(discountPercent),
      startDate,
      endDate,
      status: 'Active',
      channel,
    });

    showToast(`Campaign "${campName}" created successfully.`);
    setCreateModalOpen(false);
    setCampName('');
    setOfferDetails('');
    setDiscountCode('');
  };

  const handleTogglePause = (c: Campaign) => {
    const nextStatus: CampaignStatus = c.status === 'Active' ? 'Paused' : 'Active';
    updateCampaign(c.id, { status: nextStatus });
    showToast(`Campaign "${c.name}" is now ${nextStatus}.`);
  };

  const handleSimulateDispatch = (c: Campaign) => {
    sendCampaignSimulation(c.id);
    showToast(`Simulated promotional blast dispatched for "${c.name}".`);
  };

  return (
    <div className="space-y-4 animate-in fade-in pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#202938] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom">
          <CheckCircle2 className="w-4 h-4 text-[#20A66A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Provider Notice */}
      <div className="p-3 bg-[#EAF3FF] border border-[#BEDCFF] rounded-xl flex items-center justify-between text-xs text-[#2583E9]">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>Marketing Delivery Mode:</strong> Live delivery requires SMTP or Twilio SMS credentials configured in Settings. Currently operating in Sandbox simulation mode.
          </span>
        </div>
        <span className="text-[11px] font-bold bg-white px-2 py-0.5 rounded border border-[#BEDCFF]">
          Sandbox Simulated
        </span>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-[#E7EBF0] rounded-xl p-4 shadow-subtle flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#202938]">Targeted Guest Marketing & Seasonal Offers</h2>
          <p className="text-xs text-[#6B7280]">Engage past visitors and corporate accounts with promotional booking incentives</p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setCreateModalOpen(true)}
        >
          Create Campaign
        </Button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map(camp => (
          <div
            key={camp.id}
            className="bg-white border border-[#E7EBF0] rounded-xl p-5 shadow-subtle flex flex-col justify-between hover:border-[#2583E9] transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-xs font-mono font-semibold text-[#2583E9]">{camp.id}</span>
                  <h3 className="text-sm font-bold text-[#202938]">{camp.name}</h3>
                </div>
                <Badge variant={
                  camp.status === 'Active' ? 'success' :
                  camp.status === 'Scheduled' ? 'info' :
                  camp.status === 'Paused' ? 'warning' : 'default'
                }>
                  {camp.status}
                </Badge>
              </div>

              <p className="text-xs text-[#6B7280] mb-3 leading-relaxed">{camp.offerDetails}</p>

              <div className="p-3 bg-[#F8FAFC] border border-[#E7EBF0] rounded-lg text-xs space-y-1 mb-3">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Audience:</span>
                  <span className="font-bold text-[#202938]">{camp.targetSegment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Promo Code:</span>
                  <span className="font-mono font-bold text-[#2583E9]">{camp.discountCode} (-{camp.discountPercent}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Timeline:</span>
                  <span className="text-[#202938]">{camp.startDate} → {camp.endDate}</span>
                </div>
              </div>

              {/* Conversion Metrics */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs py-2 border-y border-[#E7EBF0]">
                <div>
                  <span className="text-[10px] text-[#6B7280] block">Dispatched</span>
                  <span className="font-bold text-[#202938]">{camp.sentCount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] block">Opened</span>
                  <span className="font-bold text-[#202938]">{camp.openedCount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] block">Clicks</span>
                  <span className="font-bold text-[#202938]">{camp.clickedCount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] block">Booked Rev</span>
                  <span className="font-bold text-[#20A66A]">${camp.convertedRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4 pt-2">
              <span className="text-[10px] text-slate-400">Via {camp.channel} Campaign</span>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  icon={camp.status === 'Active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  onClick={() => handleTogglePause(camp)}
                >
                  {camp.status === 'Active' ? 'Pause' : 'Resume'}
                </Button>

                <Button
                  size="sm"
                  variant="primary"
                  icon={<Send className="w-3.5 h-3.5" />}
                  onClick={() => handleSimulateDispatch(camp)}
                >
                  Send Blast
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE CAMPAIGN MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Marketing Campaign"
        subtitle="Design an exclusive seasonal offer for guest re-engagement"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateCampaignSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#202938] mb-1">Campaign Title *</label>
            <input
              type="text"
              required
              value={campName}
              onChange={(e) => setCampName(e.target.value)}
              placeholder="e.g. Midweek Riviera Sanctuary Spa Pass"
              className="w-full p-2 rounded-lg border border-[#E7EBF0]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202938] mb-1">Target Segment</label>
              <select
                value={targetSegment}
                onChange={(e) => setTargetSegment(e.target.value)}
                className="w-full p-2 rounded-lg border border-[#E7EBF0]"
              >
                <option value="VIP Guests">VIP Guests</option>
                <option value="Corporate Clients">Corporate Clients</option>
                <option value="Past Summer Guests">Past Summer Guests</option>
                <option value="Inactive > 6 months">Inactive &gt; 6 months</option>
                <option value="All Newsletter Subscribers">All Subscribers</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#202938] mb-1">Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-[#E7EBF0]"
              >
                <option value="Email">Email Blast</option>
                <option value="SMS">SMS Text Message</option>
                <option value="Push">Mobile App Push</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202938] mb-1">Promo Code</label>
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="AUTUMN20"
                className="w-full p-2 rounded-lg border border-[#E7EBF0]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#202938] mb-1">Discount (%)</label>
              <input
                type="number"
                min="5"
                max="50"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-[#E7EBF0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202938] mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 rounded-lg border border-[#E7EBF0]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#202938] mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 rounded-lg border border-[#E7EBF0]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202938] mb-1">Offer Description & Value Proposition *</label>
            <textarea
              rows={3}
              required
              value={offerDetails}
              onChange={(e) => setOfferDetails(e.target.value)}
              placeholder="e.g. Receive 20% off all Deluxe King bookings plus $100 dining voucher..."
              className="w-full p-2 rounded-lg border border-[#E7EBF0]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Launch Campaign
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
