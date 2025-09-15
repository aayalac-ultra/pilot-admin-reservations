import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { ReservationBase, ProductType, ReservationStatus, PaymentStatus, Priority } from '@shared/domain/models/reservation-base.model';
import { UiConfigService } from '@shared/services/ui-config.service';

export interface ReservationTableFilters {
  global?: string;
}

export interface ReservationTableEvent {
  type: 'view' | 'edit' | 'cancel' | 'duplicate';
  reservation: ReservationBase;
}

export interface ReservationTableSort {
  field: string;
  order: 'asc' | 'desc';
}

export interface ReservationTablePagination {
  page: number;
  size: number;
  totalItems: number;
}

/**
 * Componente de tabla reutilizable para reservas
 * Implementa Atomic Design (Organism level)
 * Encapsula toda la lógica de UI para listados de reservas
 */
@Component({
  selector: 'app-reservations-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    DropdownModule,
    InputTextModule,
    CalendarModule,
    ProgressSpinnerModule,
    TooltipModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService],
  templateUrl: './reservations-table.component.html',
  styleUrls: ['./reservations-table.component.scss']
})
export class ReservationsTableComponent implements OnInit {
  @Input() reservations: ReservationBase[] = [];
  @Input() loading: boolean = false;
  @Input() exporting: boolean = false;
  @Input() pagination: ReservationTablePagination = {
    page: 0,
    size: 20,
    totalItems: 0
  };

  @Output() filtersChange = new EventEmitter<ReservationTableFilters>();
  @Output() actionEvent = new EventEmitter<ReservationTableEvent>();
  @Output() sortChange = new EventEmitter<ReservationTableSort>();
  @Output() pageChange = new EventEmitter<ReservationTablePagination>();
  @Output() refresh = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();

  // Services
  uiConfig = inject(UiConfigService);
  confirmationService = inject(ConfirmationService);

  // State
  filters: ReservationTableFilters = {};
  filterOptions = this.uiConfig.getFilterOptions();

  ngOnInit() {
    // Initialize component
  }

  onFilterChange() {
    this.filtersChange.emit(this.filters);
  }

  clearFilters() {
    this.filters = {};
    this.onFilterChange();
  }

  onTableEvent(event: any) {
    // Handle lazy loading events (pagination, sorting)
    const pagination: ReservationTablePagination = {
      page: Math.floor(event.first / event.rows),
      size: event.rows,
      totalItems: this.pagination.totalItems
    };

    this.pageChange.emit(pagination);

    if (event.sortField) {
      const sort: ReservationTableSort = {
        field: event.sortField,
        order: event.sortOrder === 1 ? 'asc' : 'desc'
      };
      this.sortChange.emit(sort);
    }
  }

  onRowSelect(event: any) {
    this.onViewReservation(event.data);
  }

  onViewReservation(reservation: ReservationBase) {
    this.actionEvent.emit({ type: 'view', reservation });
  }

  onEditReservation(reservation: ReservationBase) {
    this.actionEvent.emit({ type: 'edit', reservation });
  }

  onCancelReservation(reservation: ReservationBase) {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea cancelar la reserva ${reservation.pnr}?`,
      header: 'Confirmar Cancelación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar',
      rejectLabel: 'No',
      accept: () => {
        this.actionEvent.emit({ type: 'cancel', reservation });
      }
    });
  }

  onDuplicateReservation(reservation: ReservationBase) {
    this.actionEvent.emit({ type: 'duplicate', reservation });
  }

  onRefresh() {
    this.refresh.emit();
  }

  onExport() {
    this.export.emit();
  }

  // Helper methods
  hasActiveFilters(): boolean {
    return !!(this.filters.global && this.filters.global.trim());
  }

  getConfirmedCount(): number {
    return this.reservations.filter(r => r.status === 'CONFIRMED').length;
  }

  getPendingCount(): number {
    return this.reservations.filter(r => r.status === 'PENDING').length;
  }

  getCurrentRangeText(): string {
    const start = (this.pagination.page * this.pagination.size) + 1;
    const end = Math.min((this.pagination.page + 1) * this.pagination.size, this.pagination.totalItems);
    return `${start} a ${end} de ${this.pagination.totalItems}`;
  }

  formatDate(date: Date): string {
    return this.uiConfig.formatDate(date, 'short');
  }

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  getLocationText(reservation: ReservationBase): string {
    // Extract location from reservation data - this would depend on your data structure
    return 'BAC Costa Rica'; // Placeholder - adjust based on your data
  }

  getProductDescription(reservation: ReservationBase): string {
    // Extract product description - this would depend on your data structure
    return `Reserva de ${this.getProductTypeLabel(reservation.productType)}`;
  }

  getProductTypeIcon(productType: ProductType): string {
    return this.uiConfig.getProductTypeIcon(productType);
  }

  getProductTypeLabel(productType: ProductType): string {
    const labels = {
      'LOCAL_OFFER': 'Experiencia Local',
      'FLIGHT': 'Vuelo',
      'HOTEL': 'Alojamiento'
    };
    return labels[productType] || productType;
  }

  getStatusLabel(status: ReservationStatus): string {
    const labels = {
      'PENDING': 'Pendiente',
      'CONFIRMED': 'Confirmada',
      'CANCELLED': 'Cancelada',
      'COMPLETED': 'Completada',
      'EXPIRED': 'Expirada'
    };
    return labels[status] || status;
  }

  getPaymentStatusLabel(status: PaymentStatus): string {
    const labels = {
      'PENDING': 'Pendiente',
      'COMPLETED': 'Completado',
      'FAILED': 'Fallido',
      'REFUNDED': 'Reembolsado'
    };
    return labels[status] || status;
  }
}
