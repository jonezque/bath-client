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
import { MatDialog } from '@angular/material';

import { PlaceDirective } from '../../../directives/place.directive';
import { DbService } from '../../../services/db.service';
import { HubService } from '../../../services/hub.service';
import { SittingPlaces } from '../sitting-places';

@Component({
  selector: 'app-sitting-places-men',
  templateUrl: './sitting-places-men.component.html',
  styleUrls: ['./sitting-places-men.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SittingPlacesMenComponent extends SittingPlaces implements OnInit, OnDestroy, AfterViewInit {
  placesTop = new Array<number>(16);
  placesRight = new Array<number>(8);
  placesLane = new Array<number>(18);

  @ViewChildren(PlaceDirective) placeListQuery: QueryList<PlaceDirective>;

  constructor(protected db: DbService, protected dialog: MatDialog, protected hub: HubService, protected cd: ChangeDetectorRef) {
    super('men', db, dialog, hub, cd);
  }

  ngOnInit() {
    this.db.getSittingPlaces('men').subscribe(res =>
      this.sittingPlaces = res
    );

    super.initPositions();
    this.intervalId = setInterval(() => super.updateMessage(), 1000 * 60);

    this.sub = this.hub.message.subscribe(data => {
      if (data === 'men') {
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
