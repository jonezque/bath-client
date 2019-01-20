import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FilterOrderService } from 'src/app/services/filter-order.service';

import { DbService } from '../../services/db.service';
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private db: DbService, private filterService: FilterOrderService) { }

  trackOrder(_:number, order : IOrder) {
    return order.id;
  }

  trackPos(_:number, pos : IBathPlacePosition) {
    return pos.id;
  }

  ngOnInit() {
    this.filterService.filterConfig$.subscribe(x => this.init(x))
  }

  init(filter: IFilterConfig) {
    this.db.getOrders(filter).subscribe(x => {
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
