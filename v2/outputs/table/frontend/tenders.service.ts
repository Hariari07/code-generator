import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tenders } from './tenders.interface';

@Injectable({ providedIn: 'root' })
export class TendersService {
  constructor(private http: HttpClient) {}

  getAll(){
    return this.http.get<Tenders[]>('/api/tenders');
  }

  getById(id: number){
    return this.http.post<Tenders>('/api/tenders/getOne', { id });
  }
}