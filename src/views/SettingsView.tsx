import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Card, Badge, Button, Modal } from '../components/ui';
import {
  Settings as SettingsIcon,
  Building,
  Shield,
  Clock,
  RotateCcw,
  CheckCircle2,
  Users,
  Plus,
  FileText,
  DollarSign,
  AlertTriangle,
  History
} from 'lucide-react';
import { HotelSettings, StaffMember, UserRole } from '../types';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    staff,
    addStaffMember,
    auditLogs,
    resetDemoData,
    currentUser,
    switchRole,
    selectedProperty,
    properties,
  } = useHotel();

  const [activeTab, setActiveTab] = useState<'hotel' | 'staff' | 'policies' | 'audit'>('hotel');

  // Hotel form state
  const [hotelName, setHotelName] = useState(settings.hotelName);
  const [chainName, setChainName] = useState(settings.chainName);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [address, setAddress] = useState(settings.address);
  const [currency, setCurrency] = useState(settings.currency);
  const [timezone, setTimezone] = useState(settings.timezone);
  const [checkInTime, setCheckInTime] = useState(settings.checkInTime);
  const [checkOutTime, setCheckOutTime] = useState(settings.checkOutTime);
  const [taxRatePercent, setTaxRatePercent] = useState(settings.taxRatePercent);
  const [inspectionRequired, setInspectionRequired] = useState(settings.inspectionRequired);

  // Add staff state
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffRole, setStaffRole] = useState<UserRole>('Receptionist');
  const [staffDept, setStaffDept] = useState('Front Desk');
  const [staffShift, setStaffShift] = useState('Morning (07:00 - 15:30)');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveHotelSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      hotelName,
      chainName,
      contactEmail,
      contactPhone,
      address,
      currency,
      timezone,
      checkInTime,
      checkOutTime,
      taxRatePercent: Number(taxRatePercent),
      inspectionRequired,
    });
    showToast('Hotel profile & operational settings saved successfully.');
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffEmail) return;

    addStaffMember({
      name: staffName,
      email: staffEmail,
      phone: staffPhone,
      role: staffRole,
      department: staffDept,
      shift: staffShift,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    showToast(`Staff member ${staffName} added successfully.`);
    setAddStaffOpen(false);
    setStaffName('');
    setStaffEmail('');
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

      {/* Settings Navigation Tabs */}
      <div className="bg-white border border-[#E7EBF0] rounded-xl p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap border border-[#E7EBF0] rounded-lg overflow-hidden bg-[#F8FAFC] p-0.5 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('hotel')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === 'hotel' ? 'bg-white text-[#2583E9] shadow-sm' : 'text-[#6B7280] hover:text-[#202938]'
            }`}
          >
            Hotel Profile & Property
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === 'policies' ? 'bg-white text-[#2583E9] shadow-sm' : 'text-[#6B7280] hover:text-[#202938]'
            }`}
          >
            Policies & Taxes
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === 'staff' ? 'bg-white text-[#2583E9] shadow-sm' : 'text-[#6B7280] hover:text-[#202938]'
            }`}
          >
            Staff Directory ({staff.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === 'audit' ? 'bg-white text-[#2583E9] shadow-sm' : 'text-[#6B7280] hover:text-[#202938]'
            }`}
          >
            System Audit Log ({auditLogs.length})
          </button>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <Button
            size="sm"
            variant="outline"
            className="text-[#D9A300] hover:bg-[#FEF9E7] border-[#FBE9A3]"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={() => {
              if (confirm('Reset all demo data back to default clean seed?')) {
                resetDemoData();
                showToast('All system records reset to initial seed.');
              }
            }}
          >
            Reset Demo Data
          </Button>
        </div>
      </div>

      {/* TAB 1: HOTEL PROFILE */}
      {activeTab === 'hotel' && (
        <Card title="Hotel Profile & Branch Management" subtitle="Core hotel identity and contact information">
          <form onSubmit={handleSaveHotelSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#202938] mb-1">Hotel Property Name</label>
                <input
                  type="text"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E7EBF0] bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#202938] mb-1">Parent Hospitality Brand</label>
                <input
                  type="text"
                  value={chainName}
                  onChange={(e) => setChainName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E7EBF0] bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#202938] mb-1">Primary Reception Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E7EBF0] bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#202938] mb-1">Direct Front Desk Phone</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E7EBF0] bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#202938] mb-1">Physical Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E7EBF0] bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#202938] mb-1">Operational Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E7EBF0] bg-white"
                >
                  <option value="USD">USD ($ - United States Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#202938] mb-1">Local Timezone</label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E7EBF0] bg-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#E7EBF0] flex justify-end">
              <Button type="submit" variant="primary">
                Save Hotel Profile
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 2: POLICIES & TAXES */}
      {activeTab === 'policies' && (
        <Card title="Booking Policies, Taxes & Quality Controls" subtitle="Operational check-in limits and quality inspection workflows">
          <form onSubmit={handleSaveHotelSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#202938] mb-1">Standard Check-In Time</label>
                <input
                  type="time"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E7EBF0] bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#202938] mb-1">Standard Check-Out Time</label>
                <input
                  type="time"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E7EBF0] bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#202938] mb-1">Occupancy & Hospitality Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                max="30"
                step="0.1"
                value={taxRatePercent}
                onChange={(e) => setTaxRatePercent(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-[#E7EBF0] bg-white"
              />
              <span className="text-[11px] text-[#6B7280] mt-1 block">
                Applied automatically to all reservation folios and room charge calculations.
              </span>
            </div>

            {/* Quality Inspection Workflow Requirement 9 */}
            <div className="p-4 bg-[#F8FAFC] border border-[#E7EBF0] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-[#202938] block">Mandatory Quality Inspection Protocol</span>
                  <p className="text-[11px] text-[#6B7280]">
                    When enabled, cleaning a room sets it to "Awaiting Inspection" and prevents it from being marked Available until signed off by a supervisor.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={inspectionRequired}
                  onChange={(e) => setInspectionRequired(e.target.checked)}
                  className="w-5 h-5 text-[#2583E9] rounded border-slate-300 focus:ring-[#2583E9]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#E7EBF0] flex justify-end">
              <Button type="submit" variant="primary">
                Update Policies
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 3: STAFF DIRECTORY */}
      {activeTab === 'staff' && (
        <Card
          noPadding
          title="Staff Directory & Role-Based Access"
          subtitle="Authorized team members across management, front desk, housekeeping, and engineering"
          headerAction={
            <Button size="sm" variant="primary" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setAddStaffOpen(true)}>
              Add Staff Member
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E7EBF0] text-[#6B7280]">
                <tr>
                  <th className="py-3 px-3 font-semibold">Staff Member</th>
                  <th className="py-3 px-3 font-semibold">System Role</th>
                  <th className="py-3 px-3 font-semibold">Department</th>
                  <th className="py-3 px-3 font-semibold">Shift Schedule</th>
                  <th className="py-3 px-3 font-semibold">Contact Phone</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold text-right">Switch Active Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7EBF0]">
                {staff.map(member => (
                  <tr key={member.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover border border-[#E7EBF0]" />
                        <div>
                          <p className="font-bold text-[#202938]">{member.name}</p>
                          <p className="text-[10px] text-[#6B7280]">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-bold text-[#2583E9]">{member.role}</td>
                    <td className="py-3 px-3 text-[#202938]">{member.department}</td>
                    <td className="py-3 px-3 text-[#6B7280]">{member.shift}</td>
                    <td className="py-3 px-3 text-[#6B7280]">{member.phone}</td>
                    <td className="py-3 px-3">
                      <Badge variant="success">{member.status}</Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {currentUser.name === member.name ? (
                        <span className="text-[11px] font-bold text-[#20A66A]">Active User</span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            switchRole(member.role);
                            showToast(`Switched active session to ${member.name} (${member.role})`);
                          }}
                        >
                          Login as {member.role.split(' ')[0]}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 4: SYSTEM AUDIT LOG */}
      {activeTab === 'audit' && (
        <Card noPadding title="Comprehensive Hotel System Audit Trail" subtitle="Chronological tamper-evident log of reservations, check-ins, payments and room status changes">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E7EBF0] text-[#6B7280]">
                <tr>
                  <th className="py-3 px-3 font-semibold">Timestamp</th>
                  <th className="py-3 px-3 font-semibold">Action</th>
                  <th className="py-3 px-3 font-semibold">Entity Type</th>
                  <th className="py-3 px-3 font-semibold">Reference ID</th>
                  <th className="py-3 px-3 font-semibold">Change Details</th>
                  <th className="py-3 px-3 font-semibold">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7EBF0]">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-3 font-mono text-[#6B7280]">{log.timestamp}</td>
                    <td className="py-3 px-3 font-bold text-[#202938]">{log.action}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[#475569] text-[10px] font-medium">
                        {log.entity}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[#2583E9]">{log.entityId}</td>
                    <td className="py-3 px-3 text-[#202938]">{log.details}</td>
                    <td className="py-3 px-3 font-semibold text-[#6B7280]">{log.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ADD STAFF MODAL */}
      <Modal
        isOpen={addStaffOpen}
        onClose={() => setAddStaffOpen(false)}
        title="Add Staff Member"
        subtitle="Provision an employee account with assigned role and shift schedule"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddStaffSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#202938] mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              placeholder="e.g. Julian Ross"
              className="w-full p-2 rounded-lg border border-[#E7EBF0]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#202938] mb-1">Work Email Address *</label>
            <input
              type="email"
              required
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
              placeholder="j.ross@aurastay.com"
              className="w-full p-2 rounded-lg border border-[#E7EBF0]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#202938] mb-1">Direct Phone</label>
            <input
              type="tel"
              value={staffPhone}
              onChange={(e) => setStaffPhone(e.target.value)}
              placeholder="+1 (305) 555-0145"
              className="w-full p-2 rounded-lg border border-[#E7EBF0]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202938] mb-1">System Role (RBAC)</label>
              <select
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value as UserRole)}
                className="w-full p-2 rounded-lg border border-[#E7EBF0]"
              >
                <option value="Receptionist">Receptionist</option>
                <option value="Hotel Manager">Hotel Manager</option>
                <option value="Housekeeping Staff">Housekeeping Staff</option>
                <option value="Accountant">Accountant</option>
                <option value="Maintenance Staff">Maintenance Staff</option>
                <option value="Owner">Owner</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#202938] mb-1">Department</label>
              <input
                type="text"
                value={staffDept}
                onChange={(e) => setStaffDept(e.target.value)}
                placeholder="Front Desk"
                className="w-full p-2 rounded-lg border border-[#E7EBF0]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202938] mb-1">Shift Schedule</label>
            <select
              value={staffShift}
              onChange={(e) => setStaffShift(e.target.value)}
              className="w-full p-2 rounded-lg border border-[#E7EBF0]"
            >
              <option value="Morning (07:00 - 15:30)">Morning (07:00 - 15:30)</option>
              <option value="Evening (15:00 - 23:30)">Evening (15:00 - 23:30)</option>
              <option value="Night (23:00 - 07:30)">Night (23:00 - 07:30)</option>
              <option value="Flexible">Flexible / On-call</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setAddStaffOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Add Staff Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
