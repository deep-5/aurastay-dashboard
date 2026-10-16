export type UserRole = 
  | 'Owner'
  | 'Hotel Manager'
  | 'Receptionist'
  | 'Housekeeping Staff'
  | 'Accountant'
  | 'Maintenance Staff'
  | 'Guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  propertyId: string;
  phone: string;
  department: string;
}

export interface Property {
  id: string;
  name: string;
  code: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  totalRooms: number;
  starRating: number;
}

export type BookingSource = 'Direct' | 'Booking.com' | 'Expedia' | 'Airbnb' | 'Corporate' | 'Walk-in';
export type PaymentStatus = 'Paid' | 'Pending' | 'Partial' | 'Refunded';
export type ReservationStatus = 'Confirmed' | 'Checked-in' | 'Checked-out' | 'Cancelled' | 'Pending';

export interface Reservation {
  id: string; // e.g., 'RES-2026-8941'
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomTypeId: string;
  roomTypeName: string;
  roomId: string;
  roomNumber: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  adults: number;
  children: number;
  bookingSource: BookingSource;
  ratePlan: string;
  nightlyRate: number;
  totalNights: number;
  subtotal: number;
  taxes: number;
  discount: number;
  totalAmount: number;
  depositAmount: number;
  paymentStatus: PaymentStatus;
  status: ReservationStatus;
  specialRequests?: string;
  cancellationReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type GuestType = 'VIP' | 'Regular' | 'Corporate' | 'First-time';

export interface GuestPreference {
  roomFloor?: string;
  bedPreference?: string;
  dietary?: string;
  pillowType?: string;
  specialRequests?: string;
}

export interface GuestNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface GuestActivity {
  id: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface Guest {
  id: string; // e.g. 'GST-1042'
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  guestType: GuestType;
  nationality: string;
  idNumber?: string;
  totalStays: number;
  lastVisit: string;
  totalSpending: number;
  preferences: GuestPreference;
  notes: GuestNote[];
  activityHistory: GuestActivity[];
  createdAt: string;
}

export type RoomStatus = 
  | 'Available'
  | 'Reserved'
  | 'Occupied'
  | 'Dirty'
  | 'Cleaning'
  | 'Inspected'
  | 'Maintenance'
  | 'Out of Service';

export interface RoomType {
  id: string;
  name: string;
  code: string;
  baseRate: number;
  capacity: number;
  bedType: string;
  sizeSqFt: number;
  amenities: string[];
  description: string;
  imageUrl?: string;
}

export interface Room {
  id: string;
  number: string;
  typeId: string;
  typeName: string;
  floor: number;
  capacity: number;
  bedType: string;
  nightlyRate: number;
  amenities: string[];
  status: RoomStatus;
  housekeepingStatus: 'Clean' | 'Dirty' | 'In Progress' | 'Awaiting Inspection';
  maintenanceStatus: 'None' | 'Pending' | 'In Progress' | 'Resolved';
  currentGuestId?: string;
  currentGuestName?: string;
  currentReservationId?: string;
  notes?: string;
  lastCleaned?: string;
}

export type HousekeepingTaskType = 
  | 'Checkout Turnover'
  | 'Daily Tidy'
  | 'Deep Clean'
  | 'Inspection'
  | 'Linen Change';

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type HousekeepingTaskStatus = 'Pending' | 'In Progress' | 'Awaiting Inspection' | 'Completed';

export interface HousekeepingTask {
  id: string; // e.g. 'TSK-501'
  roomId: string;
  roomNumber: string;
  roomType: string;
  taskType: HousekeepingTaskType;
  priority: TaskPriority;
  assignedStaffId: string;
  assignedStaffName: string;
  createdTime: string;
  dueTime: string;
  completedTime?: string;
  status: HousekeepingTaskStatus;
  notes?: string;
  checklist?: { item: string; done: boolean }[];
}

export type InventoryCategory = 
  | 'Toiletries'
  | 'Linens'
  | 'Cleaning Products'
  | 'Food & Beverage'
  | 'Guest Amenities'
  | 'Maintenance Tools';

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expiring Soon';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: InventoryCategory;
  currentQuantity: number;
  unit: string;
  minimumStock: number;
  unitCost: number;
  supplier: string;
  status: StockStatus;
  expiryDate?: string;
  location: string;
  lastRestocked: string;
}

export type StockMovementType = 'Stock In' | 'Stock Out' | 'Adjustment' | 'Transfer' | 'Wastage';

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: StockMovementType;
  quantity: number;
  previousQty: number;
  newQty: number;
  reason: string;
  staffName: string;
  timestamp: string;
}

export type InvoiceStatus = 'Draft' | 'Issued' | 'Paid' | 'Overdue' | 'Cancelled';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // 'INV-2026-0341'
  reservationId: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxes: number;
  discount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  status: InvoiceStatus;
  paymentMethod?: string;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  reservationId: string;
  guestName: string;
  amount: number;
  method: 'Credit Card' | 'Bank Transfer' | 'Cash' | 'Stripe / Online';
  date: string;
  referenceNumber: string;
  status: 'Completed' | 'Pending' | 'Refunded';
}

export type ReviewSource = 'Google' | 'TripAdvisor' | 'Booking.com' | 'Direct Survey';
export type ReviewStatus = 'Published' | 'Pending Review' | 'Flagged for Follow-up';

export interface Review {
  id: string;
  guestName: string;
  reservationRef: string;
  source: ReviewSource;
  rating: number; // 1 - 5
  title: string;
  comment: string;
  date: string;
  status: ReviewStatus;
  internalNote?: string;
  staffResponse?: string;
  assignedStaff?: string;
}

export type CampaignStatus = 'Active' | 'Scheduled' | 'Draft' | 'Paused' | 'Completed';

export interface Campaign {
  id: string;
  name: string;
  targetSegment: string;
  offerDetails: string;
  discountCode: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  sentCount: number;
  openedCount: number;
  clickedCount: number;
  convertedRevenue: number;
  channel: 'Email' | 'SMS' | 'Push';
}

export type MessageFolder = 'inbox' | 'starred' | 'sent' | 'drafts' | 'spam' | 'trash';
export type MessageCategory = 
  | 'Guest Inquiry'
  | 'Reservation Update'
  | 'Internal Notice'
  | 'Payment Issue'
  | 'Room Service Request';

export interface InboxMessage {
  id: string;
  folder: MessageFolder;
  category: MessageCategory;
  senderName: string;
  senderEmail: string;
  senderAvatar?: string;
  recipient: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  unread: boolean;
  starred: boolean;
  reservationId?: string;
  roomId?: string;
  isDraft?: boolean;
}

export type CalendarEventCategory = 
  | 'Guest Check-in'
  | 'Guest Check-out'
  | 'Staff Schedule'
  | 'Housekeeping Task'
  | 'Maintenance Task'
  | 'Reservation Event';

export interface CalendarEvent {
  id: string;
  title: string;
  category: CalendarEventCategory;
  startDate: string; // YYYY-MM-DD or ISO
  endDate: string;
  startTime?: string; // HH:mm
  endTime?: string;
  allDay: boolean;
  relatedId?: string; // reservationId, roomId, staffId
  guestName?: string;
  roomNumber?: string;
  notes?: string;
  status?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  shift: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  avatar: string;
  joinedDate: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  performedBy: string;
  timestamp: string;
}

export interface HotelSettings {
  hotelName: string;
  chainName: string;
  starRating: number;
  logoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  checkInTime: string;
  checkOutTime: string;
  taxRatePercent: number;
  cancellationGraceDays: number;
  inspectionRequired: boolean;
  autoAssignHousekeeping: boolean;
}
