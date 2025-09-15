import {
  BookingDto,
  BookingListResponseDto,
  BuyerDto,
  TravelerDto,
  PaymentTransactionDto,
  InternalCommentDto,
  SupportTicketDto,
  BookingAuditEventDto,
  StatusHistoryDto,
  BookingStatusDto,
  PaymentStatusDto
} from '../dto/booking.dto';

import {
  ReservationBase,
  Reservation,
  ReservationListResult,
  ProductType,
  ReservationStatus,
  PaymentStatus,
  Priority,
  Buyer,
  Traveler,
  Product,
  Pricing,
  PaymentTransaction,
  PaymentMethod,
  Marketplace,
  ReservationMetadata,
  InternalComment,
  SupportTicket,
  AuditEvent,
  StatusHistory,
  NotificationSettings,
  CancellationInfo
} from '@shared/domain/models/reservation-base.model';

export class BookingAdapter {

  /**
   * Converts DTO list response to domain model
   */
  static toDomainList(dto: BookingListResponseDto): ReservationListResult {
    return {
      items: dto.items.map(item => this.toReservationBase(item)),
      pagination: {
        page: dto.pagination.page,
        size: dto.pagination.pageSize,
        totalItems: dto.pagination.totalItems,
        totalPages: dto.pagination.totalPages
      }
    };
  }

  /**
   * Converts DTO to ReservationBase (for list view)
   */
  static toReservationBase(dto: BookingDto): ReservationBase {
    return {
      id: dto.id,
      pnr: dto.pnr,
      productType: this.mapProductType(dto.product.type),
      customerName: dto.buyer.name,
      customerEmail: dto.buyer.email,
      status: this.mapReservationStatus(dto.status),
      paymentStatus: this.mapPaymentStatus(dto.paymentStatus),
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      totalAmount: dto.pricing.totalAmount,
      currency: dto.pricing.currency,
      marketplace: {
        id: dto.marketplace.id,
        name: dto.marketplace.name,
        agency: dto.marketplace.agency
      },
      priority: this.mapPriority(dto.priority),
      tags: dto.tags || []
    };
  }

  /**
   * Converts DTO to full Reservation (for detail view)
   */
  static toReservation(dto: BookingDto): Reservation {
    const base = this.toReservationBase(dto);

    return {
      ...base,
      buyer: this.mapBuyer(dto.buyer),
      travelers: dto.travelers.map(t => this.mapTraveler(t)),
      product: this.mapProduct(dto.product),
      pricing: this.mapPricing(dto.pricing),
      payments: dto.payments.map(p => this.mapPaymentTransaction(p)),
      metadata: this.mapMetadata(dto.metadata),
      internalComments: dto.internalComments.map(c => this.mapInternalComment(c)),
      supportTickets: dto.supportTickets.map(t => this.mapSupportTicket(t)),
      auditEvents: dto.auditEvents.map(e => this.mapAuditEvent(e)),
      statusHistory: dto.statusHistory.map(s => this.mapStatusHistory(s)),
      notifications: dto.notifications,
      specialRequests: dto.specialRequests,
      cancellation: dto.cancellation ? this.mapCancellation(dto.cancellation) : undefined
    };
  }

  /**
   * Converts domain model back to DTO (for API requests)
   */
  static fromDomain(reservation: Partial<Reservation>): Partial<BookingDto> {
    return {
      id: reservation.id,
      buyer: reservation.buyer ? this.buyerToDto(reservation.buyer) : undefined,
      status: reservation.status ? this.reservationStatusToDto(reservation.status) : undefined,
      // Add other mappings as needed for update operations
    };
  }

  // Private mapping methods
  private static mapProductType(dtoType: string): ProductType {
    switch (dtoType.toLowerCase()) {
      case 'local_offer':
        return 'LOCAL_OFFER';
      case 'flight':
        return 'FLIGHT';
      case 'hotel':
        return 'HOTEL';
      default:
        throw new Error(`Unknown product type: ${dtoType}`);
    }
  }

  private static mapReservationStatus(dtoStatus: string): ReservationStatus {
    switch (dtoStatus.toLowerCase()) {
      case 'pending':
        return 'PENDING';
      case 'confirmed':
        return 'CONFIRMED';
      case 'cancelled':
        return 'CANCELLED';
      case 'completed':
        return 'COMPLETED';
      case 'expired':
        return 'EXPIRED';
      default:
        throw new Error(`Unknown reservation status: ${dtoStatus}`);
    }
  }

  private static mapPaymentStatus(dtoStatus: string): PaymentStatus {
    switch (dtoStatus) {
      case 'PAYMENT_PENDING':
        return 'PENDING';
      case 'PAYMENT_COMPLETED':
        return 'COMPLETED';
      case 'PAYMENT_FAILED':
        return 'FAILED';
      case 'REFUNDED':
        return 'REFUNDED';
      default:
        throw new Error(`Unknown payment status: ${dtoStatus}`);
    }
  }

