import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ReservationsActions from './reservations.actions';
import { IReservationsRepository, RESERVATIONS_REPOSITORY } from '../../domain/repositories/reservations.repository';
import { catchError, map, mergeMap, of } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import { Reservation, ReservationBase } from '@shared/domain/models/reservation-base.model';

@Injectable()
export class ReservationsEffects {
  private actions$ = inject(Actions);
  private repo = inject(RESERVATIONS_REPOSITORY);
  private notifications = inject(NotificationService);

  queryReservationsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationsActions.queryReservationsList),
      mergeMap(({ filters }) =>
        this.repo.list(filters).pipe(
          map((result) => ReservationsActions.queryReservationsListCompleted({
            result
          })),
            catchError((error) => of(ReservationsActions.queryReservationsListFailed({ error })))
        )
      )
    )
  );

  executeReservationCancellation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationsActions.executeReservationCancellation),
      mergeMap(({ id }) =>
        this.repo.cancel(id).pipe(
          map((reservation) => ReservationsActions.reservationCancellationCompleted({
            reservation: this.toReservationBase(reservation)
          })),
          catchError((error) => of(ReservationsActions.reservationCancellationFailed({ error })))
        )
      )
    )
  );

  queryReservationById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationsActions.queryReservationById),
      mergeMap(({ id }) =>
        this.repo.getById(id).pipe(
          map(reservation => ReservationsActions.queryReservationByIdCompleted({
            reservation: this.toReservationBase(reservation)
          })),
          catchError(error => of(ReservationsActions.queryReservationByIdFailed({ error })))
        )
      )
    )
  );

  executeReservationUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationsActions.executeReservationUpdate),
      mergeMap(({ id, changes }) =>
        this.repo.update(id, changes).pipe(
          map(reservation => ReservationsActions.reservationUpdateCompleted({
            reservation: this.toReservationBase(reservation)
          })),
          catchError(error => of(ReservationsActions.reservationUpdateFailed({ error })))
        )
      )
    )
  );

  notifyOnCancelSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationsActions.reservationCancellationCompleted),
      map(() => {
        this.notifications.success('Reserva cancelada');
        return { type: '[Notifications] NOOP' };
      })
    )
  );

  notifyOnFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ReservationsActions.queryReservationsListFailed,
        ReservationsActions.reservationCancellationFailed,
        ReservationsActions.reservationUpdateFailed,
        ReservationsActions.queryReservationByIdFailed
      ),
      map(({ error }) => {
        this.notifications.error('Error en operación de reservas');
        return { type: '[Notifications] NOOP' };
      })
    )
  );

  // Helper method to convert full Reservation to ReservationBase
  private toReservationBase(reservation: Reservation): ReservationBase {
    return {
      id: reservation.id,
      pnr: reservation.pnr,
      productType: reservation.productType,
      customerName: reservation.customerName,
      customerEmail: reservation.customerEmail,
      status: reservation.status,
      paymentStatus: reservation.paymentStatus,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
      expiresAt: reservation.expiresAt,
      totalAmount: reservation.totalAmount,
      currency: reservation.currency,
      marketplace: reservation.marketplace,
      priority: reservation.priority,
      tags: reservation.tags
    };
  }
}
