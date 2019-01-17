import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatPaginator,
  MatTableDataSource,
} from '@angular/material';

import { DbService } from '../../services/db.service';
import { IBathPlacePosition, IDiscount, IPlace } from '../../services/interfaces';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {
  positions: IBathPlacePosition[];
  headers = ['place', 'time', 'discount', 'cost'];
  dataSource: MatTableDataSource<IBathPlacePosition>;
  discounts: IDiscount[];
  payment = '0';


  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(@Inject(MAT_DIALOG_DATA) private places: IPlace[],
    private dialogRef: MatDialogRef<CreateOrderComponent>,
    private db: DbService) { }

  ngOnInit() {
    this.positions = this.places.map(x => <IBathPlacePosition>{
      bathId: x.id,
      bathName: x.name,
      cost: x.price,
      duration: 90,
      type: x.type,
    });

    this.dataSource = new MatTableDataSource<IBathPlacePosition>(this.positions);
    this.dataSource.paginator = this.paginator;
    this.db.getDiscount().subscribe(x => this.discounts = x);
  }

  createOrder() {
    const places = this.positions.map(x => Object.assign({ id: x.bathId, duration: x.duration, discountId: x.discountId }));
    this.dialogRef.close({ places, type: this.payment });
  }

  changeDuration(p: IBathPlacePosition, v: number) {
    p.duration = v;
  }

  changeDiscount(p: IBathPlacePosition, v: number) {
    p.discountValue = v;
    const d = this.discounts.find(x => x.value === v);
    p.discountId = d && d.id;
  }

  getTotalCost() {
    return this.positions.reduce((sum, val) => sum += this.recalc(val), 0);
  }

  recalc(p: IBathPlacePosition) {
    return (p.discountId ? p.discountValue : p.cost) / 60 * p.duration;
  }
}
