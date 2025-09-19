import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReservationsFacade } from '@features/reservations/application/facades/reservations.facade';
import { ReservationsTableComponent, ReservationTableFilters, ReservationTableEvent, ReservationTableSort, ReservationTablePagination } from '@shared/ui/components/reservations-table/reservations-table.component';
import { StatsCardsSectionComponent, type StatsCardsData } from '@shared/ui/molecules/stats-cards-section/stats-cards-section.component';
import { ReservationBase } from '@shared/domain/models/reservation-base.model';

// PrimeNG Imports for notifications
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reservations-list-page',
  standalone: true,
  imports: [
    CommonModule,
    ReservationsTableComponent,
    StatsCardsSectionComponent,
    ToastModule
  ],
  templateUrl: './reservations-list-page.component.html',
  styleUrls: ['./reservations-list-page.component.scss']
})
export class ReservationsListPageComponent implements OnInit {
  private facade = inject(ReservationsFacade);
  private router = inject(Router);
  private messageService = inject(MessageService);

  reservations$ = this.facade.reservations$;
  loading$ = this.facade.loading$;
  pagination$ = this.facade.pagination$;

  // Component state
  exporting = false;

  // Default pagination for template
  defaultPagination: ReservationTablePagination = {
    page: 0,
    size: 20,
    totalItems: 0
  };

  ngOnInit(): void {
    this.loadReservations();
  }

  private loadReservations(): void {
    this.facade.load();
  }

  onFiltersChange(filters: ReservationTableFilters): void {
    this.facade.search(filters.global || '');
  }

  onActionEvent(event: ReservationTableEvent): void {
    switch (event.type) {
      case 'view':
        this.viewReservation(event.reservation);
        break;
      case 'edit':
        this.editReservation(event.reservation);
        break;
      case 'cancel':
        this.cancelReservation(event.reservation);
        break;
      case 'duplicate':
        this.duplicateReservation(event.reservation);
        break;
    }
  }

  onSortChange(sort: ReservationTableSort): void {
    this.facade.sort(sort.field as keyof ReservationBase, sort.order);
  }

  onPageChange(pagination: ReservationTablePagination): void {
    this.facade.loadPage(pagination.page);
  }

  onRefresh(): void {
    this.facade.refresh();
    this.messageService.add({
      severity: 'success',
      summary: 'Actualizado',
      detail: 'Los datos han sido actualizados correctamente'
    });
  }

  async onExport(): Promise<void> {
    try {
      this.exporting = true;

      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      this.messageService.add({
        severity: 'success',
        summary: 'Exportación Completada',
        detail: 'Los datos han sido exportados correctamente'
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de Exportación',
        detail: 'No se pudo exportar los datos'
      });
    } finally {
      this.exporting = false;
    }
  }

  private viewReservation(reservation: ReservationBase): void {
    this.router.navigate(['/reservas', reservation.id]);
  }

  private editReservation(reservation: ReservationBase): void {
    this.router.navigate(['/reservas', reservation.id], {
      queryParams: { mode: 'edit' }
    });
  }

  getStatsCardsData(reservations: ReservationBase[] | null): StatsCardsData {
    if (!reservations) {
      return {
        totalReservations: 0,
        totalValue: 0,
        confirmedReservations: 0,
        pendingPayments: 0,
        showTrends: false
      };
    }

    const confirmedCount = reservations.filter(r => r.status === 'CONFIRMED').length;
    const pendingPayments = reservations.filter(r => r.paymentStatus === 'PENDING').length;
    const totalValue = reservations.reduce((sum, r) => sum + r.totalAmount, 0);

    return {
      totalReservations: reservations.length,
      totalValue: totalValue,
      confirmedReservations: confirmedCount,
      pendingPayments: pendingPayments,
      showTrends: false // Could be enhanced with trends calculation
    };
  }

  private cancelReservation(reservation: ReservationBase): void {
    this.facade.cancel(reservation.id);
    this.messageService.add({
      severity: 'warn',
      summary: 'Reserva Cancelada',
      detail: `La reserva ${reservation.pnr} ha sido cancelada`
    });
  }

  private duplicateReservation(reservation: ReservationBase): void {
    // TODO: Implement duplication logic
    this.messageService.add({
      severity: 'info',
      summary: 'Duplicación Pendiente',
      detail: 'La funcionalidad de duplicación será implementada próximamente'
    });
  }
}