import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatPaginator,
  MatSelectChange,
  MatTableDataSource,
} from '@angular/material';

import { DbService } from '../../services/db.service';
import {
  IBathPlacePosition,
  IDiscount,
  IPlace,
  IProduct,
  IProductPosition,
} from '../../services/interfaces';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrderComponent implements OnInit {
  form: FormGroup;
  products: IProduct[];
  productPositions: IProductPosition[] = [];
  productSource = new MatTableDataSource<IProductPosition>();

  displayedColumns: string[] = ['name', 'count', 'totalPrice'];
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

    this.form = new FormGroup({
      product: new FormControl(),
      quantity: new FormControl(0, [Validators.min(1)]),
      price: new FormControl(0),
    });

    this.db.getProduct().subscribe(x => this.products = x);

    this.dataSource = new MatTableDataSource<IBathPlacePosition>(this.positions);
    this.dataSource.paginator = this.paginator;
    this.db.getDiscount().subscribe(x => this.discounts = x);
  }

  createOrder() {
    const places = this.positions.map(x => Object.assign({ id: x.bathId, duration: x.duration, discountId: x.discountId }));

    const products = this.productPositions.map(x => {
      return { id: x.id, quantity: x.count };
    });
    this.dialogRef.close({ places, type: this.payment, products });
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
    return this.positions.reduce((sum, val) => sum += this.recalc(val), 0)
      + this.productPositions.reduce((sum, val) => sum += val.totalPrice, 0);
  }

  recalc(p: IBathPlacePosition) {
    return (p.discountId ? p.discountValue : p.cost) / 60 * p.duration;
  }

  onChange(event: MatSelectChange) {
    this.form.controls['quantity'].setValue(1);
    this.form.controls['price'].setValue(this.products.filter(x => x.id === event.value)[0].price);
  }

  onQuantityChange() {
    const id = this.form.controls['product'].value;
    const price = this.products.filter(x => x.id === id)[0].price;
    const quantity = this.form.controls['quantity'].value;
    this.form.controls['price'].setValue(price * quantity);
  }

  track(_: number, pos: IProductPosition) {
    return pos.id;
  }

  addProduct() {
    const id = this.form.controls['product'].value;
    if (id != null && this.form.valid) {
      const product = this.products.filter(x => x.id === id)[0];
      const count = this.form.controls['quantity'].value;
      const totalPrice = this.form.controls['price'].value;

      const newElement = <IProductPosition>{id, name: product.name, count, totalPrice };
      const alreadyExist = this.productPositions.filter(x => x.id === newElement.id);
      if (alreadyExist.length) {
        this.productPositions = this.productPositions.filter(x => x.id !== newElement.id);
        newElement.count += alreadyExist[0].count;
        newElement.totalPrice = product.price * newElement.count;
      }

      this.productPositions = [ ...this.productPositions, newElement];
      this.productSource = new MatTableDataSource(this.productPositions);
    }
  }

  getTotalPrice() {
    return this.productPositions.reduce((total, x) => total + x.totalPrice, 0);
  }
}
