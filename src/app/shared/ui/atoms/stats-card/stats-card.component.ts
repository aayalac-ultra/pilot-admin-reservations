import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatsCardData {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'gray';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss']
})
export class StatsCardComponent {
  data = input.required<StatsCardData>();

  getCardClasses(): string {
    const baseClasses = 'stats-card';
    const colorClass = `stats-card--${this.data().color}`;
    return `${baseClasses} ${colorClass}`;
  }

  getIconClasses(): string {
    const color = this.data().color;
    const colorMappings = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      purple: 'bg-purple-100 text-purple-600',
      gray: 'bg-gray-100 text-gray-600'
    };

    return `stats-card__icon ${colorMappings[color]}`;
  }

  getTrendClasses(): string {
    const trend = this.data().trend;
    if (!trend) return '';

    return trend.isPositive ? 'text-green-600' : 'text-red-600';
  }

  getTrendIcon(): string {
    const trend = this.data().trend;
    if (!trend) return '';

    return trend.isPositive ? 'pi pi-arrow-up' : 'pi pi-arrow-down';
  }
}
