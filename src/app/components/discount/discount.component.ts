import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { switchMap } from 'rxjs/operators';
import { DbService } from 'src/app/services/db.service';
import { IDiscount } from 'src/app/services/interfaces';

import { CreateDiscountComponent } from '../create-discount/create-discount.component';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {
  discounts: IDiscount[];
  selectedElement: IDiscount | null;

  displayedColumns: string[] = ['pos', 'name', 'val'];

  constructor(private dialog: MatDialog, private db: DbService) { }

  ngOnInit() {
    this.db.getDiscount().subscribe(x => this.discounts = x);
  }

  createDiscount(data: IDiscount = null) {
    const dialogRef = this.dialog.open(CreateDiscountComponent, {
      width: '250px',
      data
    });

    dialogRef.beforeClose().subscribe(res => {
      if (res) {
        this.db.createDiscount(res)
          .pipe(switchMap(_ => this.db.getDiscount()))
          .subscribe(x => this.discounts = x);
      }
    });
  }

  deleteDiscount(data: IDiscount) {
    this.db.deleteDiscount(data.id)
      .pipe(switchMap(_ => this.db.getDiscount()))
      .subscribe(x => this.discounts = x);
  }
}
