import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { switchMap } from 'rxjs/operators';
import { DbService } from 'src/app/services/db.service';
import { IProduct } from 'src/app/services/interfaces';

import { CreateDiscountComponent } from '../create-discount/create-discount.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  dataSource: MatTableDataSource<IProduct>;
  selectedElement: IProduct | null;

  displayedColumns: string[] = ['pos', 'name', 'price'];

  constructor(private dialog: MatDialog, private db: DbService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.db.getProduct().subscribe(x => {
      this.dataSource = new MatTableDataSource(x);
      this.cd.markForCheck();
    });
  }

  createProduct(data: IProduct = null) {
    const dialogRef = this.dialog.open(CreateDiscountComponent, {
      width: '250px',
      data: { ...data, type: 'product' }
    });

    dialogRef.beforeClose().subscribe(res => {
      if (res) {
        this.db.createProduct(Object.assign({ price: res.value }, ...res))
          .pipe(switchMap(_ => this.db.getProduct()))
          .subscribe(x => {
            this.dataSource = new MatTableDataSource(x);
            this.cd.markForCheck();
          });
      }
    });
  }

  deleteProduct(data: IProduct) {
    this.db.deleteProduct(data.id)
      .pipe(switchMap(_ => this.db.getProduct()))
      .subscribe(x => {
        this.dataSource = new MatTableDataSource(x);
        this.cd.markForCheck();
      });
  }

  track(_: number, product: IProduct) {
    return product.id;
  }
}
