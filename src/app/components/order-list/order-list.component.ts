import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { DbService } from '../../services/db.service';
import { IOrder } from '../../services/interfaces';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrderListComponent implements OnInit {
  private orders: IOrder[];
  dataSource: MatTableDataSource<IOrder>;
  displayedColumns = ['num', 'totalCost', 'type', 'canceled', 'comment' , 'modified'];
  expandedElement: IOrder | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private db: DbService) { }

  ngOnInit() {
    this.db.getOrders().subscribe(x => {
      this.orders = x;
      this.dataSource = new MatTableDataSource(x);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getTotal() {
    return this.orders && this.orders.filter(x => !x.canceled).reduce((prev, cur) => prev + cur.totalCost, 0);
  }

  convertToLocal(date: Date) {
    return new Date(date + 'Z');
  }
}
