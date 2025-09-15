// Domain models for the business logic layer

export interface ReservationBase {
  id: string;
  pnr: string;
  productType: ProductType;
  customerName: string;
  customerEmail: string;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  totalAmount: number;
  currency: string;
  marketplace: Marketplace;
  priority: Priority;
  tags: string[];
}

// Extended reservation with full details
export interface Reservation extends ReservationBase {
  buyer: Buyer;
  travelers: Traveler[];
  product: Product;
  pricing: Pricing;
  payments: PaymentTransaction[];
  metadata: ReservationMetadata;
  internalComments: InternalComment[];
  supportTickets: SupportTicket[];
  auditEvents: AuditEvent[];
  statusHistory: StatusHistory[];
  notifications: NotificationSettings;
  specialRequests?: string[];
  cancellation?: CancellationInfo;
}

// Domain types
export type ProductType = 'LOCAL_OFFER' | 'FLIGHT' | 'HOTEL';
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'EXPIRED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

// Supporting domain models
export interface Buyer {
  name: string;
  email: string;
  phone: string;
  document: string;
  documentType: string;
}

export interface Traveler {
  name: string;
  email: string;
  document: string;
  documentType: string;
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  type: string;
  isMainTraveler: boolean;
}

export interface Product {
  type: ProductType;
  name: string;
  provider: string;
  providerReference: string;
  details: ProductDetails;
}

export interface ProductDetails {
  // This will be extended based on product type
  [key: string]: any;
}

export interface Pricing {
  baseAmount: number;
  taxes: number;
  fees: number;
  discounts: number;
  totalAmount: number;
  currency: string;
  exchangeRate?: number;
  originalCurrency?: string;
}

export interface PaymentTransaction {
  id: string;
  provider: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  method: PaymentMethod;
  processedAt: Date;
}

export type PaymentMethod = 'BANK_TRANSFER' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'DIGITAL_WALLET';

export interface Marketplace {
  id: string;
  name: string;
  agency: string;
}

export interface ReservationMetadata {
  source: 'WEB' | 'MOBILE' | 'API' | 'CALL_CENTER';
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
  searchId?: string;
  campaignId?: string;
  affiliateId?: string;
}

export interface InternalComment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}

export interface SupportTicket {
  id: string;
  title: string;
  status: string;
  priority: Priority;
  createdAt: Date;
}

export interface AuditEvent {
  id: string;
  reservationId: string;
  eventType: string;
  timestamp: Date;
  author: {
    id: string;
    name: string;
    email: string;
    type: string;
  };
  description: string;
  metadata: Record<string, any>;
}

export interface StatusHistory {
  id: string;
  status: ReservationStatus;
  timestamp: Date;
  reason: string;
  author: {
    id: string;
    name: string;
    type: string;
  };
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface CancellationInfo {
  requestedAt: Date;
  processedAt?: Date;
  reason: string;
  refundAmount?: number;
  refundStatus?: 'PENDING' | 'PROCESSED' | 'REJECTED';
  cancellationFee?: number;
}

// Filters and pagination for domain layer
export interface ReservationFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  productTypes?: ProductType[];
  statuses?: ReservationStatus[];
  paymentStatuses?: PaymentStatus[];
  marketplaces?: string[];
  searchTerm?: string;
  priority?: Priority[];
  hasComments?: boolean;
  hasSupportTickets?: boolean;
}

export interface PaginationParams {
  page: number;
  size: number;
  sortBy?: keyof ReservationBase;
  sortDirection?: 'ASC' | 'DESC';
}

export interface ReservationListResult {
  items: ReservationBase[];
  pagination: {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  };
}
