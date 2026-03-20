import { Component, OnInit } from '@angular/core';
import { EmployeesBasicService } from './employeesBasic.service';
import { EmployeesBasic } from './employeesBasic.interface';

@Component({
  selector: 'app-employeesBasic-table',
  templateUrl: './employeesBasic-table.component.html'
})
export class EmployeesBasicTableComponent implements OnInit {
  employeesBasicData: EmployeesBasic[] = [];

  constructor(private service: EmployeesBasicService){}

  ngOnInit(){
    this.service.getAll().subscribe(data => this.employeesBasicData = data);
  }
}