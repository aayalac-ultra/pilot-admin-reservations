// HTTP implementation of Reservations Repository with proper DTO/Domain separation
import { inject, Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../../app.config';
import { IReservationsRepository } from '../../domain/repositories/reservations.repository';
import { 
  ReservationBase, 
  Reservation, 
  ReservationListResult,
  ReservationFilters,
  PaginationParams 
} from '@shared/domain/models/reservation-base.model';
import { BookingDto, BookingListResponseDto } from '../dto/booking.dto';
import { BookingAdapter } from '../adapters/booking.adapter';

@Injectable({ providedIn: 'root' })
export class ReservationsHttpRepository implements IReservationsRepository {
  private readonly http = inject(HttpClient);
  
  constructor(@Inject(API_BASE_URL) private baseApiUrl: string) {}
  
  private get baseUrl() { 
    return `${this.baseApiUrl}/admin/reservations`; 
  }

  /**
   * Lists reservations with filters and pagination
   */
  list(params: Record<string, unknown>): Observable<ReservationListResult> {
    const httpParams = this.buildHttpParams(params);
    
    return this.http.get<BookingListResponseDto>(this.baseUrl, { params: httpParams }).pipe(
      map(dto => BookingAdapter.toDomainList(dto))
    );
  }

  /**
   * Gets a single reservation by ID
   */
  getById(id: string): Observable<Reservation> {
    return this.http.get<BookingDto>(`${this.baseUrl}/${id}`).pipe(
      map(dto => BookingAdapter.toReservation(dto))
    );
  }

  /**
   * Updates a reservation
   */
  update(id: string, payload: Partial<ReservationBase>): Observable<Reservation> {
    // Convert domain model to DTO for API request
    const dtoPayload = BookingAdapter.fromDomain(payload as Partial<Reservation>);
    
    return this.http.put<BookingDto>(`${this.baseUrl}/${id}`, dtoPayload).pipe(
      map(dto => BookingAdapter.toReservation(dto))
    );
  }

  /**
   * Cancels a reservation
   */
  cancel(id: string): Observable<Reservation> {
    return this.http.post<BookingDto>(`${this.baseUrl}/${id}/cancel`, {}).pipe(
      map(dto => BookingAdapter.toReservation(dto))
    );
  }

  /**
   * Searches reservations with advanced filters
   */
  search(filters: ReservationFilters, pagination: PaginationParams): Observable<ReservationListResult> {
    const params = this.buildSearchParams(filters, pagination);
    
    return this.http.get<BookingListResponseDto>(`${this.baseUrl}/search`, { params }).pipe(
      map(dto => BookingAdapter.toDomainList(dto))
    );
  }

  /**
   * Exports reservations data
   */
  export(filters: ReservationFilters, format: 'CSV' | 'EXCEL' | 'PDF'): Observable<Blob> {
    const params = this.buildExportParams(filters, format);
    
    return this.http.get(`${this.baseUrl}/export`, { 
      params, 
      responseType: 'blob'
    });
  }

  // Private helper methods
  private buildHttpParams(params: Record<string, unknown>): HttpParams {
    let httpParams = new HttpParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => {
            httpParams = httpParams.append(key, String(item));
          });
        } else if (value instanceof Date) {
          httpParams = httpParams.set(key, value.toISOString());
        } else {
          httpParams = httpParams.set(key, String(value));
        }
      }
    });
    
    return httpParams;
  }

  private buildSearchParams(filters: ReservationFilters, pagination: PaginationParams): HttpParams {
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());

    if (pagination.sortBy) {
      params = params.set('sortBy', pagination.sortBy);
    }
    
    if (pagination.sortDirection) {
      params = params.set('sortDirection', pagination.sortDirection);
    }

    // Add filter parameters
    if (filters.dateRange) {
      params = params.set('startDate', filters.dateRange.start.toISOString());
      params = params.set('endDate', filters.dateRange.end.toISOString());
    }

    if (filters.productTypes?.length) {
      filters.productTypes.forEach(type => {
        params = params.append('productTypes', type);
      });
    }

    if (filters.statuses?.length) {
      filters.statuses.forEach(status => {
        params = params.append('statuses', status);
      });
    }

    if (filters.paymentStatuses?.length) {
      filters.paymentStatuses.forEach(status => {
        params = params.append('paymentStatuses', status);
      });
    }

    if (filters.marketplaces?.length) {
      filters.marketplaces.forEach(marketplace => {
        params = params.append('marketplaces', marketplace);
      });
    }

    if (filters.searchTerm) {
      params = params.set('searchTerm', filters.searchTerm);
    }

    if (filters.priority?.length) {
      filters.priority.forEach(priority => {
        params = params.append('priority', priority);
      });
    }

    if (filters.hasComments !== undefined) {
      params = params.set('hasComments', filters.hasComments.toString());
    }

    if (filters.hasSupportTickets !== undefined) {
      params = params.set('hasSupportTickets', filters.hasSupportTickets.toString());
    }

    return params;
  }

  private buildExportParams(filters: ReservationFilters, format: string): HttpParams {
    let params = new HttpParams().set('format', format);
    
    // Add same filter logic as search
    // Implementation similar to buildSearchParams but for export
    
    return params;
  }
}
