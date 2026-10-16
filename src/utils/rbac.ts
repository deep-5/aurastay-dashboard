import { UserRole } from '../types';

export interface RoleConfig {
  role: UserRole;
  title: string;
  userName: string;
  department: string;
  avatar: string;
  badgeColor: string;
  allowedTabs: string[];
  summary: string;
  visibleFeatures: string[];
  restrictedFeatures: string[];
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  'Owner': {
    role: 'Owner',
    title: 'Owner / Executive Director',
    userName: 'Victoria Stirling',
    department: 'Executive Board',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    badgeColor: 'bg-[#D2F829] text-[#19202D]',
    allowedTabs: [
      'dashboard', 'inbox', 'calendar', 'campaigns', 'reservations',
      'rooms', 'housekeeping', 'inventory', 'finance', 'invoices',
      'reviews', 'reports', 'auth', 'settings'
    ],
    summary: 'Full executive visibility into revenue, operations, audit logs, and strategic reports.',
    visibleFeatures: [
      'Financial overview & profit statements',
      'High-level occupancy & revenue trends',
      'Full staff management & settings configuration',
      'All 14 hotel management modules'
    ],
    restrictedFeatures: []
  },
  'Hotel Manager': {
    role: 'Hotel Manager',
    title: 'General Manager (Admin)',
    userName: 'Polina Steward',
    department: 'Hotel Operations',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    badgeColor: 'bg-[#2583E9] text-white',
    allowedTabs: [
      'dashboard', 'inbox', 'calendar', 'campaigns', 'reservations',
      'rooms', 'housekeeping', 'inventory', 'finance', 'invoices',
      'reviews', 'reports', 'auth', 'settings'
    ],
    summary: 'Full operational control over reservations, rooms, housekeeping, staff, and analytics.',
    visibleFeatures: [
      'Total earnings & dynamic revenue graphs',
      'Guest check-in & check-out supervisor actions',
      'Direct messaging & concierge inbox',
      'Room availability & pricing rate rules',
      'Housekeeping orders & inventory control'
    ],
    restrictedFeatures: []
  },
  'Receptionist': {
    role: 'Receptionist',
    title: 'Front Desk Receptionist',
    userName: 'Sarah Jenkins',
    department: 'Front Desk & Guest Services',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    badgeColor: 'bg-[#EAF3FF] text-[#2583E9]',
    allowedTabs: [
      'dashboard', 'inbox', 'calendar', 'reservations', 'rooms', 'reviews'
    ],
    summary: 'Front desk operations: guest check-ins, check-outs, room assignment, and messaging.',
    visibleFeatures: [
      'Guest booking list & search',
      'Room check-in & room key assignment',
      'Interactive booking calendar timeline',
      'Guest concierge inbox & live inquiries',
      'Guest feedback & review reading'
    ],
    restrictedFeatures: [
      'Hotel financial cashflow & profit ledgers',
      'Staff compensation & master settings',
      'Marketing campaign broadcast dispatch',
      'Supply procurement stock adjustments'
    ]
  },
  'Housekeeping Staff': {
    role: 'Housekeeping Staff',
    title: 'Housekeeping Supervisor',
    userName: 'Carlos Mendez',
    department: 'Housekeeping & Cleanliness',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    badgeColor: 'bg-[#EBF7F0] text-[#20A66A]',
    allowedTabs: [
      'housekeeping', 'rooms', 'inventory', 'calendar'
    ],
    summary: 'Task execution for room turnover, cleaning status updates, linen inventory, and maintenance.',
    visibleFeatures: [
      'List of turnover cleaning orders with priority & floor filters',
      'Room cleanliness status (Dirty, Cleaning, Ready, Inspected)',
      'Toiletries & bedsheet supplies restocking',
      'Maintenance repair request ticketing',
      'Daily staff work schedule calendar'
    ],
    restrictedFeatures: [
      'Guest contact details & personal identities',
      'Financial accounts & invoice billing folios',
      'Campaign & rate configuration',
      'Hotel settings & audit logs'
    ]
  },
  'Accountant': {
    role: 'Accountant',
    title: 'Financial Auditor & Accountant',
    userName: 'Elena Rostova',
    department: 'Finance & Accounting',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    badgeColor: 'bg-[#FEF9E7] text-[#D9A300]',
    allowedTabs: [
      'dashboard', 'finance', 'invoices', 'reports', 'inventory'
    ],
    summary: 'Financial management, guest folios, accounts receivable, and cashflow monitoring.',
    visibleFeatures: [
      'Opposing cashflow bar chart (Income vs Expenses)',
      'Guest invoice generation & payment recording',
      'Money tracker & payment gateway breakdown',
      'Tax calculation, audit logs, and transaction ledgers',
      'Supply procurement expense logging'
    ],
    restrictedFeatures: [
      'Room lock override & keycard issuance',
      'Direct marketing campaigns',
      'Room cleaning task reassignment'
    ]
  },
  'Maintenance Staff': {
    role: 'Maintenance Staff',
    title: 'Maintenance Engineer',
    userName: 'David Chen',
    department: 'Facilities & Engineering',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    badgeColor: 'bg-[#F1F5F9] text-[#475569]',
    allowedTabs: [
      'housekeeping', 'rooms', 'inventory', 'calendar'
    ],
    summary: 'Facility maintenance, HVAC, plumbing, room hardware repairs, and engineering inventory.',
    visibleFeatures: [
      'Maintenance request log & urgent repairs',
      'Room Out-of-Service blocking and clearance',
      'Spare parts inventory (bulbs, valves, filters)',
      'Service scheduling timeline'
    ],
    restrictedFeatures: [
      'Guest folios & billing records',
      'Reservations & rate plans',
      'Marketing campaigns & reviews'
    ]
  },
  'Guest': {
    role: 'Guest',
    title: 'Hotel Guest / Resident',
    userName: 'Ethan Brown',
    department: 'Gold VIP Resident (Suite 210)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    badgeColor: 'bg-[#D2F829] text-[#19202D]',
    allowedTabs: [
      'reservations', 'inbox', 'invoices', 'reviews'
    ],
    summary: 'Guest self-service portal: view personal stay, order room service, check bill, and rate hotel.',
    visibleFeatures: [
      'Personal suite booking details & check-out time',
      'Direct concierge messaging & room service requests',
      'Personal room folio & payment receipt',
      'Post-stay review & satisfaction rating'
    ],
    restrictedFeatures: [
      'Internal staff management',
      'All other guest records & room statuses',
      'Inventory, financial ledgers, and hotel administration'
    ]
  }
};

export function isTabAllowedForRole(role: UserRole, tabId: string): boolean {
  const config = ROLE_CONFIGS[role];
  if (!config) return true;
  return config.allowedTabs.includes(tabId);
}
