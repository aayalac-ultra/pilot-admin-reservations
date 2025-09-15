import { ApplicationConfig, provideZoneChangeDetection, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { reservationsReducer } from './features/reservations/application/store/reservations.reducer';
import { ReservationsEffects } from './features/reservations/application/store/reservations.effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { RESERVATIONS_REPOSITORY } from './features/reservations/domain/repositories/reservations.repository';
import { ReservationsMockRepository } from './features/reservations/infrastructure/http/reservations-mock.repository';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { httpTimingInterceptor } from './core/interceptors/http-timing.interceptor';
import { environment } from '../environments/environment';

// PrimeNG Providers
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';


import { routes } from './app.routes';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, httpTimingInterceptor])),
    provideAnimationsAsync(),
    provideStore({ reservations: reservationsReducer }),
    provideEffects(ReservationsEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    { provide: RESERVATIONS_REPOSITORY, useClass: ReservationsMockRepository },
    // PrimeNG Configuration
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          prefix: 'p',
          darkModeSelector: '.dark-theme',
          cssLayer: false
        }
      }
    }),
    // PrimeNG Services
    ConfirmationService,
    MessageService
  ]
};
