import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs/operators';

import { DbService } from '../../services/db.service';
import { IBathPrice, IProduct, PlaceType, RoomType } from '../../services/interfaces';
import { CreateDiscountComponent } from '../create-discount/create-discount.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  productDataSource: MatTableDataSource<IProduct>;
  selectedProduct: IProduct | null;

  placesDataSource: MatTableDataSource<IBathPrice>;
  selectedBathPrice: IBathPrice | null;

  displayedProductColumns: string[] = ['pos', 'name', 'price'];
  displayedPlaceColumns: string[] = ['pos', 'room', 'type', 'price'];

  constructor(private dialog: MatDialog, private db: DbService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.db.getProduct().subscribe(x => {
      this.productDataSource = new MatTableDataSource(x);
      this.cd.markForCheck();
    });

    this.db.getPrices().subscribe(x => {
      this.placesDataSource = new MatTableDataSource(x);
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
            this.productDataSource = new MatTableDataSource(x);
            this.cd.markForCheck();
          });
      }
    });
  }

  deleteProduct(data: IProduct) {
    this.db.deleteProduct(data.id)
      .pipe(switchMap(_ => this.db.getProduct()))
      .subscribe(x => {
        this.productDataSource = new MatTableDataSource(x);
        this.cd.markForCheck();
      });
  }

  getRoomName(p: IBathPrice) {
    return p.room === RoomType.men ? 'Мужское' : 'Женское';
  }

  getPlaceName(p: IBathPrice) {
    return p.type === PlaceType.normal ? 'Стандарт' : 'Кабинка';
  }

  changeBathPrice(p: IBathPrice) {
    const dialogRef = this.dialog.open(CreateDiscountComponent, {
      width: '250px',
      data: { ...p, type: 'bathprice' }
    });

    dialogRef.beforeClose().subscribe(res => {
      if (res) {
        this.db.setPrice({ price: res.value, id: res.id })
          .pipe(switchMap(_ => this.db.getPrices()))
          .subscribe(x => {
            this.placesDataSource = new MatTableDataSource(x);
            this.cd.markForCheck();
          });
      }
    });
  }

  track(_: number, product: IProduct) {
    return product.id;
  }
}
