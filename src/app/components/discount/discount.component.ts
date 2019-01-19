import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { switchMap } from 'rxjs/operators';

import { DbService } from '../../services/db.service';
import { IDiscount } from '../../services/interfaces';
import { CreateDiscountComponent } from '../create-discount/create-discount.component';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscountComponent implements OnInit {
  dataSource: MatTableDataSource<IDiscount>;
  selectedElement: IDiscount | null;

  displayedColumns: string[] = ['pos', 'name', 'val'];

  constructor(private dialog: MatDialog, private db: DbService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.db.getDiscount().subscribe(x => {
      this.dataSource = new MatTableDataSource(x);
      this.cd.markForCheck();
    });
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
          .subscribe(x => {
            this.dataSource = new MatTableDataSource(x);
            this.cd.markForCheck();
          });
      }
    });
  }

  deleteDiscount(data: IDiscount) {
    this.db.deleteDiscount(data.id)
      .pipe(switchMap(_ => this.db.getDiscount()))
      .subscribe(x => {
        this.dataSource = new MatTableDataSource(x);
        this.cd.markForCheck();
      });
  }

  track(_:number, discount: IDiscount) {
    return discount.id;
  }
}
