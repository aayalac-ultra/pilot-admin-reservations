import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductType, ReservationStatus, PaymentStatus, Priority } from '../domain/models/reservation-base.model';

/**
 * UI Service para configuraciones y utilidades de la interfaz
 * Siguiendo el patrón Facade para la capa de presentación
 */
@Injectable({ providedIn: 'root' })
export class UiConfigService {

  private themeSubject = new BehaviorSubject<string>('lara-light-blue');
  public theme$ = this.themeSubject.asObservable();

  /**
   * Configuraciones para PrimeNG Table
   */
  getTableConfig() {
    return {
      paginator: true,
      rows: 20,
      rowsPerPageOptions: [10, 20, 50],
      showCurrentPageReport: true,
      currentPageReportTemplate: 'Mostrando {first} a {last} de {totalRecords} reservas',
      responsiveLayout: 'scroll',
      sortMode: 'single',
      selectionMode: 'single',
      dataKey: 'id',
      lazy: true,
      loading: false,
      filterDelay: 500,
      globalFilterFields: ['pnr', 'customerName', 'customerEmail']
    };
  }

  /**
   * Opciones para filtros
   */
  getFilterOptions() {
    return {
      productTypes: [
        { label: 'Ofertas Locales', value: 'LOCAL_OFFER' },
        { label: 'Vuelos', value: 'FLIGHT' },
        { label: 'Hoteles', value: 'HOTEL' }
      ],
      statuses: [
        { label: 'Pendiente', value: 'PENDING' },
        { label: 'Confirmada', value: 'CONFIRMED' },
        { label: 'Cancelada', value: 'CANCELLED' },
        { label: 'Completada', value: 'COMPLETED' },
        { label: 'Expirada', value: 'EXPIRED' }
      ],
      paymentStatuses: [
        { label: 'Pendiente', value: 'PENDING' },
        { label: 'Completado', value: 'COMPLETED' },
        { label: 'Fallido', value: 'FAILED' },
        { label: 'Reembolsado', value: 'REFUNDED' }
      ],
      priorities: [
        { label: 'Baja', value: 'LOW' },
        { label: 'Normal', value: 'NORMAL' },
        { label: 'Alta', value: 'HIGH' },
        { label: 'Urgente', value: 'URGENT' }
      ]
    };
  }

  /**
   * Configuración de severidad para badges/chips
   */
  getStatusSeverity(status: ReservationStatus): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    const severityMap = {
      'CONFIRMED': 'success' as const,
      'PENDING': 'warning' as const,
      'CANCELLED': 'danger' as const,
      'COMPLETED': 'info' as const,
      'EXPIRED': 'secondary' as const
    };
    return severityMap[status] || 'secondary';
  }

  getPaymentStatusSeverity(status: PaymentStatus): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    const severityMap = {
      'COMPLETED': 'success' as const,
      'PENDING': 'warning' as const,
      'FAILED': 'danger' as const,
      'REFUNDED': 'info' as const
    };
    return severityMap[status] || 'secondary';
  }

  getPrioritySeverity(priority: Priority): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    const severityMap = {
      'LOW': 'secondary' as const,
      'NORMAL': 'info' as const,
      'HIGH': 'warning' as const,
      'URGENT': 'danger' as const
    };
    return severityMap[priority] || 'info';
  }

  /**
   * Configuración de exportación
   */
  getExportConfig() {
    return {
      formats: [
        { label: 'Excel', value: 'EXCEL', icon: 'pi pi-file-excel', class: 'p-button-success' },
        { label: 'CSV', value: 'CSV', icon: 'pi pi-file', class: 'p-button-info' },
        { label: 'PDF', value: 'PDF', icon: 'pi pi-file-pdf', class: 'p-button-danger' }
      ]
    };
  }

  /**
   * Traducciones para PrimeNG Calendar
   */
  getCalendarLocale() {
    return {
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      today: 'Hoy',
      clear: 'Limpiar'
    };
  }

  /**
   * Iconos para diferentes tipos de producto
   */
  getProductTypeIcon(productType: ProductType): string {
    const iconMap = {
      'LOCAL_OFFER': 'pi pi-map-marker',
      'FLIGHT': 'pi pi-send',
      'HOTEL': 'pi pi-home'
    };
    return iconMap[productType] || 'pi pi-circle';
  }

  /**
   * Configuración de toast notifications
   */
  getToastConfig() {
    return {
      position: 'top-right',
      life: 3000,
      closable: true,
      showTransitionOptions: '300ms ease-out',
      hideTransitionOptions: '250ms ease-in'
    };
  }

  /**
   * Cambiar tema
   */
  setTheme(theme: string): void {
    this.themeSubject.next(theme);
    // Aquí se puede implementar la lógica para cambiar el tema dinámicamente
  }

  /**
   * Formatear moneda
   */
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Formatear fecha
   */
  formatDate(date: Date, format: 'short' | 'medium' | 'long' = 'medium'): string {
    const options: Record<string, Intl.DateTimeFormatOptions> = {
      short: { year: 'numeric', month: '2-digit', day: '2-digit' },
      medium: { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' },
      long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    };

    return new Intl.DateTimeFormat('es-CO', options[format]).format(date);
  }
}
