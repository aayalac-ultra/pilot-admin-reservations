import { createAction, props } from '@ngrx/store';
import { ReservationBase, ReservationListResult } from '@shared/domain/models/reservation-base.model';
import { ReservationListParams } from '../../domain/repositories/reservations.repository';

// =============================================================================
// 📊 QUERIES - Operaciones de Consulta (Solo Lectura)
// =============================================================================

export const queryReservationsList = createAction(
  '[Reservations API] Query List',
  props<{ filters: ReservationListParams }>()
);

export const queryReservationsListCompleted = createAction(
  '[Reservations API] Query List Completed',
  props<{ result: ReservationListResult }>()
);

export const queryReservationsListFailed = createAction(
  '[Reservations API] Query List Failed',
  props<{ error: any }>()
);

// =============================================================================
// 🔍 RESERVATION DETAIL ACTIONS
// =============================================================================

export const queryReservationById = createAction(
  '[Reservations API] Query By ID',
  props<{ id: string }>()
);

export const queryReservationByIdCompleted = createAction(
  '[Reservations API] Query By ID Completed',
  props<{ reservation: ReservationBase }>()
);

export const queryReservationByIdFailed = createAction(
  '[Reservations API] Query By ID Failed',
  props<{ error: any }>()
);

// =============================================================================
// 🎯 COMMANDS - Operaciones de Negocio (Modifican Estado)
// =============================================================================

export const executeReservationCancellation = createAction(
  '[Reservations Commands] Execute Cancellation',
  props<{ id: string; reason?: string }>()
);

export const reservationCancellationCompleted = createAction(
  '[Reservations Commands] Cancellation Completed',
  props<{ reservation: ReservationBase }>()
);

export const reservationCancellationFailed = createAction(
  '[Reservations Commands] Cancellation Failed',
  props<{ error: any }>()
);

// =============================================================================
// ✏️ RESERVATION UPDATE ACTIONS
// =============================================================================

export const executeReservationUpdate = createAction(
  '[Reservations Commands] Execute Update',
  props<{ id: string; changes: Partial<ReservationBase> }>()
);

export const reservationUpdateCompleted = createAction(
  '[Reservations Commands] Update Completed',
  props<{ reservation: ReservationBase }>()
);

export const reservationUpdateFailed = createAction(
  '[Reservations Commands] Update Failed',
  props<{ error: any }>()
);

// =============================================================================
// 🔍 UI QUERIES - Operaciones de Interfaz (Solo Lectura Local)
// =============================================================================

export const queryReservationsWithFilters = createAction(
  '[Reservations UI] Query With Filters',
  props<{ filters: ReservationListParams }>()
);

export const searchReservationsByCustomer = createAction(
  '[Reservations UI] Search By Customer Name',
  props<{ customerName: string }>()
);

// =============================================================================
// ⚙️ UI COMMANDS - Operaciones de Estado Local (Solo UI)
// =============================================================================

export const setReservationsFilters = createAction(
  '[Reservations UI] Set Filters',
  props<{ filters: ReservationListParams }>()
);

export const clearReservationsFilters = createAction(
  '[Reservations UI] Clear All Filters'
);

// =============================================================================
// 📄 PAGINATION ACTIONS
// =============================================================================

export const navigateToPage = createAction(
  '[Reservations UI] Navigate To Page',
  props<{ page: number }>()
);

export const changePageSize = createAction(
  '[Reservations UI] Change Page Size',
  props<{ pageSize: number }>()
);

export const setViewMode = createAction(
  '[Reservations UI] Set View Mode',
  props<{ mode: 'table' | 'cards' | 'calendar' }>()
);

export const toggleReservationSelection = createAction(
  '[Reservations UI] Toggle Selection',
  props<{ id: string }>()
);

export const selectAllReservations = createAction(
  '[Reservations UI] Select All'
);

export const clearReservationSelection = createAction(
  '[Reservations UI] Clear Selection'
);

// =============================================================================
// 🔄 CACHE COMMANDS - Operaciones de Cache
// =============================================================================

export const invalidateReservationsCache = createAction(
  '[Reservations Cache] Invalidate Cache'
);

export const refreshReservationsList = createAction(
  '[Reservations Cache] Refresh List'
);
