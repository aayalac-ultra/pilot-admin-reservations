// Mock repository implementation for development/testing
import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { IReservationsRepository } from '../../domain/repositories/reservations.repository';
import { 
  ReservationBase, 
  Reservation,
  ReservationListResult,
  ReservationFilters,
  PaginationParams,
  ProductType,
  ReservationStatus,
  PaymentStatus,
  Priority
} from '@shared/domain/models/reservation-base.model';

@Injectable({ providedIn: 'root' })
export class ReservationsMockRepository implements IReservationsRepository {

  private mockData: ReservationBase[] = [
    {
      id: '1',
      pnr: 'LOC001',
      productType: 'LOCAL_OFFER',
      customerName: 'Juan Pérez',
      customerEmail: 'juan.perez@email.com',
      status: 'CONFIRMED',
      paymentStatus: 'COMPLETED',
      createdAt: new Date('2025-01-10T10:00:00Z'),
      updatedAt: new Date('2025-01-10T10:30:00Z'),
      expiresAt: new Date('2025-03-10T23:59:59Z'),
      totalAmount: 150000,
      currency: 'COP',
      marketplace: {
        id: 'mp1',
        name: 'Smartlinks Colombia',
        agency: 'Ultragroup'
      },
      priority: 'NORMAL',
      tags: ['oferta-local', 'restaurante']
    },
    {
      id: '2',
      pnr: 'LOC002',
      productType: 'LOCAL_OFFER',
      customerName: 'María García',
      customerEmail: 'maria.garcia@email.com',
      status: 'PENDING',
      paymentStatus: 'PENDING',
      createdAt: new Date('2025-01-11T14:00:00Z'),
      updatedAt: new Date('2025-01-11T14:00:00Z'),
      expiresAt: new Date('2025-03-11T23:59:59Z'),
      totalAmount: 250000,
      currency: 'COP',
      marketplace: {
        id: 'mp1',
        name: 'Smartlinks Colombia',
        agency: 'Ultragroup'
      },
      priority: 'HIGH',
      tags: ['oferta-local', 'spa']
    },
    {
      id: '3',
      pnr: 'LOC003',
      productType: 'LOCAL_OFFER',
      customerName: 'Carlos López',
      customerEmail: 'carlos.lopez@email.com',
      status: 'CANCELLED',
      paymentStatus: 'REFUNDED',
      createdAt: new Date('2025-01-09T09:00:00Z'),
      updatedAt: new Date('2025-01-09T16:00:00Z'),
      expiresAt: new Date('2025-03-09T23:59:59Z'),
      totalAmount: 75000,
      currency: 'COP',
      marketplace: {
        id: 'mp1',
        name: 'Smartlinks Colombia',
        agency: 'Ultragroup'
      },
      priority: 'LOW',
      tags: ['oferta-local', 'entretenimiento']
    },
    {
      id: '4',
      pnr: 'LOC004',
      productType: 'LOCAL_OFFER',
      customerName: 'Ana Rodríguez',
      customerEmail: 'ana.rodriguez@email.com',
      status: 'COMPLETED',
      paymentStatus: 'COMPLETED',
      createdAt: new Date('2025-01-08T11:00:00Z'),
      updatedAt: new Date('2025-01-08T18:00:00Z'),
      expiresAt: new Date('2025-03-08T23:59:59Z'),
      totalAmount: 320000,
      currency: 'COP',
      marketplace: {
        id: 'mp1',
        name: 'Smartlinks Colombia',
        agency: 'Ultragroup'
      },
      priority: 'NORMAL',
      tags: ['oferta-local', 'turismo']
    },
    {
      id: '5',
      pnr: 'LOC005',
      productType: 'LOCAL_OFFER',
      customerName: 'Diego Martínez',
      customerEmail: 'diego.martinez@email.com',
      status: 'CONFIRMED',
      paymentStatus: 'COMPLETED',
      createdAt: new Date('2025-01-12T16:00:00Z'),
      updatedAt: new Date('2025-01-12T16:15:00Z'),
      expiresAt: new Date('2025-03-12T23:59:59Z'),
      totalAmount: 180000,
      currency: 'COP',
      marketplace: {
        id: 'mp1',
        name: 'Smartlinks Colombia',
        agency: 'Ultragroup'
      },
      priority: 'URGENT',
      tags: ['oferta-local', 'salud']
    }
  ];

