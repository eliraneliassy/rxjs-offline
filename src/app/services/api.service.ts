import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  STORAGE_KEY = 'DB';
  BASE_URL = 'http://localhost:4700/address';

  constructor(private httpClient: HttpClient) { }

  getAddress(): any {
    return this.httpClient.get(`${this.BASE_URL}`);
  }
  saveAddress(address: any) {
    return this.httpClient.post(`${this.BASE_URL}`, address);
  }


}
