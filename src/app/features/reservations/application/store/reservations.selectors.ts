import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReservationsEntityState, selectAll } from './reservations.reducer';

export interface ReservationsState {
  reservations: ReservationsEntityState;
}

export const selectReservationsFeature = createFeatureSelector<ReservationsEntityState>('reservations');

export const selectAllReservations = createSelector(selectReservationsFeature, selectAll);
export const selectReservationsLoading = createSelector(selectReservationsFeature, (s) => s.loading);
export const selectReservationsError = createSelector(selectReservationsFeature, (s) => s.error);
export const selectReservationsPagination = createSelector(selectReservationsFeature, (s) => s.pagination);
export const selectReservationsCurrentFilters = createSelector(selectReservationsFeature, (s) => s.currentFilters);
export const selectReservationsEntities = createSelector(selectReservationsFeature, (s) => s.entities);
export const selectReservationById = (id: string) => createSelector(selectReservationsEntities, entities => entities[id] || null);

// Legacy selector for backward compatibility
export const selectReservationsTotal = createSelector(selectReservationsPagination, (pagination) => pagination.totalItems);
