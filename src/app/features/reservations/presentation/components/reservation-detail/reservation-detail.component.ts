import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationsFacade } from '../../../application/facades/reservations.facade';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ReservationBase } from '@shared/domain/models/reservation-base.model';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.scss']
})
export class ReservationDetailComponent implements OnInit {
  private facade = inject(ReservationsFacade);
  @Input() id!: string;
  reservation: ReservationBase | null = null;
  @Input() close?: () => void;

  ngOnInit(): void {
    if (this.id) {
      this.facade.loadDetail(this.id);
      this.facade.reservationById$(this.id).subscribe(r => this.reservation = r);
    }
  }
}
