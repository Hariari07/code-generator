import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmployeesBasic } from './employeesBasic.interface';

@Injectable({ providedIn: 'root' })
export class EmployeesBasicService {
  constructor(private http: HttpClient) {}

  getAll(){
    return this.http.get<EmployeesBasic[]>('/api/employeesBasic');
  }

  getById(id: number){
    return this.http.post<EmployeesBasic>('/api/employeesBasic/getOne', { id });
  }
}