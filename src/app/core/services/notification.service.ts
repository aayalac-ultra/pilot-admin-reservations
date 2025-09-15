import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snack: MatSnackBar) {}

  success(message: string, config: MatSnackBarConfig = {}) {
    this.snack.open(message, 'OK', { duration: 3000, panelClass: ['bg-green-600','text-white'], ...config });
  }

  error(message: string, config: MatSnackBarConfig = {}) {
    this.snack.open(message, 'Cerrar', { duration: 5000, panelClass: ['bg-red-600','text-white'], ...config });
  }

  info(message: string, config: MatSnackBarConfig = {}) {
    this.snack.open(message, 'OK', { duration: 3000, panelClass: ['bg-sky-600','text-white'], ...config });
  }
}
