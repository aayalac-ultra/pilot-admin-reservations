import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import {
  ReservationBase,
  Reservation,
  ReservationListResult,
  ReservationFilters,
  PaginationParams
} from '@shared/domain/models/reservation-base.model';

// Importar el tipo desde las actions
export interface ReservationListParams {
  page?: number;
  size?: number;
  searchTerm?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IReservationsRepository {
  // Basic CRUD operations
  list(params: ReservationListParams): Observable<ReservationListResult>;
  getById(id: string): Observable<Reservation>;
  update(id: string, payload: Partial<ReservationBase>): Observable<Reservation>;
  cancel(id: string): Observable<Reservation>;

  // Advanced operations
  search(filters: ReservationFilters, pagination: PaginationParams): Observable<ReservationListResult>;
  export(filters: ReservationFilters, format: 'CSV' | 'EXCEL' | 'PDF'): Observable<Blob>;
}

export const RESERVATIONS_REPOSITORY = new InjectionToken<IReservationsRepository>('RESERVATIONS_REPOSITORY');
