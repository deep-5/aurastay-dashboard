import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Card, Badge, Button } from '../components/ui';
import {
  Shield,
  CheckCircle2,
  Lock,
  Unlock,
  Building,
  User,
  ArrowRight
} from 'lucide-react';
import { UserRole } from '../types';

export const AuthView: React.FC = () => {
  const { currentUser, switchRole, setActiveTab } = useHotel();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hotelName, setHotelName] = useState('Grand Azure Resort & Spa');
  const [agreed, setAgreed] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Account created for ${fullName || 'Manager'} at ${hotelName}!`);
    setTimeout(() => setActiveTab('dashboard'), 1200);
  };

  const rolesMatrix: Array<{
    role: UserRole;
    staffExample: string;
    description: string;
  }> = [
    { role: 'Hotel Manager', staffExample: 'Alexander Wright', description: 'Operations command, reservations, inspections, rates' },
    { role: 'Owner', staffExample: 'Victoria Stirling', description: 'Full access to P&L, expansion, executive reports' },
    { role: 'Receptionist', staffExample: 'Sarah Jenkins', description: 'Check-in, checkout, folios, room changes' },
    { role: 'Housekeeping Staff', staffExample: 'Carlos Mendez', description: 'Room turnover tasks, sanitization, linen counts' },
    { role: 'Accountant', staffExample: 'Elena Rostova', description: 'Invoicing, payment reconciliation, expenses' },
    { role: 'Maintenance Staff', staffExample: 'David Chen', description: 'Engineering work orders, AC/HVAC, room blocking' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#19202D] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom">
          <CheckCircle2 className="w-4 h-4 text-[#D2F829]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SPLIT SCREEN REGISTRATION VIEW MATCHING IMAGE 5 BOTTOM-RIGHT */}
      <div className="bg-white rounded-3xl border border-[#E7EBF0] shadow-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Side: Luxury Tropical Pool Photo matching reference screenshot */}
        <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-full">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80"
            alt="Luxury Resort Swimming Pool"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
            <span className="px-3 py-1 rounded-full bg-[#D2F829] text-[#19202D] text-xs font-black inline-block mb-2 w-max">
              AURASTAY CLOUD OS
            </span>
            <h2 className="text-2xl font-black leading-tight text-white">
              The Modern Operating Standard for Luxury Resorts & Hotels
            </h2>
            <p className="text-xs text-slate-200 mt-2">
              All-in-one reservations, guest relations, room racks, and staff housekeeping workflows.
            </p>
          </div>
        </div>

        {/* Right Side: Account Registration Form matching reference image */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-5">
            <div>
              <h2 className="text-2xl font-black text-[#19202D] tracking-tight">
                Create Your AuraStay Account
              </h2>
              <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                Join AuraStay to streamline your hotel management, track performance, and provide exceptional guest experiences.
              </p>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#19202D] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter Your Name"
                  className="w-full p-2.5 rounded-xl border border-[#E7EBF0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2583E9]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#19202D] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email Address"
                  className="w-full p-2.5 rounded-xl border border-[#E7EBF0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2583E9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#19202D] mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="w-full p-2.5 rounded-xl border border-[#E7EBF0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2583E9]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#19202D] mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full p-2.5 rounded-xl border border-[#E7EBF0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2583E9]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#19202D] mb-1">Hotel Name</label>
                <input
                  type="text"
                  required
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  placeholder="Enter Hotel Name"
                  className="w-full p-2.5 rounded-xl border border-[#E7EBF0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2583E9]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="rounded text-[#2583E9]"
                />
                <label htmlFor="agree-terms" className="text-[11px] text-[#6B7280] cursor-pointer">
                  I agree to the <span className="underline text-[#19202D] font-semibold">Terms & Conditions</span>
                </label>
              </div>

              {/* Exact Bright Lime-Yellow Button Matching Reference Image 5 */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#D2F829] hover:bg-[#C2E820] text-[#19202D] text-xs font-black transition-all shadow-sm"
                >
                  Create Account
                </button>
              </div>

              <div className="text-center text-[11px] text-[#6B7280] pt-1">
                Already have an account? <span className="underline font-bold text-[#2583E9] cursor-pointer" onClick={() => setActiveTab('dashboard')}>Login here</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* QUICK ROLE SWITCHER FOR DEMO TESTERS */}
      <Card title="Role-Based Access Control (RBAC)" subtitle="Switch active user role to experience customized permissions">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {rolesMatrix.map(item => {
            const isActive = currentUser.role === item.role;

            return (
              <button
                key={item.role}
                onClick={() => {
                  switchRole(item.role);
                  showToast(`Switched active session to ${item.role}`);
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isActive
                    ? 'border-[#2583E9] bg-[#EAF3FF] ring-2 ring-[#2583E9]/20'
                    : 'border-[#E7EBF0] bg-[#F8FAFC] hover:border-[#2583E9]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-[#19202D]">{item.role}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#2583E9]" />}
                </div>
                <p className="text-[10px] text-[#6B7280] truncate">{item.staffExample}</p>
                <span className="text-[10px] text-[#2583E9] font-bold mt-2 block">
                  {isActive ? 'Active User' : 'Click to Switch'}
                </span>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
