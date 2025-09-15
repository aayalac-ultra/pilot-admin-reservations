import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationsFacade } from '@features/reservations/application/facades/reservations.facade';
import { ReservationBase } from '@shared/domain/models/reservation-base.model';
import { UiConfigService } from '@shared/services/ui-config.service';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';

import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-reservation-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TagModule,
    ProgressSpinnerModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressBarModule
  ],  providers: [MessageService, ConfirmationService],
  templateUrl: './reservation-detail-page.component.html',
  styleUrls: ['./reservation-detail-page.component.scss']
})
export class ReservationDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private facade = inject(ReservationsFacade);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  uiConfig = inject(UiConfigService);

  loading$ = this.facade.loading$;
  reservation: ReservationBase | null = null;
  buyerExpanded = true;
  hasComments = false;

  ngOnInit(): void {
    this.loadReservation();
  }

  private loadReservation(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.facade.loadDetail(id);

      // Subscribe to reservation changes
      this.facade.reservationById$(id).pipe(
        filter(reservation => !!reservation)
      ).subscribe(reservation => {
        this.reservation = reservation!;
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/reservas']);
  }

  getOfferTitle(reservation: ReservationBase): string {
    return `Oferta especial en ${this.getProductTypeLabel(reservation.productType)}`;
  }

  getStatusMessage(status: string): string {
    const messages: Record<string, string> = {
      'CONFIRMED': 'Reservada',
      'PENDING': 'Reserva pendiente de aprobación',
      'CANCELLED': 'Reserva cancelada'
    };
    return messages[status] || 'Estado desconocido';
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
    const severities: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
      'CONFIRMED': 'success',
      'PENDING': 'warning',
      'CANCELLED': 'danger'
    };
    return severities[status] || 'info';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'CONFIRMED': 'Confirmada',
      'PENDING': 'Pendiente',
      'CANCELLED': 'Cancelada'
    };
    return labels[status] || status;
  }

  getInitials(name: string): string {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substring(0, 2);
  }

  toggleBuyerSection(): void {
    this.buyerExpanded = !this.buyerExpanded;
  }

  addComment(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Función en desarrollo',
      detail: 'La funcionalidad de comentarios estará disponible pronto'
    });
  }

  getProductTypeLabel(productType: string): string {
    const labels: Record<string, string> = {
      'LOCAL_OFFER': 'Oferta Local',
      'FLIGHT': 'Vuelo',
      'HOTEL': 'Hotel'
    };
    return labels[productType] || productType;
  }

  getVigenciaText(reservation: ReservationBase): string {
    if (reservation.expiresAt) {
      return this.uiConfig.formatDate(reservation.expiresAt, 'long');
    }
    return 'Sin vencimiento';
  }

  formatDate(date: Date): string {
    return this.uiConfig.formatDate(date, 'medium');
  }

  formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  }

  // Action Methods
  confirmReservation(): void {
    if (!this.reservation) return;

    this.confirmationService.confirm({
      message: '¿Está seguro de que desea confirmar esta reserva?',
      header: 'Confirmar Reserva',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Sí, confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.facade.update(this.reservation!.id, { status: 'CONFIRMED' });
        this.messageService.add({
          severity: 'success',
          summary: 'Reserva Confirmada',
          detail: 'La reserva ha sido confirmada exitosamente'
        });
      }
    });
  }

  cancelReservation(): void {
    if (!this.reservation) return;

    this.confirmationService.confirm({
      message: '¿Está seguro de que desea cancelar esta reserva? Esta acción no se puede deshacer.',
      header: 'Cancelar Reserva',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar',
      rejectLabel: 'No',
      accept: () => {
        this.facade.cancel(this.reservation!.id);
        this.messageService.add({
          severity: 'warn',
          summary: 'Reserva Cancelada',
          detail: `La reserva ${this.reservation!.pnr} ha sido cancelada`
        });
      }
    });
  }

  downloadVoucher(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Descarga en proceso',
      detail: 'El voucher se está preparando para descarga'
    });
  }

  sendVoucherToClient(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Enviando voucher',
      detail: 'El voucher se está enviando al cliente'
    });
  }

  downloadReport(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Generando reporte',
      detail: 'El reporte se está preparando para descarga'
    });
  }
}
