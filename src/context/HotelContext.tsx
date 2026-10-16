import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Property,
  Reservation,
  Guest,
  Room,
  RoomType,
  HousekeepingTask,
  InventoryItem,
  StockMovement,
  Invoice,
  PaymentRecord,
  Review,
  Campaign,
  InboxMessage,
  CalendarEvent,
  StaffMember,
  AuditLog,
  HotelSettings,
  RoomStatus,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_PROPERTIES,
  CURRENT_USER,
  INITIAL_STAFF,
  INITIAL_ROOM_TYPES,
  INITIAL_ROOMS,
  INITIAL_GUESTS,
  INITIAL_RESERVATIONS,
  INITIAL_HOUSEKEEPING_TASKS,
  INITIAL_INVENTORY,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_REVIEWS,
  INITIAL_CAMPAIGNS,
  INITIAL_INBOX_MESSAGES,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';

interface HotelContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  selectedProperty: Property;
  setSelectedProperty: (prop: Property) => void;
  properties: Property[];
  settings: HotelSettings;
  updateSettings: (newSettings: Partial<HotelSettings>) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Data
  reservations: Reservation[];
  guests: Guest[];
  rooms: Room[];
  roomTypes: RoomType[];
  housekeepingTasks: HousekeepingTask[];
  inventory: InventoryItem[];
  stockMovements: StockMovement[];
  invoices: Invoice[];
  payments: PaymentRecord[];
  reviews: Review[];
  campaigns: Campaign[];
  inboxMessages: InboxMessage[];
  calendarEvents: CalendarEvent[];
  staff: StaffMember[];
  auditLogs: AuditLog[];

  // Actions
  createReservation: (data: Partial<Reservation>) => { success: boolean; message?: string; reservation?: Reservation };
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  checkInReservation: (id: string) => { success: boolean; message: string };
  checkOutReservation: (id: string) => { success: boolean; message: string };
  cancelReservation: (id: string, reason: string) => { success: boolean; message: string };
  changeReservationRoom: (resId: string, newRoomId: string) => { success: boolean; message: string };
  extendStay: (resId: string, newCheckOut: string) => { success: boolean; message: string };

  addGuest: (guest: Omit<Guest, 'id' | 'createdAt' | 'activityHistory' | 'notes'>) => Guest;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  addGuestNote: (guestId: string, noteText: string) => void;

  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  changeRoomStatus: (roomId: string, newStatus: RoomStatus) => void;
  createMaintenanceRequest: (roomId: string, issue: string, priority: 'High' | 'Medium' | 'Low') => void;

  createHousekeepingTask: (task: Omit<HousekeepingTask, 'id' | 'createdTime'>) => void;
  updateHousekeepingTask: (id: string, updates: Partial<HousekeepingTask>) => void;
  markRoomCleaned: (roomId: string, taskId?: string) => void;
  approveInspection: (roomId: string, taskId?: string) => void;

  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastRestocked'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  stockInInventory: (itemId: string, qty: number, reason: string) => void;
  stockOutInventory: (itemId: string, qty: number, reason: string) => void;
  stockAdjustInventory: (itemId: string, newQty: number, reason: string) => void;

  createInvoice: (data: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  recordPayment: (invoiceId: string, amount: number, method: 'Credit Card' | 'Bank Transfer' | 'Cash' | 'Stripe / Online') => { success: boolean; message: string };

  createCampaign: (camp: Omit<Campaign, 'id' | 'sentCount' | 'openedCount' | 'clickedCount' | 'convertedRevenue'>) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  sendCampaignSimulation: (id: string) => void;

  sendInboxMessage: (msg: Omit<InboxMessage, 'id' | 'timestamp' | 'unread' | 'starred'>) => void;
  replyInboxMessage: (msgId: string, replyText: string) => void;
  toggleStarMessage: (id: string) => void;
  markMessageRead: (id: string, unread: boolean) => void;
  deleteMessage: (id: string) => void;

  createCalendarEvent: (evt: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;

  respondToReview: (id: string, response: string) => void;
  updateReviewStatus: (id: string, status: Review['status'], note?: string) => void;

  addStaffMember: (member: Omit<StaffMember, 'id' | 'joinedDate'>) => void;
  updateStaffMember: (id: string, updates: Partial<StaffMember>) => void;

  resetDemoData: () => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'hotelify_app_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage:`, err);
  }
}

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User>(() => loadFromStorage('current_user', CURRENT_USER));
  const [selectedProperty, setSelectedPropertyState] = useState<Property>(() => loadFromStorage('selected_prop', INITIAL_PROPERTIES[0]));
  const [properties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [settings, setSettingsState] = useState<HotelSettings>(() => loadFromStorage('settings', INITIAL_SETTINGS));
  const [dateRange, setDateRange] = useState<string>('This Month');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Entities
  const [reservations, setReservations] = useState<Reservation[]>(() => loadFromStorage('reservations', INITIAL_RESERVATIONS));
  const [guests, setGuests] = useState<Guest[]>(() => loadFromStorage('guests', INITIAL_GUESTS));
  const [rooms, setRooms] = useState<Room[]>(() => loadFromStorage('rooms', INITIAL_ROOMS));
  const [roomTypes] = useState<RoomType[]>(INITIAL_ROOM_TYPES);
  const [housekeepingTasks, setHousekeepingTasks] = useState<HousekeepingTask[]>(() => loadFromStorage('housekeeping', INITIAL_HOUSEKEEPING_TASKS));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => loadFromStorage('inventory', INITIAL_INVENTORY));
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => loadFromStorage('stock_movements', INITIAL_STOCK_MOVEMENTS));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadFromStorage('invoices', INITIAL_INVOICES));
  const [payments, setPayments] = useState<PaymentRecord[]>(() => loadFromStorage('payments', INITIAL_PAYMENTS));
  const [reviews, setReviews] = useState<Review[]>(() => loadFromStorage('reviews', INITIAL_REVIEWS));
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => loadFromStorage('campaigns', INITIAL_CAMPAIGNS));
  const [inboxMessages, setInboxMessages] = useState<InboxMessage[]>(() => loadFromStorage('inbox', INITIAL_INBOX_MESSAGES));
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => loadFromStorage('calendar', INITIAL_CALENDAR_EVENTS));
  const [staff, setStaff] = useState<StaffMember[]>(() => loadFromStorage('staff', INITIAL_STAFF));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadFromStorage('audit_logs', INITIAL_AUDIT_LOGS));

  // Sync to storage
  useEffect(() => saveToStorage('current_user', currentUser), [currentUser]);
  useEffect(() => saveToStorage('selected_prop', selectedProperty), [selectedProperty]);
  useEffect(() => saveToStorage('settings', settings), [settings]);
  useEffect(() => saveToStorage('reservations', reservations), [reservations]);
  useEffect(() => saveToStorage('guests', guests), [guests]);
  useEffect(() => saveToStorage('rooms', rooms), [rooms]);
  useEffect(() => saveToStorage('housekeeping', housekeepingTasks), [housekeepingTasks]);
  useEffect(() => saveToStorage('inventory', inventory), [inventory]);
  useEffect(() => saveToStorage('stock_movements', stockMovements), [stockMovements]);
  useEffect(() => saveToStorage('invoices', invoices), [invoices]);
  useEffect(() => saveToStorage('payments', payments), [payments]);
  useEffect(() => saveToStorage('reviews', reviews), [reviews]);
  useEffect(() => saveToStorage('campaigns', campaigns), [campaigns]);
  useEffect(() => saveToStorage('inbox', inboxMessages), [inboxMessages]);
  useEffect(() => saveToStorage('calendar', calendarEvents), [calendarEvents]);
  useEffect(() => saveToStorage('staff', staff), [staff]);
  useEffect(() => saveToStorage('audit_logs', auditLogs), [auditLogs]);
  useEffect(() => saveToStorage('current_user', currentUser), [currentUser]);

  const addAuditLog = (action: string, entity: string, entityId: string, details: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      action,
      entity,
      entityId,
      details,
      performedBy: currentUser.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const switchRole = (role: UserRole) => {
    const targetStaff = staff.find(s => s.role === role);
    const updatedUser: User = {
      id: targetStaff ? targetStaff.id : `USR-${Date.now()}`,
      name: targetStaff ? targetStaff.name : `${role} User`,
      email: targetStaff ? targetStaff.email : `${role.toLowerCase().replace(/\s+/g, '')}@aurastay.com`,
      role: role,
      avatar: targetStaff ? targetStaff.avatar : currentUser.avatar,
      propertyId: selectedProperty.id,
      phone: targetStaff ? targetStaff.phone : '+1 (305) 555-0100',
      department: targetStaff ? targetStaff.department : 'Operations',
    };
    setCurrentUserState(updatedUser);
  };

  const setCurrentUser = (user: User) => setCurrentUserState(user);
  const setSelectedProperty = (prop: Property) => setSelectedPropertyState(prop);

  const updateSettings = (newSettings: Partial<HotelSettings>) => {
    setSettingsState(prev => {
      const updated = { ...prev, ...newSettings };
      addAuditLog('Settings Updated', 'HotelSettings', 'CONFIG', 'Hotel settings updated by ' + currentUser.name);
      return updated;
    });
  };

  // 1. Create Reservation with validation & double-booking prevention
  const createReservation = (data: Partial<Reservation>): { success: boolean; message?: string; reservation?: Reservation } => {
    if (!data.guestName || !data.checkIn || !data.checkOut || !data.roomId || !data.roomTypeId) {
      return { success: false, message: 'Please complete all required fields.' };
    }

    if (new Date(data.checkIn) >= new Date(data.checkOut)) {
      return { success: false, message: 'Check-out date must be strictly after check-in date.' };
    }

    const room = rooms.find(r => r.id === data.roomId);
    if (!room) {
      return { success: false, message: 'Selected room not found.' };
    }

    if (room.status === 'Out of Service' || room.status === 'Maintenance') {
      return { success: false, message: `Room ${room.number} is currently ${room.status} and cannot be booked.` };
    }

    // Check overlapping reservations for this specific room
    const targetStart = new Date(data.checkIn).getTime();
    const targetEnd = new Date(data.checkOut).getTime();

    const conflict = reservations.some(res => {
      if (res.roomId !== data.roomId || res.status === 'Cancelled' || res.status === 'Checked-out') {
        return false;
      }
      const existingStart = new Date(res.checkIn).getTime();
      const existingEnd = new Date(res.checkOut).getTime();
      return (targetStart < existingEnd && targetEnd > existingStart);
    });

    if (conflict) {
      return { success: false, message: `Room ${room.number} is already booked for these selected dates. Please select another room or change dates.` };
    }

    // Create or find guest
    let guest = guests.find(g => g.name.toLowerCase() === data.guestName?.toLowerCase() || g.email === data.guestEmail);
    if (!guest) {
      guest = {
        id: `GST-${1000 + guests.length + 1}`,
        name: data.guestName,
        email: data.guestEmail || `${data.guestName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phone: data.guestPhone || '+1 (555) 000-0000',
        guestType: 'First-time',
        nationality: 'United States',
        totalStays: 1,
        lastVisit: data.checkIn,
        totalSpending: data.totalAmount || 0,
        preferences: { specialRequests: data.specialRequests || '' },
        notes: [],
        activityHistory: [{ id: `ACT-${Date.now()}`, action: 'Created reservation', timestamp: new Date().toISOString().substring(0, 16) }],
        createdAt: new Date().toISOString().substring(0, 10),
      };
      setGuests(prev => [guest!, ...prev]);
    } else {
      setGuests(prev => prev.map(g => g.id === guest!.id ? {
        ...g,
        totalStays: g.totalStays + 1,
        totalSpending: g.totalSpending + (data.totalAmount || 0),
        lastVisit: data.checkIn!,
        activityHistory: [{ id: `ACT-${Date.now()}`, action: 'Created new reservation', timestamp: new Date().toISOString().substring(0, 16) }, ...g.activityHistory]
      } : g));
    }

    const resId = `RES-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newRes: Reservation = {
      id: resId,
      guestId: guest.id,
      guestName: guest.name,
      guestEmail: data.guestEmail || guest.email,
      guestPhone: data.guestPhone || guest.phone,
      roomTypeId: data.roomTypeId,
      roomTypeName: data.roomTypeName || room.typeName,
      roomId: room.id,
      roomNumber: room.number,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      adults: data.adults || 1,
      children: data.children || 0,
      bookingSource: data.bookingSource || 'Direct',
      ratePlan: data.ratePlan || 'Standard Flexible Rate',
      nightlyRate: data.nightlyRate || room.nightlyRate,
      totalNights: data.totalNights || 1,
      subtotal: data.subtotal || (room.nightlyRate * (data.totalNights || 1)),
      taxes: data.taxes || 0,
      discount: data.discount || 0,
      totalAmount: data.totalAmount || 0,
      depositAmount: data.depositAmount || 0,
      paymentStatus: data.paymentStatus || 'Pending',
      status: data.status || 'Confirmed',
      specialRequests: data.specialRequests || '',
      createdAt: nowStr,
      updatedAt: nowStr,
    };

    setReservations(prev => [newRes, ...prev]);

    // Update room status if starting today
    const todayStr = new Date().toISOString().substring(0, 10);
    if (newRes.checkIn === todayStr) {
      setRooms(prev => prev.map(r => r.id === room.id ? {
        ...r,
        status: 'Reserved',
        currentGuestId: guest!.id,
        currentGuestName: guest!.name,
        currentReservationId: newRes.id,
      } : r));
    }

    // Generate Invoice
    const invoiceNum = `INV-${new Date().getFullYear()}-${String(invoices.length + 350).padStart(4, '0')}`;
    const newInvoice: Invoice = {
      id: `INV-${Date.now()}`,
      invoiceNumber: invoiceNum,
      reservationId: newRes.id,
      guestId: guest.id,
      guestName: guest.name,
      guestEmail: guest.email,
      guestPhone: guest.phone,
      issueDate: todayStr,
      dueDate: newRes.checkOut,
      items: [
        {
          id: '1',
          description: `${room.typeName} Accommodation (${newRes.totalNights} Nights @ $${newRes.nightlyRate})`,
          quantity: newRes.totalNights,
          unitPrice: newRes.nightlyRate,
          amount: newRes.subtotal,
        }
      ],
      subtotal: newRes.subtotal,
      taxes: newRes.taxes,
      discount: newRes.discount,
      total: newRes.totalAmount,
      amountPaid: newRes.depositAmount,
      balanceDue: Math.max(0, newRes.totalAmount - newRes.depositAmount),
      status: newRes.depositAmount >= newRes.totalAmount ? 'Paid' : newRes.depositAmount > 0 ? 'Issued' : 'Issued',
      notes: 'Auto-generated reservation invoice.',
    };
    setInvoices(prev => [newInvoice, ...prev]);

    // Create Calendar Event
    const calEvent: CalendarEvent = {
      id: `EVT-${Date.now()}`,
      title: `Check-in: ${newRes.guestName} (Room ${newRes.roomNumber})`,
      category: 'Guest Check-in',
      startDate: newRes.checkIn,
      endDate: newRes.checkIn,
      startTime: '15:00',
      endTime: '16:00',
      allDay: false,
      relatedId: newRes.id,
      guestName: newRes.guestName,
      roomNumber: newRes.roomNumber,
      notes: newRes.specialRequests,
      status: 'Scheduled',
    };
    setCalendarEvents(prev => [...prev, calEvent]);

    addAuditLog('Reservation Created', 'Reservation', resId, `New reservation for ${newRes.guestName} in Room ${newRes.roomNumber} (${newRes.checkIn} to ${newRes.checkOut})`);

    return { success: true, reservation: newRes, message: 'Reservation created successfully!' };
  };

  const updateReservation = (id: string, updates: Partial<Reservation>) => {
    setReservations(prev => prev.map(res => res.id === id ? { ...res, ...updates, updatedAt: new Date().toISOString().substring(0, 16) } : res));
    addAuditLog('Reservation Updated', 'Reservation', id, `Updated reservation details for ${id}`);
  };

  // 2. Check In
  const checkInReservation = (id: string): { success: boolean; message: string } => {
    const res = reservations.find(r => r.id === id);
    if (!res) return { success: false, message: 'Reservation not found.' };

    const room = rooms.find(r => r.id === res.roomId);
    if (!room) return { success: false, message: 'Assigned room not found.' };

    if (room.status === 'Dirty' || room.status === 'Cleaning') {
      return { success: false, message: `Room ${room.number} is currently ${room.status}. Housekeeping must clean and inspect the room before check-in.` };
    }

    if (room.status === 'Maintenance' || room.status === 'Out of Service') {
      return { success: false, message: `Room ${room.number} is under ${room.status}. Please reassign to an available clean room.` };
    }

    // Update reservation
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'Checked-in', updatedAt: new Date().toISOString().substring(0, 16) } : r));

    // Update room
    setRooms(prev => prev.map(r => r.id === room.id ? {
      ...r,
      status: 'Occupied',
      currentGuestId: res.guestId,
      currentGuestName: res.guestName,
      currentReservationId: res.id,
    } : r));

    // Update guest activity
    setGuests(prev => prev.map(g => g.id === res.guestId ? {
      ...g,
      activityHistory: [{ id: `ACT-${Date.now()}`, action: `Checked in to Room ${room.number}`, timestamp: new Date().toISOString().substring(0, 16) }, ...g.activityHistory]
    } : g));

    addAuditLog('Guest Checked In', 'Reservation', id, `${res.guestName} checked in to Room ${room.number}`);
    return { success: true, message: `Successfully checked in ${res.guestName} to Room ${room.number}.` };
  };

  // 3. Check Out -> triggers Housekeeping turnover task & marks room Dirty
  const checkOutReservation = (id: string): { success: boolean; message: string } => {
    const res = reservations.find(r => r.id === id);
    if (!res) return { success: false, message: 'Reservation not found.' };

    const room = rooms.find(r => r.id === res.roomId);
    if (!room) return { success: false, message: 'Room not found.' };

    // Update reservation
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'Checked-out', updatedAt: new Date().toISOString().substring(0, 16) } : r));

    // Mark room dirty and clear current guest
    setRooms(prev => prev.map(r => r.id === room.id ? {
      ...r,
      status: 'Dirty',
      housekeepingStatus: 'Dirty',
      currentGuestId: undefined,
      currentGuestName: undefined,
      currentReservationId: undefined,
      notes: `Checked out on ${new Date().toISOString().substring(0, 10)}. Ready for turnover clean.`,
    } : r));

    // Auto-generate housekeeping turnover task
    const houseStaff = staff.find(s => s.role === 'Housekeeping Staff') || staff[0];
    const taskId = `TSK-${Math.floor(500 + housekeepingTasks.length + 1)}`;
    const newTask: HousekeepingTask = {
      id: taskId,
      roomId: room.id,
      roomNumber: room.number,
      roomType: room.typeName,
      taskType: 'Checkout Turnover',
      priority: 'High',
      assignedStaffId: houseStaff.id,
      assignedStaffName: houseStaff.name,
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      dueTime: new Date(Date.now() + 3 * 3600 * 1000).toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending',
      notes: `Checkout turnover after ${res.guestName} departure. Complete sanitization & linen change.`,
      checklist: [
        { item: 'Strip and replace all linens and duvet covers', done: false },
        { item: 'Disinfect high-touch bathroom surfaces & polish chrome', done: false },
        { item: 'Vacuum carpets and mop hard flooring', done: false },
        { item: 'Replenish bath towels, bathrobes, and luxury toiletries', done: false },
        { item: 'Restock minibar & coffee supplies', done: false },
      ]
    };
    setHousekeepingTasks(prev => [newTask, ...prev]);

    // Update guest activity
    setGuests(prev => prev.map(g => g.id === res.guestId ? {
      ...g,
      activityHistory: [{ id: `ACT-${Date.now()}`, action: `Checked out of Room ${room.number}`, timestamp: new Date().toISOString().substring(0, 16) }, ...g.activityHistory]
    } : g));

    addAuditLog('Guest Checked Out', 'Reservation', id, `${res.guestName} checked out of Room ${room.number}. Turnover task ${taskId} assigned.`);
    return { success: true, message: `Checked out ${res.guestName}. Room ${room.number} marked Dirty and housekeeping turnover task generated.` };
  };

  // 4. Cancel Reservation
  const cancelReservation = (id: string, reason: string): { success: boolean; message: string } => {
    const res = reservations.find(r => r.id === id);
    if (!res) return { success: false, message: 'Reservation not found.' };

    setReservations(prev => prev.map(r => r.id === id ? {
      ...r,
      status: 'Cancelled',
      cancellationReason: reason,
      updatedAt: new Date().toISOString().substring(0, 16),
    } : r));

    // Release room if it was reserved
    const room = rooms.find(r => r.id === res.roomId);
    if (room && (room.status === 'Reserved' || room.currentReservationId === res.id)) {
      setRooms(prev => prev.map(r => r.id === room.id ? {
        ...r,
        status: 'Available',
        currentGuestId: undefined,
        currentGuestName: undefined,
        currentReservationId: undefined,
      } : r));
    }

    // Cancel related invoice
    setInvoices(prev => prev.map(inv => inv.reservationId === res.id ? { ...inv, status: 'Cancelled' } : inv));

    addAuditLog('Reservation Cancelled', 'Reservation', id, `Cancelled reservation for ${res.guestName}. Reason: ${reason}`);
    return { success: true, message: `Reservation ${id} has been cancelled.` };
  };

  // 5. Change Room
  const changeReservationRoom = (resId: string, newRoomId: string): { success: boolean; message: string } => {
    const res = reservations.find(r => r.id === resId);
    if (!res) return { success: false, message: 'Reservation not found.' };

    const newRoom = rooms.find(r => r.id === newRoomId);
    if (!newRoom) return { success: false, message: 'Target room not found.' };

    if (newRoom.status !== 'Available') {
      return { success: false, message: `Room ${newRoom.number} is currently ${newRoom.status}. Choose an Available room.` };
    }

    const oldRoomId = res.roomId;

    // Free old room
    setRooms(prev => prev.map(r => {
      if (r.id === oldRoomId) {
        return { ...r, status: 'Available', currentGuestId: undefined, currentGuestName: undefined, currentReservationId: undefined };
      }
      if (r.id === newRoomId) {
        return {
          ...r,
          status: res.status === 'Checked-in' ? 'Occupied' : 'Reserved',
          currentGuestId: res.guestId,
          currentGuestName: res.guestName,
          currentReservationId: res.id,
        };
      }
      return r;
    }));

    setReservations(prev => prev.map(r => r.id === resId ? {
      ...r,
      roomId: newRoom.id,
      roomNumber: newRoom.number,
      roomTypeId: newRoom.typeId,
      roomTypeName: newRoom.typeName,
      updatedAt: new Date().toISOString().substring(0, 16),
    } : r));

    addAuditLog('Room Changed', 'Reservation', resId, `Changed room from ${res.roomNumber} to ${newRoom.number} for ${res.guestName}`);
    return { success: true, message: `Room successfully changed to ${newRoom.number}.` };
  };

  // 6. Extend Stay
  const extendStay = (resId: string, newCheckOut: string): { success: boolean; message: string } => {
    const res = reservations.find(r => r.id === resId);
    if (!res) return { success: false, message: 'Reservation not found.' };

    if (new Date(newCheckOut) <= new Date(res.checkIn)) {
      return { success: false, message: 'New check-out date must be after check-in date.' };
    }

    const start = new Date(res.checkIn).getTime();
    const end = new Date(newCheckOut).getTime();
    const nights = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
    const newSubtotal = nights * res.nightlyRate;
    const newTaxes = Number((newSubtotal * (settings.taxRatePercent / 100)).toFixed(2));
    const newTotal = newSubtotal + newTaxes - res.discount;

    setReservations(prev => prev.map(r => r.id === resId ? {
      ...r,
      checkOut: newCheckOut,
      totalNights: nights,
      subtotal: newSubtotal,
      taxes: newTaxes,
      totalAmount: newTotal,
      updatedAt: new Date().toISOString().substring(0, 16),
    } : r));

    // Update invoice balance
    setInvoices(prev => prev.map(inv => inv.reservationId === resId ? {
      ...inv,
      dueDate: newCheckOut,
      subtotal: newSubtotal,
      taxes: newTaxes,
      total: newTotal,
      balanceDue: Math.max(0, newTotal - inv.amountPaid),
      status: inv.amountPaid >= newTotal ? 'Paid' : 'Issued',
    } : inv));

    addAuditLog('Stay Extended', 'Reservation', resId, `Stay extended to ${newCheckOut} (${nights} nights total). New total: $${newTotal}`);
    return { success: true, message: `Stay extended to ${newCheckOut}. Total nights: ${nights}.` };
  };

  // Guests
  const addGuest = (guestData: Omit<Guest, 'id' | 'createdAt' | 'activityHistory' | 'notes'>): Guest => {
    const newGuest: Guest = {
      ...guestData,
      id: `GST-${1000 + guests.length + 1}`,
      notes: [],
      activityHistory: [{ id: `ACT-${Date.now()}`, action: 'Guest profile created', timestamp: new Date().toISOString().substring(0, 16) }],
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setGuests(prev => [newGuest, ...prev]);
    addAuditLog('Guest Created', 'Guest', newGuest.id, `Created profile for ${newGuest.name}`);
    return newGuest;
  };

  const updateGuest = (id: string, updates: Partial<Guest>) => {
    setGuests(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    addAuditLog('Guest Updated', 'Guest', id, `Updated guest profile for ${id}`);
  };

  const addGuestNote = (guestId: string, noteText: string) => {
    const newNote = {
      id: `GN-${Date.now()}`,
      author: currentUser.name,
      text: noteText,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setGuests(prev => prev.map(g => g.id === guestId ? { ...g, notes: [newNote, ...g.notes] } : g));
  };

  // Rooms & Housekeeping
  const addRoom = (roomData: Omit<Room, 'id'>) => {
    const newRoom: Room = {
      ...roomData,
      id: `RM-${roomData.number}`,
    };
    setRooms(prev => [...prev, newRoom]);
    addAuditLog('Room Added', 'Room', newRoom.id, `Added room ${newRoom.number} (${newRoom.typeName})`);
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    addAuditLog('Room Updated', 'Room', id, `Updated room details for ${id}`);
  };

  const changeRoomStatus = (roomId: string, newStatus: RoomStatus) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
    addAuditLog('Room Status Changed', 'Room', roomId, `Status set to ${newStatus}`);
  };

  const createMaintenanceRequest = (roomId: string, issue: string, priority: 'High' | 'Medium' | 'Low') => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    setRooms(prev => prev.map(r => r.id === roomId ? {
      ...r,
      status: 'Maintenance',
      maintenanceStatus: 'In Progress',
      notes: issue,
    } : r));

    const maintStaff = staff.find(s => s.role === 'Maintenance Staff') || staff[0];
    const calEvt: CalendarEvent = {
      id: `EVT-MNT-${Date.now()}`,
      title: `Maintenance: Room ${room.number} (${issue})`,
      category: 'Maintenance Task',
      startDate: new Date().toISOString().substring(0, 10),
      endDate: new Date().toISOString().substring(0, 10),
      allDay: false,
      startTime: '10:00',
      endTime: '12:00',
      roomNumber: room.number,
      notes: `Reported issue: ${issue}. Assigned to ${maintStaff.name}. Priority: ${priority}`,
      status: 'In Progress',
    };
    setCalendarEvents(prev => [...prev, calEvt]);

    addAuditLog('Maintenance Logged', 'Room', roomId, `Room ${room.number} put in Maintenance: ${issue}`);
  };

  const createHousekeepingTask = (taskData: Omit<HousekeepingTask, 'id' | 'createdTime'>) => {
    const newTask: HousekeepingTask = {
      ...taskData,
      id: `TSK-${Math.floor(500 + housekeepingTasks.length + 1)}`,
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setHousekeepingTasks(prev => [newTask, ...prev]);
    addAuditLog('Task Created', 'Housekeeping', newTask.id, `Created ${newTask.taskType} task for Room ${newTask.roomNumber}`);
  };

  const updateHousekeepingTask = (id: string, updates: Partial<HousekeepingTask>) => {
    setHousekeepingTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  // Satisfies Requirement 9: "When a room is marked clean, do not automatically make it available if inspection is required."
  const markRoomCleaned = (roomId: string, taskId?: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Update housekeeping tasks for this room
    setHousekeepingTasks(prev => prev.map(t => {
      if (taskId ? t.id === taskId : t.roomId === roomId) {
        return {
          ...t,
          status: settings.inspectionRequired ? 'Awaiting Inspection' : 'Completed',
          completedTime: settings.inspectionRequired ? undefined : nowStr,
        };
      }
      return t;
    }));

    if (settings.inspectionRequired) {
      // Room goes to Inspected / Awaiting Inspection state
      setRooms(prev => prev.map(r => r.id === roomId ? {
        ...r,
        status: 'Inspected',
        housekeepingStatus: 'Awaiting Inspection',
        lastCleaned: nowStr,
      } : r));
      addAuditLog('Room Cleaned', 'Room', roomId, `Room ${room.number} marked cleaned. Awaiting supervisor inspection.`);
    } else {
      // Room directly becomes available
      setRooms(prev => prev.map(r => r.id === roomId ? {
        ...r,
        status: 'Available',
        housekeepingStatus: 'Clean',
        lastCleaned: nowStr,
      } : r));
      addAuditLog('Room Cleaned', 'Room', roomId, `Room ${room.number} marked clean and available.`);
    }
  };

  const approveInspection = (roomId: string, taskId?: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setHousekeepingTasks(prev => prev.map(t => {
      if (taskId ? t.id === taskId : t.roomId === roomId) {
        return { ...t, status: 'Completed', completedTime: nowStr };
      }
      return t;
    }));

    // Check if there is an incoming check-in today for this room
    const today = new Date().toISOString().substring(0, 10);
    const hasIncomingToday = reservations.some(res => res.roomId === roomId && res.checkIn === today && res.status === 'Confirmed');

    setRooms(prev => prev.map(r => r.id === roomId ? {
      ...r,
      status: hasIncomingToday ? 'Reserved' : 'Available',
      housekeepingStatus: 'Clean',
      lastCleaned: nowStr,
    } : r));

    addAuditLog('Inspection Approved', 'Room', roomId, `Inspection approved for Room ${room.number}. Ready for guests.`);
  };

  // Inventory Management
  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'lastRestocked'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `INV-ITM-${String(inventory.length + 1).padStart(2, '0')}`,
      lastRestocked: new Date().toISOString().substring(0, 10),
    };
    setInventory(prev => [...prev, newItem]);
    addAuditLog('Inventory Added', 'Inventory', newItem.id, `Added item ${newItem.name}`);
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const stockInInventory = (itemId: string, qty: number, reason: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    const previousQty = item.currentQuantity;
    const newQty = previousQty + qty;
    const status = newQty <= 0 ? 'Out of Stock' : newQty <= item.minimumStock ? 'Low Stock' : 'In Stock';

    setInventory(prev => prev.map(i => i.id === itemId ? {
      ...i,
      currentQuantity: newQty,
      status,
      lastRestocked: new Date().toISOString().substring(0, 10),
    } : i));

    const movement: StockMovement = {
      id: `MOV-${Date.now()}`,
      itemId,
      itemName: item.name,
      type: 'Stock In',
      quantity: qty,
      previousQty,
      newQty,
      reason,
      staffName: currentUser.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setStockMovements(prev => [movement, ...prev]);
    addAuditLog('Stock In', 'Inventory', itemId, `Added ${qty} ${item.unit} to ${item.name} (${reason})`);
  };

  const stockOutInventory = (itemId: string, qty: number, reason: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    const previousQty = item.currentQuantity;
    const newQty = Math.max(0, previousQty - qty);
    const status = newQty <= 0 ? 'Out of Stock' : newQty <= item.minimumStock ? 'Low Stock' : 'In Stock';

    setInventory(prev => prev.map(i => i.id === itemId ? {
      ...i,
      currentQuantity: newQty,
      status,
    } : i));

    const movement: StockMovement = {
      id: `MOV-${Date.now()}`,
      itemId,
      itemName: item.name,
      type: 'Stock Out',
      quantity: qty,
      previousQty,
      newQty,
      reason,
      staffName: currentUser.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setStockMovements(prev => [movement, ...prev]);
    addAuditLog('Stock Out', 'Inventory', itemId, `Deducted ${qty} ${item.unit} from ${item.name} (${reason})`);
  };

  const stockAdjustInventory = (itemId: string, newQty: number, reason: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    const previousQty = item.currentQuantity;
    const status = newQty <= 0 ? 'Out of Stock' : newQty <= item.minimumStock ? 'Low Stock' : 'In Stock';

    setInventory(prev => prev.map(i => i.id === itemId ? {
      ...i,
      currentQuantity: newQty,
      status,
    } : i));

    const movement: StockMovement = {
      id: `MOV-${Date.now()}`,
      itemId,
      itemName: item.name,
      type: 'Adjustment',
      quantity: Math.abs(newQty - previousQty),
      previousQty,
      newQty,
      reason,
      staffName: currentUser.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setStockMovements(prev => [movement, ...prev]);
    addAuditLog('Stock Adjusted', 'Inventory', itemId, `Adjusted ${item.name} from ${previousQty} to ${newQty}`);
  };

  // Invoices & Payments
  const createInvoice = (data: Omit<Invoice, 'id' | 'invoiceNumber'>): Invoice => {
    const invoiceNum = `INV-${new Date().getFullYear()}-${String(invoices.length + 351).padStart(4, '0')}`;
    const newInvoice: Invoice = {
      ...data,
      id: `INV-${Date.now()}`,
      invoiceNumber: invoiceNum,
    };
    setInvoices(prev => [newInvoice, ...prev]);
    addAuditLog('Invoice Created', 'Invoice', newInvoice.id, `Created invoice ${invoiceNum} for ${newInvoice.guestName} ($${newInvoice.total})`);
    return newInvoice;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, ...updates } : inv));
  };

  // Satisfies Requirement 11: "Mark as Paid only after a payment has been recorded successfully"
  const recordPayment = (invoiceId: string, amount: number, method: 'Credit Card' | 'Bank Transfer' | 'Cash' | 'Stripe / Online'): { success: boolean; message: string } => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return { success: false, message: 'Invoice not found.' };

    if (amount <= 0) return { success: false, message: 'Payment amount must be greater than zero.' };

    const newAmountPaid = inv.amountPaid + amount;
    const newBalance = Math.max(0, inv.total - newAmountPaid);
    const newStatus: Invoice['status'] = newBalance === 0 ? 'Paid' : 'Issued';

    setInvoices(prev => prev.map(i => i.id === invoiceId ? {
      ...i,
      amountPaid: newAmountPaid,
      balanceDue: newBalance,
      status: newStatus,
      paymentMethod: method,
    } : i));

    // Record payment receipt
    const payRecord: PaymentRecord = {
      id: `PAY-${Date.now()}`,
      invoiceId,
      reservationId: inv.reservationId,
      guestName: inv.guestName,
      amount,
      method,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      referenceNumber: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'Completed',
    };
    setPayments(prev => [payRecord, ...prev]);

    // Update reservation payment status
    setReservations(prev => prev.map(res => {
      if (res.id === inv.reservationId) {
        return {
          ...res,
          depositAmount: (res.depositAmount || 0) + amount,
          paymentStatus: newBalance === 0 ? 'Paid' : 'Partial',
        };
      }
      return res;
    }));

    addAuditLog('Payment Recorded', 'Invoice', inv.invoiceNumber, `Recorded $${amount.toFixed(2)} payment via ${method}. Remaining balance: $${newBalance.toFixed(2)}`);
    return {
      success: true,
      message: `Payment of $${amount.toFixed(2)} recorded successfully. ${newBalance === 0 ? 'Invoice is now fully Paid.' : `Remaining balance: $${newBalance.toFixed(2)}`}`
    };
  };

  // Campaigns
  const createCampaign = (camp: Omit<Campaign, 'id' | 'sentCount' | 'openedCount' | 'clickedCount' | 'convertedRevenue'>) => {
    const newCamp: Campaign = {
      ...camp,
      id: `CMP-${String(campaigns.length + 1).padStart(2, '0')}`,
      sentCount: 0,
      openedCount: 0,
      clickedCount: 0,
      convertedRevenue: 0,
    };
    setCampaigns(prev => [newCamp, ...prev]);
    addAuditLog('Campaign Created', 'Campaign', newCamp.id, `Created campaign: ${newCamp.name}`);
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const sendCampaignSimulation = (id: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const simulatedRecipients = Math.floor(800 + Math.random() * 1500);
        const openRate = 0.55 + Math.random() * 0.2;
        const opened = Math.round(simulatedRecipients * openRate);
        const clicked = Math.round(opened * 0.4);
        const converted = Math.round(clicked * 120);

        return {
          ...c,
          status: 'Active',
          sentCount: c.sentCount + simulatedRecipients,
          openedCount: c.openedCount + opened,
          clickedCount: c.clickedCount + clicked,
          convertedRevenue: c.convertedRevenue + converted,
        };
      }
      return c;
    }));
    addAuditLog('Campaign Dispatched', 'Campaign', id, 'Simulated blast sent to target guest segment.');
  };

  // Inbox & Guest Communication
  const sendInboxMessage = (msg: Omit<InboxMessage, 'id' | 'timestamp' | 'unread' | 'starred'>) => {
    const newMsg: InboxMessage = {
      ...msg,
      id: `MSG-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      unread: false,
      starred: false,
    };
    setInboxMessages(prev => [newMsg, ...prev]);
    addAuditLog('Message Sent', 'Inbox', newMsg.id, `Sent message to ${newMsg.recipient}: ${newMsg.subject}`);
  };

  const replyInboxMessage = (msgId: string, replyText: string) => {
    const orig = inboxMessages.find(m => m.id === msgId);
    if (!orig) return;

    const replyMsg: InboxMessage = {
      id: `MSG-${Date.now()}`,
      folder: 'sent',
      category: orig.category,
      senderName: currentUser.name,
      senderEmail: currentUser.email,
      senderAvatar: currentUser.avatar,
      recipient: orig.senderName,
      subject: `Re: ${orig.subject}`,
      preview: replyText.substring(0, 90) + '...',
      body: replyText,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      unread: false,
      starred: false,
      reservationId: orig.reservationId,
      roomId: orig.roomId,
    };

    setInboxMessages(prev => [replyMsg, ...prev]);
    addAuditLog('Replied to Message', 'Inbox', msgId, `Replied to ${orig.senderName}`);
  };

  const toggleStarMessage = (id: string) => {
    setInboxMessages(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m));
  };

  const markMessageRead = (id: string, unread: boolean) => {
    setInboxMessages(prev => prev.map(m => m.id === id ? { ...m, unread } : m));
  };

  const deleteMessage = (id: string) => {
    setInboxMessages(prev => prev.map(m => {
      if (m.id === id) {
        if (m.folder === 'trash') {
          return null as any;
        }
        return { ...m, folder: 'trash' };
      }
      return m;
    }).filter(Boolean));
    addAuditLog('Message Deleted', 'Inbox', id, `Moved message ${id} to Trash`);
  };

  // Calendar
  const createCalendarEvent = (evt: Omit<CalendarEvent, 'id'>) => {
    const newEvt: CalendarEvent = {
      ...evt,
      id: `EVT-${Date.now()}`,
    };
    setCalendarEvents(prev => [...prev, newEvt]);
    addAuditLog('Calendar Event Created', 'Calendar', newEvt.id, `Scheduled: ${newEvt.title}`);
  };

  const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
  };

  // Reviews
  const respondToReview = (id: string, response: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, staffResponse: response, status: 'Published' } : r));
    addAuditLog('Review Responded', 'Review', id, `Staff replied to review from guest`);
  };

  const updateReviewStatus = (id: string, status: Review['status'], note?: string) => {
    setReviews(prev => prev.map(r => r.id === id ? {
      ...r,
      status,
      internalNote: note !== undefined ? note : r.internalNote,
    } : r));
  };

  // Staff
  const addStaffMember = (member: Omit<StaffMember, 'id' | 'joinedDate'>) => {
    const newStaff: StaffMember = {
      ...member,
      id: `USR-${String(staff.length + 1).padStart(2, '0')}`,
      joinedDate: new Date().toISOString().substring(0, 10),
    };
    setStaff(prev => [...prev, newStaff]);
    addAuditLog('Staff Added', 'Staff', newStaff.id, `Added staff member ${newStaff.name} as ${newStaff.role}`);
  };

  const updateStaffMember = (id: string, updates: Partial<StaffMember>) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // Reset to original seed
  const resetDemoData = () => {
    localStorage.clear();
    setReservations(INITIAL_RESERVATIONS);
    setGuests(INITIAL_GUESTS);
    setRooms(INITIAL_ROOMS);
    setHousekeepingTasks(INITIAL_HOUSEKEEPING_TASKS);
    setInventory(INITIAL_INVENTORY);
    setStockMovements(INITIAL_STOCK_MOVEMENTS);
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    setReviews(INITIAL_REVIEWS);
    setCampaigns(INITIAL_CAMPAIGNS);
    setInboxMessages(INITIAL_INBOX_MESSAGES);
    setCalendarEvents(INITIAL_CALENDAR_EVENTS);
    setStaff(INITIAL_STAFF);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSettingsState(INITIAL_SETTINGS);
    setCurrentUserState(CURRENT_USER);
    setSelectedPropertyState(INITIAL_PROPERTIES[0]);
    addAuditLog('System Reset', 'System', 'ALL', 'Reset all demo data to default clean state.');
  };

  return (
    <HotelContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        selectedProperty,
        setSelectedProperty,
        properties,
        settings,
        updateSettings,
        dateRange,
        setDateRange,
        searchQuery,
        setSearchQuery,
        activeTab,
        setActiveTab,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,
        reservations,
        guests,
        rooms,
        roomTypes,
        housekeepingTasks,
        inventory,
        stockMovements,
        invoices,
        payments,
        reviews,
        campaigns,
        inboxMessages,
        calendarEvents,
        staff,
        auditLogs,
        createReservation,
        updateReservation,
        checkInReservation,
        checkOutReservation,
        cancelReservation,
        changeReservationRoom,
        extendStay,
        addGuest,
        updateGuest,
        addGuestNote,
        addRoom,
        updateRoom,
        changeRoomStatus,
        createMaintenanceRequest,
        createHousekeepingTask,
        updateHousekeepingTask,
        markRoomCleaned,
        approveInspection,
        addInventoryItem,
        updateInventoryItem,
        stockInInventory,
        stockOutInventory,
        stockAdjustInventory,
        createInvoice,
        updateInvoice,
        recordPayment,
        createCampaign,
        updateCampaign,
        sendCampaignSimulation,
        sendInboxMessage,
        replyInboxMessage,
        toggleStarMessage,
        markMessageRead,
        deleteMessage,
        createCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        respondToReview,
        updateReviewStatus,
        addStaffMember,
        updateStaffMember,
        resetDemoData,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
