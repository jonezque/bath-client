import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { IBathPlacePosition } from '../../services/interfaces';

@Component({
  selector: 'app-cancel-order',
  templateUrl: './cancel-order.component.html',
  styleUrls: ['./cancel-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelOrderComponent implements OnInit {
  data = {};
  keys = [];
  reason = '1';
  reasonText = '';

  constructor(@Inject(MAT_DIALOG_DATA) private orders: IBathPlacePosition[],
    private dialogRef: MatDialogRef<CancelOrderComponent>) { }

  ngOnInit() {
    this.data = this.orders.reduce((prev, cur) => {
      if (!prev[cur.orderId]) {
        prev[cur.orderId] = [];
      }
      prev[cur.orderId].push(cur.bathName);
      return prev;
    }, {});

    this.keys = Object.keys(this.data);
  }

  confirm(confirmed: boolean) {
    if (!confirmed) {
      this.dialogRef.close();
    } else {
      const result = this.reason === '1' ?
        { error: true, reason: this.reasonText, orderIds: this.keys } : { error: false };
      this.dialogRef.close(result);
    }
  }
}
