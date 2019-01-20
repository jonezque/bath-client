import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { filter, flatMap } from 'rxjs/operators';

import { PlaceDirective } from '../../directives/place.directive';
import { DbService } from '../../services/db.service';
import { HubService } from '../../services/hub.service';
import {
  IBathPlacePosition,
  IBathPrice,
  IPlace,
  PlaceType,
  RoomType,
} from '../../services/interfaces';
import { AlertComponent } from '../alert/alert.component';
import { CancelOrderComponent } from '../cancel-order/cancel-order.component';
import { CreateOrderComponent } from '../create-order/create-order.component';

@Component({
  selector: 'app-sitting-places-men',
  templateUrl: './sitting-places-men.component.html',
  styleUrls: ['./sitting-places-men.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SittingPlacesMenComponent implements OnInit, OnDestroy {
  placesTop = new Array<number>(16);
  placesRight = new Array<number>(8);
  placesLane = new Array<number>(18);
  intervalId: any;

  sittingPlaces: IPlace[];
  price: IBathPrice;
  positions: IBathPlacePosition[];
  durationMap = new Map<string, number>();
  sub: Subscription;

  @ViewChildren(PlaceDirective) placeListQuery: QueryList<PlaceDirective>;

  constructor(private db: DbService, private dialog: MatDialog, private hub: HubService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.db.getSittingPlacesM().subscribe(res =>
      this.sittingPlaces = res
    );

    this.updatePrice();

    this.initPositions();
    this.intervalId = setInterval(() => this.updateMessage(), 1000 * 60);

    this.sub = this.hub.message.subscribe(data => {
      if (data === 'updated') {
        this.initPositions();
      } else if (data === 'updatePrice') {
        this.updatePrice();
      }
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    this.sub.unsubscribe();
  }

  createOrder() {
    const data = this.sittingPlaces.filter(p => this.getSelectedNames().includes(p.name));
    const dialogRef = this.dialog.open(CreateOrderComponent, {
      width: '550px',
      data
    });

    dialogRef.beforeClose().subscribe(res => {
      if (res) {
        this.db.createOrder(res).subscribe();
        this.removeSelection();
      }
    });
  }

  alreadyTaken() {
    return this.getSelectedNames().length &&
      this.getSelectedNames()
      .filter(x => this.durationMap.has(x)).length !== 0;
  }

  alreadyFree() {
    return !(this.getSelected().length &&
      this.getSelectedNames()
      .every(x => this.durationMap.has(x)));
  }

  canChange() {
    if (this.getSelected().length !== 2)
      return false;

    const selectedPlaces = this.getSelected().filter(x => this.durationMap.has(x.name));
    if (selectedPlaces.length != 1)
      return false;

    const p1 = selectedPlaces[0];
    const p2 = this.getSelected().filter(x => x.name !== p1.name)[0];

    if(p1.cab && !p2.cab)
      return false;

    return true;
  }

  isFree (elem: Element): string {
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
            this.db.cancelOrders(res).subscribe();
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
      let hh = (Math.floor(minutes / 60)).toString();
      let mm = (Math.floor(minutes % 60)).toString();
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

    this.db.addTime(ids).subscribe();
    this.removeSelection();
  }

  changePlaces() {
    const selectedPlaces = this.getSelected().filter(x => this.durationMap.has(x.name));
    const p1 = selectedPlaces[0];
    const selected = this.positions.filter(x => x.bathName === p1.name);

    if (selected.length) {
      const pos = selected[0];
      const p2 = this.getSelected().filter(x => x.name !== p1.name)[0];
      const diff = p1.cab === p2.cab ? 0 : (this.price.price * pos.duration / 60) - pos.cost;

      const dialogRef = this.dialog.open(AlertComponent, {
        width: '350px',
        data: { diff, to: p2.name, from: p1.name },
      });

      dialogRef.beforeClose().subscribe(res => {
        if (res) {
          this.db.exchangePlaces(p1.name, p2.name).subscribe();
          this.removeSelection();
        }
      });
    }
  }

  private removeSelection() {
    this.getSelected().forEach(x => x.removeSelection());
  }

  private initPositions() {
    this.db.getBusyPlaces().subscribe(res =>
      this.getPositions(res)
    );
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

  private getPositions(positions: IBathPlacePosition[]) {
    this.positions = positions;
    this.durationMap.clear();
    positions.forEach(val => this.durationMap.set(val.bathName, null));

    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => this.updateMessage(), 1000 * 60);

    setTimeout(() => this.updateMessage());
  }

  private updateMessage() {
    this.durationMap.forEach((_v, name) => {
      this.durationMap.set(name, this.minutesFormat(name));
    });
    this.cd.markForCheck();
  }

  private setFreePlaces(ids: any) {
    this.db.freePlaces(ids).subscribe();
    this.removeSelection();
  }

  private getSelected() {
    return this.placeListQuery ? this.placeListQuery.filter(x => x.selected) : [];
  }
  private getSelectedNames() {
    return this.getSelected().map(x => x.name);
  }

  private updatePrice() {
    this.db.getPrices()
    .pipe(
      flatMap(x => x),
      filter(x => x.room === RoomType.men && x.type === PlaceType.cab))
    .subscribe(x => this.price = x);
  }
}
