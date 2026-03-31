import { Component, OnInit } from '@angular/core';
import { TendersService } from './tenders.service';
import { Tenders } from './tenders.interface';

@Component({
  selector: 'app-tenders-table',
  templateUrl: './tenders-table.component.html'
})
export class TendersTableComponent implements OnInit {
  tendersData: Tenders[] = [];
  totalRecords = 0;
  loading = false;

  constructor(private service: TendersService){}

  ngOnInit(){
    this.loadTenders({ first:0, rows:20 });
  }

  loadTenders(event: any){
    this.loading = true;
    this.service.getAll().subscribe(data => {
      this.tendersData = data;
      this.totalRecords = data.length;
      this.loading = false;
    });
  }
}