import { Routes } from '@angular/router';

export const reservationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./presentation/pages/reservations-list-page/reservations-list-page.component').then(m => m.ReservationsListPageComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./presentation/pages/reservation-detail-page/reservation-detail-page.component').then(m => m.ReservationDetailPageComponent)
  }
];