  list(params: Record<string, unknown>): Observable<ReservationListResult> {
    const page = Number(params['page']) || 0;
    const size = Number(params['size']) || 20;
    const search = params['search'] as string;
    const status = params['status'] as string;
    const productType = params['productType'] as string;

    let filteredData = [...this.mockData];

    // Apply filters
    if (search) {
      filteredData = filteredData.filter(item => 
        item.customerName.toLowerCase().includes(search.toLowerCase()) ||
        item.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
        item.pnr.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filteredData = filteredData.filter(item => item.status === status);
    }

    if (productType) {
      filteredData = filteredData.filter(item => item.productType === productType);
    }

    // Apply pagination
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const result: ReservationListResult = {
      items: paginatedData,
      pagination: {
        page,
        size,
        totalItems: filteredData.length,
        totalPages: Math.ceil(filteredData.length / size)
      }
    };

    return of(result).pipe(delay(1000)); // Simulate network delay
  }

  getById(id: string): Observable<Reservation> {
    const reservation = this.mockData.find(r => r.id === id);
    
    if (!reservation) {
      return throwError(() => new Error(`Reservation with id ${id} not found`));
    }

    // Convert ReservationBase to full Reservation with mock data
    const fullReservation: Reservation = {
      ...reservation,
      buyer: {
        name: reservation.customerName,
        email: reservation.customerEmail,
        phone: '+57 300 123 4567',
        document: '12345678',
        documentType: 'CC'
      },
      travelers: [
        {
          name: reservation.customerName,
          email: reservation.customerEmail,
          document: '12345678',
          documentType: 'CC',
          dateOfBirth: new Date('1990-01-01'),
          gender: 'MALE',
          type: 'beneficiary',
          isMainTraveler: true
        }
      ],
      product: {
        type: reservation.productType,
        name: 'Oferta Especial en Restaurante',
        provider: 'Restaurante El Gourmet',
        providerReference: 'REF-001',
        details: {
          description: 'Cena romántica para 2 personas',
          location: 'Zona Rosa, Bogotá',
          validUntil: reservation.expiresAt
        }
      },
      pricing: {
        baseAmount: reservation.totalAmount * 0.8,
        taxes: reservation.totalAmount * 0.19,
        fees: 0,
        discounts: 0,
        totalAmount: reservation.totalAmount,
        currency: reservation.currency
      },
      payments: [
        {
          id: 'pay-1',
          provider: 'PSE',
          transactionId: 'TXN-123456',
          amount: reservation.totalAmount,
          currency: reservation.currency,
          status: 'completed',
          method: 'BANK_TRANSFER',
          processedAt: reservation.createdAt
        }
      ],
      metadata: {
        source: 'WEB',
        sessionId: 'session-123',
        searchId: 'search-456'
      },
      internalComments: [],
      supportTickets: [],
      auditEvents: [
        {
          id: 'audit-1',
          reservationId: id,
          eventType: 'created',
          timestamp: reservation.createdAt,
          author: {
            id: 'system',
            name: 'Sistema',
            email: 'system@smartlinks.com',
            type: 'system'
          },
          description: 'Reserva creada exitosamente',
          metadata: {}
        }
      ],
      statusHistory: [
        {
          id: 'history-1',
          status: reservation.status,
          timestamp: reservation.createdAt,
          reason: 'Reserva inicial',
          author: {
            id: 'system',
            name: 'Sistema',
            type: 'system'
          }
        }
      ],
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      specialRequests: []
    };

    return of(fullReservation).pipe(delay(800));
  }

  update(id: string, payload: Partial<ReservationBase>): Observable<Reservation> {
    const index = this.mockData.findIndex(r => r.id === id);
    
    if (index === -1) {
      return throwError(() => new Error(`Reservation with id ${id} not found`));
    }

    // Update the mock data
    this.mockData[index] = {
      ...this.mockData[index],
      ...payload,
      updatedAt: new Date()
    };

    // Return full reservation
    return this.getById(id);
  }

  cancel(id: string): Observable<Reservation> {
    return this.update(id, { 
      status: 'CANCELLED',
      paymentStatus: 'REFUNDED'
    });
  }

  search(filters: ReservationFilters, pagination: PaginationParams): Observable<ReservationListResult> {
    // Convert filters to params format
    const params: Record<string, unknown> = {
      page: pagination.page,
      size: pagination.size,
      search: filters.searchTerm,
      status: filters.statuses?.[0],
      productType: filters.productTypes?.[0]
    };

    return this.list(params);
  }

  export(filters: ReservationFilters, format: 'CSV' | 'EXCEL' | 'PDF'): Observable<Blob> {
    // Mock export functionality
    const mockCsv = 'id,pnr,customer,status\n1,LOC001,Juan Pérez,CONFIRMED';
    const blob = new Blob([mockCsv], { type: 'text/csv' });
    
    return of(blob).pipe(delay(2000));
  }
}
