import { ChangeDetectorRef, QueryList } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { PlaceDirective } from 'src/app/directives/place.directive';
import { DbService } from 'src/app/services/db.service';
import { HubService } from 'src/app/services/hub.service';
import { IBathPlacePosition, IBathPrice, IPlace } from 'src/app/services/interfaces';

import { AlertComponent } from '../alert/alert.component';
import { CancelOrderComponent } from '../cancel-order/cancel-order.component';
import { CreateOrderComponent } from '../create-order/create-order.component';


export class SittingPlaces {
         intervalId: any;
         sittingPlaces: IPlace[];
         price: IBathPrice;
         positions: IBathPlacePosition[];
         durationMap = new Map<string, number>();
         sub: Subscription;

         _placeListQuery: QueryList<PlaceDirective>;

         constructor(
           private room: 'men' | 'women',
           protected db: DbService,
           protected dialog: MatDialog,
           protected hub: HubService,
           protected cd: ChangeDetectorRef
         ) {}

         createOrder() {
           const data = this.sittingPlaces.filter(p => this.getSelectedNames().includes(p.name));
           const dialogRef = this.dialog.open(CreateOrderComponent, {
             panelClass: 'no-padding-modal',
             width: '650px',
             data,
           });

           dialogRef.beforeClose().subscribe(res => {
             if (res) {
               this.db.createOrder({ ...res, room: this.room }).subscribe();
               this.removeSelection();
             }
           });
         }

         updateMessage() {
           this.durationMap.forEach((_v, name) => {
             this.durationMap.set(name, this.minutesFormat(name));
           });
           this.cd.markForCheck();
         }

         initPositions() {
           this.db.getBusyPlaces(this.room).subscribe(res => this.getPositions(res));
         }

         alreadyTaken() {
           return this.getSelectedNames().filter(x => this.durationMap.has(x)).length !== 0;
         }

         alreadyFree() {
           return !(this.getSelected().length && this.getSelectedNames().every(x => this.durationMap.has(x)));
         }

         canChange() {
           if (this.getSelected().length !== 2) {
             return false;
           }

           const selectedPlaces = this.getSelected().filter(x => this.durationMap.has(x.name));
           if (selectedPlaces.length !== 1) {
             return false;
           }

           const p1 = selectedPlaces[0];
           const p2 = this.getSelected().filter(x => x.name !== p1.name)[0];

           if (p1.cab && !p2.cab) {
             return false;
           }

           return true;
         }

         isFree(elem: Element): string {
           const name = elem.textContent;
           if (this.durationMap.has(name)) {
             const val = this.durationMap.get(name);
             if (val < 0) {
               return 'timedout';
             } else if (val <= 15) {
               return 'time-warning';
             } else {
               return 'busy';
             }
           }
         }

         freePlaces() {
           const selected = this.positions.filter(x => this.getSelectedNames().includes(x.bathName));
           const current = moment(new Date());
           const orders = selected
             .filter(x => moment(x.end) > current)
             .map(x => x.orderId)
             .filter((x, idx, arr) => idx === arr.indexOf(x));
           const ids = selected.map(x => Object.assign({ id: x.bathId }));

           if (orders.length) {
             const data = this.positions.filter(x => orders.includes(x.orderId));

             const dialogRef = this.dialog.open(CancelOrderComponent, {
               width: '450px',
               data,
             });

             dialogRef.beforeClose().subscribe(res => {
               if (res) {
                 if (!res.error) {
                   this.setFreePlaces(ids);
                 } else {
                   this.db.cancelOrders({ ...res, room: this.room, bathIds: ids.map(x => x.id) }).subscribe();
                   this.removeSelection();
                 }
               }
             });
           } else {
             this.setFreePlaces(ids);
           }
         }

         getMessage(elemName: Element) {
           if (this.durationMap.has(elemName.textContent)) {
             return this.durationMap[elemName.textContent];
           }
           return '';
         }

         minuteToDate(minutes: number) {
           if (minutes) {
             minutes = Math.abs(minutes);
             let hh = Math.floor(minutes / 60).toString();
             let mm = Math.floor(minutes % 60).toString();
             let result = '';
             let offset = '';

             if (hh !== '0') {
               hh = hh + ' ч';
               result += hh;
               offset = ' ';
             }
             if (mm) {
               mm = offset + mm + ' м';
               result += mm;
             }

             return result;
           }
         }

         addTime() {
           const ids = this.sittingPlaces
             .filter(p => this.getSelectedNames().includes(p.name))
             .map(x => Object.assign({ id: x.id }));

           this.db.addTime(ids, this.room).subscribe();
           this.removeSelection();
         }

         changePlaces() {
           const selectedPlaces = this.getSelected().filter(x => this.durationMap.has(x.name));
           const p1 = selectedPlaces[0];
           const selected = this.positions.filter(x => x.bathName === p1.name);

           if (selected.length) {
             const pos = selected[0];
             const p2 = this.getSelected().filter(x => x.name !== p1.name)[0];
             const diff = p1.cab === p2.cab ? 0 : (this.price.price * pos.duration) / 60 - pos.cost;

             const dialogRef = this.dialog.open(AlertComponent, {
               width: '350px',
               data: { diff, to: p2.name, from: p1.name },
             });

             dialogRef.beforeClose().subscribe(res => {
               if (res) {
                 this.db.exchangePlaces(p1.name, p2.name, this.room).subscribe();
                 this.removeSelection();
               }
             });
           }
         }

         private getSelectedNames() {
           return this.getSelected().map(x => x.name);
         }

         private getSelected() {
           return this._placeListQuery ? this._placeListQuery.filter(x => x.selected) : [];
         }

         private removeSelection() {
           this.getSelected().forEach(x => x.removeSelection());
         }

         private setFreePlaces(ids: any) {
           this.db.freePlaces(ids, this.room).subscribe();
           this.removeSelection();
         }

         private getPositions(positions: IBathPlacePosition[]) {
           this.positions = positions;
           this.durationMap.clear();
           positions.forEach(val => this.durationMap.set(val.bathName, null));

           clearInterval(this.intervalId);
           this.intervalId = setInterval(() => this.updateMessage(), 1000 * 60);

           setTimeout(() => this.updateMessage());
         }

         private minutesFormat(name: string) {
           if (this.positions) {
             const position = this.positions.find(x => x.bathName === name);

             if (position) {
               const current = moment(new Date());
               const end = moment(position.end);
               return end.diff(current, 'minutes');
             }
           }
           return null;
         }
       }
