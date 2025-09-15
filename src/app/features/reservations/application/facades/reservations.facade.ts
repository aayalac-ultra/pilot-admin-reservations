import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ReservationsActions from '../store/reservations.actions';
import {
  ReservationsState,
  selectAllReservations,
  selectReservationsLoading,
  selectReservationById,
  selectReservationsError,
  selectReservationsTotal,
  selectReservationsPagination,
  selectReservationsCurrentFilters
} from '../store/reservations.selectors';
import {
  ReservationBase,
  ReservationFilters,
  PaginationParams
} from '@shared/domain/models/reservation-base.model';
import { ReservationListParams } from '../../domain/repositories/reservations.repository';

@Injectable({ providedIn: 'root' })
export class ReservationsFacade {
  constructor(private readonly store: Store<ReservationsState>) {}

  // Selectors
  get reservations$() {
    return this.store.select(selectAllReservations);
  }

  get loading$() {
    return this.store.select(selectReservationsLoading);
  }

  get error$() {
    return this.store.select(selectReservationsError);
  }

  get total$() {
    return this.store.select(selectReservationsTotal);
  }

  get pagination$() {
    return this.store.select(selectReservationsPagination);
  }

  get currentFilters$() {
    return this.store.select(selectReservationsCurrentFilters);
  }

  reservationById$(id: string) {
    return this.store.select(selectReservationById(id));
  }

  // Actions
  load(params: ReservationListParams = {}) {
    const filters: ReservationListParams = {
      page: 0,
      size: 20,
      ...params
    };
    this.store.dispatch(ReservationsActions.queryReservationsList({ filters }));
  }

  loadWithFilters(filters: ReservationFilters, pagination?: PaginationParams) {
    const params: ReservationListParams = {
      page: pagination?.page ?? 0,
      size: pagination?.size ?? 20,
      searchTerm: filters.searchTerm,
      sortField: pagination?.sortBy as string,
      sortOrder: pagination?.sortDirection === 'ASC' ? 'asc' : 'desc'
    };
    this.store.dispatch(ReservationsActions.queryReservationsList({ filters: params }));
  }

  loadDetail(id: string) {
    this.store.dispatch(ReservationsActions.queryReservationById({ id }));
  }

  update(id: string, changes: Partial<ReservationBase>) {
    this.store.dispatch(ReservationsActions.executeReservationUpdate({ id, changes }));
  }

  cancel(id: string) {
    this.store.dispatch(ReservationsActions.executeReservationCancellation({ id }));
  }

  // Utility methods for common pagination operations
  loadPage(page: number) {
    this.load({ page });
  }

  changePageSize(size: number) {
    this.load({ page: 0, size });
  }

  search(searchTerm: string) {
    this.load({ page: 0, searchTerm: searchTerm });
  }

  sort(field: keyof ReservationBase, direction: 'asc' | 'desc') {
    this.load({
      page: 0,
      sortField: field as string,
      sortOrder: direction
    });
  }

  refresh() {
    // Refresh using current filters and pagination
    this.load();
  }

  clearError() {
    // Could dispatch a clear error action if needed
  }
}
