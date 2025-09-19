import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCardComponent, type StatsCardData } from '../../atoms/stats-card/stats-card.component';

export interface StatsCardsData {
  totalReservations: number;
  totalValue: number;
  confirmedReservations: number;
  pendingPayments: number;
  showTrends?: boolean;
  trends?: {
    total: { value: number; isPositive: boolean };
    confirmed: { value: number; isPositive: boolean };
    pending: { value: number; isPositive: boolean };
  };
}

@Component({
  selector: 'app-stats-cards-section',
  standalone: true,
  imports: [CommonModule, StatsCardComponent],
  templateUrl: './stats-cards-section.component.html',
  styleUrls: ['./stats-cards-section.component.scss']
})
export class StatsCardsSectionComponent {
  data = input.required<StatsCardsData>();

  getTotalReservationsCard(): StatsCardData {
    const statsData = this.data();
    return {
      title: 'Total Reservas',
      value: statsData.totalReservations.toString(),
      icon: 'pi pi-calendar',
      color: 'orange',
      trend: statsData.showTrends && statsData.trends?.total ? statsData.trends.total : undefined
    };
  }

  getTotalValueCard(): StatsCardData {
    const statsData = this.data();
    return {
      title: 'Valor Total',
      value: `${statsData.totalValue.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      icon: 'pi pi-dollar',
      color: 'green'
    };
  }

  getConfirmedReservationsCard(): StatsCardData {
    const statsData = this.data();
    return {
      title: 'Confirmadas',
      value: statsData.confirmedReservations.toString(),
      icon: 'pi pi-check-circle',
      color: 'blue',
      trend: statsData.showTrends && statsData.trends?.confirmed ? statsData.trends.confirmed : undefined
    };
  }

  getPendingPaymentsCard(): StatsCardData {
    const statsData = this.data();
    return {
      title: 'Pagos Pendientes',
      value: statsData.pendingPayments.toString(),
      icon: 'pi pi-clock',
      color: 'yellow',
      trend: statsData.showTrends && statsData.trends?.pending ? statsData.trends.pending : undefined
    };
  }
}