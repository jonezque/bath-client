import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HubService } from 'src/app/services/hub.service';

import { PlaceDirective } from '../../../directives/place.directive';
import { DbService } from '../../../services/db.service';
import { SittingPlaces } from '../sitting-places';

@Component({
  selector: 'app-sitting-places-women',
  templateUrl: './sitting-places-women.component.html',
  styleUrls: ['./sitting-places-women.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SittingPlacesWomenComponent extends SittingPlaces implements OnInit, OnDestroy, AfterViewInit {
  places8 = new Array<number>(8);
  places16 = new Array<number>(16);

  @ViewChildren(PlaceDirective) placeListQuery: QueryList<PlaceDirective>;

  constructor(protected db: DbService, protected dialog: MatDialog, protected hub: HubService, protected cd: ChangeDetectorRef)
  {
    super('women', db, dialog, hub, cd);
  }

  ngOnInit() {
    this.db.getSittingPlaces('women').subscribe(res =>
      this.sittingPlaces = res
    );

    super.initPositions();
    this.intervalId = setInterval(() => super.updateMessage(), 1000 * 60);

    this.sub = this.hub.message.subscribe(data => {
      if (data === 'women') {
        super.initPositions();
      }
    });
  }

  ngAfterViewInit(): void {
    this._placeListQuery = this.placeListQuery;
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    this.sub.unsubscribe();
  }

  createOrder() {
    super.createOrder();
  }

  alreadyTaken() {
    return super.alreadyTaken();
  }

  alreadyFree() {
    return super.alreadyFree();
  }

  canChange() {
    return super.canChange();
  }

  isFree (elem: Element): string {
    return super.isFree(elem);
  }

  freePlaces() {
    super.freePlaces();
  }

  getMessage(elemName: Element) {
    return super.getMessage(elemName);
  }

  minuteToDate(minutes: number) {
    return super.minuteToDate(minutes);
  }

  addTime() {
    super.addTime();
  }

  changePlaces() {
    super.changePlaces();
  }
}
