import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IFilterConfig } from './interfaces';



@Injectable({
  providedIn: 'root'
})
export class FilterOrderService {
  filterConfig$ = new BehaviorSubject(<IFilterConfig>{
    room: 'both',
    payment: 'both',
    status: 'both',
    date: 'day',
    start: new Date(),
    end: new Date(),
  });
}
