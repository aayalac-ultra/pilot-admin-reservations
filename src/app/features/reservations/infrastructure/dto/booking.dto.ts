// DTO que viene del API REST
export interface BookingDto {
  id: string;
  pnr: string; // Código interno de reserva
  externalReference?: string; // Referencia del proveedor

  // Información básica
  createdAt: string; // Como string desde API
  updatedAt: string; // Como string desde API
  expiresAt?: string; // Como string desde API

  // Personas involucradas
  buyer: BuyerDto;
  travelers: TravelerDto[];

  // Producto y detalles
  product: BookingProductDto;

  // Estados
  status: BookingStatusDto;
  paymentStatus: PaymentStatusDto;

  // Información comercial
  marketplace: {
    id: string;
    name: string;
    agency: string;
  };

  // Precios y pagos
  pricing: {
    baseAmount: number;
    taxes: number;
    fees: number;
    discounts: number;
    totalAmount: number;
    currency: string;
    exchangeRate?: number;
    originalCurrency?: string;
  };

  payments: PaymentTransactionDto[];

  // Metadatos técnicos
  metadata: {
    source: 'web' | 'mobile' | 'api' | 'call_center';
    userAgent?: string;
    ipAddress?: string;
    sessionId?: string;
    searchId?: string;
    campaignId?: string;
    affiliateId?: string;
  };

  // Gestión operacional
  internalComments: InternalCommentDto[];
  supportTickets: SupportTicketDto[];
  auditEvents: BookingAuditEventDto[];
  statusHistory: StatusHistoryDto[];

  // Configuración
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };

  // Información adicional
  specialRequests?: string[];
  tags?: string[];
  priority?: 'low' | 'normal' | 'high' | 'urgent';

  // Relaciones
  parentBookingId?: string;
  childBookingIds?: string[];

  // Cancelación y reembolsos
  cancellation?: {
    requestedAt: string; // Como string desde API
    processedAt?: string; // Como string desde API
    reason: string;
    refundAmount?: number;
    refundStatus?: 'pending' | 'processed' | 'rejected';
    cancellationFee?: number;
  };
}

// DTOs auxiliares
export interface BuyerDto {
  name: string;
  email: string;
  phone: string;
  document: string;
  documentType: string;
}

export interface TravelerDto {
  name: string;
  email: string;
  document: string;
  documentType: string;
  dateOfBirth: string;
  gender: string;
  type: string;
  isMainTraveler: boolean;
}

export interface BookingProductDto {
  type: string;
  name: string;
  provider: string;
  providerReference: string;
  details: any; // Dependiente del tipo de producto
}

export interface PaymentTransactionDto {
  id: string;
  provider: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  processedAt: string; // Como string desde API
}

export interface InternalCommentDto {
  id: string;
  content: string;
  author: string;
  createdAt: string; // Como string desde API
}

export interface SupportTicketDto {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string; // Como string desde API
}

export interface BookingAuditEventDto {
  id: string;
  bookingId: string;
  eventType: string;
  timestamp: string; // Como string desde API
  author: {
    id: string;
    name: string;
    email: string;
    type: string;
  };
  description: string;
  metadata: Record<string, any>;
}

export interface StatusHistoryDto {
  id: string;
  status: string;
  timestamp: string; // Como string desde API
  reason: string;
  author: {
    id: string;
    name: string;
    type: string;
  };
}

export type BookingStatusDto = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'expired';
export type PaymentStatusDto = 'PAYMENT_PENDING' | 'PAYMENT_COMPLETED' | 'PAYMENT_FAILED' | 'REFUNDED';

// Response del API para listado paginado
export interface BookingListResponseDto {
  items: BookingDto[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  filters?: {
    applied: Record<string, any>;
    available: Record<string, any[]>;
  };
}