  private static mapPriority(dtoPriority?: string): Priority {
    if (!dtoPriority) return 'NORMAL';

    switch (dtoPriority.toLowerCase()) {
      case 'low':
        return 'LOW';
      case 'normal':
        return 'NORMAL';
      case 'high':
        return 'HIGH';
      case 'urgent':
        return 'URGENT';
      default:
        return 'NORMAL';
    }
  }

  private static mapBuyer(dto: BuyerDto): Buyer {
    return {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      document: dto.document,
      documentType: dto.documentType
    };
  }

  private static mapTraveler(dto: TravelerDto): Traveler {
    return {
      name: dto.name,
      email: dto.email,
      document: dto.document,
      documentType: dto.documentType,
      dateOfBirth: new Date(dto.dateOfBirth),
      gender: this.mapGender(dto.gender),
      type: dto.type,
      isMainTraveler: dto.isMainTraveler
    };
  }

  private static mapGender(dtoGender: string): 'MALE' | 'FEMALE' | 'OTHER' {
    switch (dtoGender.toLowerCase()) {
      case 'male':
        return 'MALE';
      case 'female':
        return 'FEMALE';
      default:
        return 'OTHER';
    }
  }

  private static mapProduct(dto: any): Product {
    return {
      type: this.mapProductType(dto.type),
      name: dto.name,
      provider: dto.provider,
      providerReference: dto.providerReference,
      details: dto.details
    };
  }

  private static mapPricing(dto: any): Pricing {
    return {
      baseAmount: dto.baseAmount,
      taxes: dto.taxes,
      fees: dto.fees,
      discounts: dto.discounts,
      totalAmount: dto.totalAmount,
      currency: dto.currency,
      exchangeRate: dto.exchangeRate,
      originalCurrency: dto.originalCurrency
    };
  }

  private static mapPaymentTransaction(dto: PaymentTransactionDto): PaymentTransaction {
    return {
      id: dto.id,
      provider: dto.provider,
      transactionId: dto.transactionId,
      amount: dto.amount,
      currency: dto.currency,
      status: dto.status,
      method: this.mapPaymentMethod(dto.method),
      processedAt: new Date(dto.processedAt)
    };
  }

  private static mapPaymentMethod(dtoMethod: string): PaymentMethod {
    switch (dtoMethod.toLowerCase()) {
      case 'bank_transfer':
        return 'BANK_TRANSFER';
      case 'credit_card':
        return 'CREDIT_CARD';
      case 'debit_card':
        return 'DEBIT_CARD';
      default:
        return 'DIGITAL_WALLET';
    }
  }

  private static mapMetadata(dto: any): ReservationMetadata {
    return {
      source: dto.source?.toUpperCase() || 'WEB',
      userAgent: dto.userAgent,
      ipAddress: dto.ipAddress,
      sessionId: dto.sessionId,
      searchId: dto.searchId,
      campaignId: dto.campaignId,
      affiliateId: dto.affiliateId
    };
  }

  private static mapInternalComment(dto: InternalCommentDto): InternalComment {
    return {
      id: dto.id,
      content: dto.content,
      author: dto.author,
      createdAt: new Date(dto.createdAt)
    };
  }

  private static mapSupportTicket(dto: SupportTicketDto): SupportTicket {
    return {
      id: dto.id,
      title: dto.title,
      status: dto.status,
      priority: this.mapPriority(dto.priority),
      createdAt: new Date(dto.createdAt)
    };
  }

  private static mapAuditEvent(dto: any): AuditEvent {
    return {
      id: dto.id,
      reservationId: dto.bookingId,
      eventType: dto.eventType,
      timestamp: new Date(dto.timestamp),
      author: dto.author,
      description: dto.description,
      metadata: dto.metadata
    };
  }

  private static mapStatusHistory(dto: any): StatusHistory {
    return {
      id: dto.id,
      status: this.mapReservationStatus(dto.status),
      timestamp: new Date(dto.timestamp),
      reason: dto.reason,
      author: dto.author
    };
  }

  private static mapCancellation(dto: any): CancellationInfo {
    return {
      requestedAt: new Date(dto.requestedAt),
      processedAt: dto.processedAt ? new Date(dto.processedAt) : undefined,
      reason: dto.reason,
      refundAmount: dto.refundAmount,
      refundStatus: dto.refundStatus?.toUpperCase(),
      cancellationFee: dto.cancellationFee
    };
  }

  // Reverse mapping methods (Domain to DTO)
  private static buyerToDto(buyer: Buyer): BuyerDto {
    return {
      name: buyer.name,
      email: buyer.email,
      phone: buyer.phone,
      document: buyer.document,
      documentType: buyer.documentType
    };
  }

  private static reservationStatusToDto(status: ReservationStatus): BookingStatusDto {
    switch (status) {
      case 'PENDING':
        return 'pending';
      case 'CONFIRMED':
        return 'confirmed';
      case 'CANCELLED':
        return 'cancelled';
      case 'COMPLETED':
        return 'completed';
      case 'EXPIRED':
        return 'expired';
      default:
        return 'pending';
    }
  }
}
