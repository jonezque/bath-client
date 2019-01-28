import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import {
  IBathPlacePosition,
  IBathPrice,
  IDiscount,
  IFilterConfig,
  IOrder,
  IPlace,
} from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private http: HttpClient) { }

  getSittingPlaces(room: string): Observable<IPlace[]> {
    return this.http.get<IPlace[]>(`${environment.apiUrl}/api/products/getbathplaces?room=${room}`).pipe(
      map(val => this.toPlaces(val))
    );
  }

  getBusyPlaces(room: string): Observable<IBathPlacePosition[]> {
    return this.http.get<IBathPlacePosition[]>(`${environment.apiUrl}/api/orders/getbusyplaces?room=${room}`).pipe(
      map(val => this.toPositions(val))
    );
  }

  getOrders(filter: IFilterConfig) {
    let query = '?';
    for(const key in filter) {
      let data = filter[key];
      if (key === 'start' || key === 'end') {
        data = filter[key].toUTCString();
      }
      query += `${key}=${data || null}&`;
    }

    return this.http.get<IOrder[]>(`${environment.apiUrl}/api/orders${query}`);
  }

  createOrder(data: any) {
    return this.http.post(`${environment.apiUrl}/api/orders/createbathplaceorder`, Object.assign({...data, date: new Date()}));
  }

  cancelOrders(data: any) {
    return this.http.post(`${environment.apiUrl}/api/orders/cancelorders`, Object.assign({...data, date: new Date() }));
  }

  freePlaces(places: any, room: string) {
    return this.http.post(`${environment.apiUrl}/api/orders/freeplaces`, { places, room });
  }

  exchangePlaces(from: string, to: string, room: string) {
    return this.http.post(`${environment.apiUrl}/api/orders/exchangeplaces`, { from, to, room });
  }

  addTime(places: any, room: string) {
    return this.http.post(`${environment.apiUrl}/api/orders/addtime`, { places, room });
  }

  getPrices() {
    return this.http.get<IBathPrice[]>(`${environment.apiUrl}/api/prices`);
  }

  setPrices(prices: any) {
    return this.http.put(`${environment.apiUrl}/api/prices`, { prices });
  }

  createDiscount(discount: IDiscount) {
    if (discount.id) {
      return this.http.put(`${environment.apiUrl}/api/discounts/${discount.id}`, discount);
    } else {
      return this.http.post(`${environment.apiUrl}/api/discounts`, discount);
    }
  }

  deleteDiscount(id: number) {
    return this.http.delete(`${environment.apiUrl}/api/discounts/${id}`);
  }

  getDiscount() {
    return this.http.get<IDiscount[]>(`${environment.apiUrl}/api/discounts`);
  }

  private toPlaces(data: any[]): IPlace[] {
    return data.map(d => <IPlace>{
      id: d.id,
      name: d.name,
      type: d.type,
      price: d.price.price,
      room: d.room,
    });
  }

  private toPositions(data: any[]): IBathPlacePosition[] {
    return data.map(d => <IBathPlacePosition>{
      id: d.id,
      bathId: d.bathPlace.id,
      bathName: d.bathPlace.name,
      begin: d.begin,
      end: d.end,
      duration: d.duration,
      discountId: null,
      cost: d.cost,
      orderId: d.orderId,
    });
  }
}
