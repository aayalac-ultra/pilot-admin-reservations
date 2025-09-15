import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'reservas'
  },
  {
    path: 'reservas',
    loadChildren: () => import('./features/reservations/reservations.routes').then(m => m.reservationsRoutes)
  }
];
