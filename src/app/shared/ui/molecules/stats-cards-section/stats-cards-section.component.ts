import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCardComponent, type StatsCardData } from '../../atoms/stats-card/stats-card.component';

export interface StatsCardsData {
  totalReservations: number;
  confirmedReservations: number;
  pendingReservations: number;
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
      value: statsData.totalReservations.toLocaleString(),
      icon: 'pi pi-calendar',
      color: 'gray',
      trend: statsData.showTrends && statsData.trends?.total ? statsData.trends.total : undefined
    };
  }

  getConfirmedReservationsCard(): StatsCardData {
    const statsData = this.data();
    return {
      title: 'Confirmadas',
      value: statsData.confirmedReservations.toLocaleString(),
      icon: 'pi pi-check-circle',
      color: 'green',
      trend: statsData.showTrends && statsData.trends?.confirmed ? statsData.trends.confirmed : undefined
    };
  }

  getPendingReservationsCard(): StatsCardData {
    const statsData = this.data();
    return {
      title: 'Pendientes',
      value: statsData.pendingReservations.toLocaleString(),
      icon: 'pi pi-clock',
      color: 'orange',
      trend: statsData.showTrends && statsData.trends?.pending ? statsData.trends.pending : undefined
    };
  }
}
