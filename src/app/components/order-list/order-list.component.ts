import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { filter } from 'rxjs/operators';

import { DbService } from '../../services/db.service';
import { FilterOrderService } from '../../services/filter-order.service';
import { HubService } from '../../services/hub.service';
import { IBathPlacePosition, IFilterConfig, IOrder } from '../../services/interfaces';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrderListComponent implements OnInit {
  dataSource: MatTableDataSource<IOrder>;
  displayedColumns = ['num', 'totalCost', 'type', 'canceled', 'comment', 'modified', 'room'];
  expandedElement: IOrder | null;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private db: DbService, private filterService: FilterOrderService, private hub: HubService) { }

  trackOrder(_: number, order: IOrder) {
    return order.id;
  }

  trackPos(_: number, pos: IBathPlacePosition) {
    return pos.id;
  }

  ngOnInit() {
    this.filterService.filterConfig$.subscribe(x => this.init(x));
    this.hub.message
      .pipe(filter(x => x === 'men' || x === 'women'))
      .subscribe(x => this.init(this.filterService.filterConfig$.value));
  }

  init(f: IFilterConfig) {
    this.db.getOrders(f).subscribe(x => {

      this.dataSource = new MatTableDataSource(x);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getTotal() {
    return this.dataSource && this.dataSource.data
      .filter(x => !x.canceled)
      .reduce((prev, cur) => prev + cur.totalCost, 0);
  }

  convertTime(date: Date) {
    return new Date(date);
  }
}
