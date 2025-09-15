import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import * as ReservationsActions from './reservations.actions';
import { ReservationBase, PaginationParams } from '@shared/domain/models/reservation-base.model';

export interface ReservationsEntityState extends EntityState<ReservationBase> {
  loading: boolean;
  error: any | null;
  pagination: {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  };
  currentFilters: {
    search?: string;
    sortBy?: keyof ReservationBase;
    sortDirection?: 'ASC' | 'DESC';
  };
}

export const reservationsAdapter = createEntityAdapter<ReservationBase>({
  selectId: (r) => r.id
});

export const initialState: ReservationsEntityState = reservationsAdapter.getInitialState({
  loading: false,
  error: null,
  pagination: {
    page: 0,
    size: 20,
    totalItems: 0,
    totalPages: 0
  },
  currentFilters: {}
});

export const reservationsReducer = createReducer(
  initialState,
  on(ReservationsActions.queryReservationsList, (state, { filters }) => ({
    ...state,
    loading: true,
    error: null,
    currentFilters: {
      search: filters.searchTerm,
      sortBy: filters.sortField as keyof ReservationBase,
      sortDirection: filters.sortOrder === 'asc' ? 'ASC' as const : filters.sortOrder === 'desc' ? 'DESC' as const : undefined
    }
  })),
  on(ReservationsActions.queryReservationsListCompleted, (state, { result }) =>
    reservationsAdapter.setAll(result.items, {
      ...state,
      loading: false,
      pagination: result.pagination
    })
  ),
  on(ReservationsActions.queryReservationsListFailed, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(ReservationsActions.executeReservationCancellation, (state) => ({
    ...state,
    loading: true
  })),
  on(ReservationsActions.reservationCancellationCompleted, (state, { reservation }) =>
    reservationsAdapter.upsertOne(reservation, {
      ...state,
      loading: false
    })
  ),
  on(ReservationsActions.reservationCancellationFailed, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(ReservationsActions.queryReservationByIdCompleted, (state, { reservation }) =>
    reservationsAdapter.upsertOne(reservation, {
      ...state
    })
  ),
  on(ReservationsActions.reservationUpdateCompleted, (state, { reservation }) =>
    reservationsAdapter.upsertOne(reservation, {
      ...state
    })
  )
);

export const { selectAll, selectEntities, selectIds, selectTotal } = reservationsAdapter.getSelectors();
