import { Component, OnInit } from '@angular/core';
import { TableReserveDestinationService } from '../../services/table-reserve-destination.service';
import { ReserveDestination } from '../../models/reserve-destination';

@Component({
  selector: 'app-reserves',
  imports: [],
  templateUrl: './reserves.component.html',
  styleUrl: './reserves.component.css'
})
export class ReservesComponent implements OnInit {
  allDestinationReserve: ReserveDestination[] = [];


  constructor(
    private tableReserveDestinationService: TableReserveDestinationService) { }

  ngOnInit(): void {
    this.selectReservesDestination();
  }

  selectReservesDestination() {
    this.tableReserveDestinationService.selectInReserveDestination().then((res) => {
      this.allDestinationReserve = res;
      console.log('Reserves:', res);
    }).catch((error) => {
      console.error('Error fetching reserves:', error);
    });
  }

}
