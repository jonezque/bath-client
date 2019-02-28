import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-create-discount',
  templateUrl: './create-discount.component.html',
  styleUrls: ['./create-discount.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateDiscountComponent implements OnInit {
  form: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public item: any,
  private dialogRef: MatDialogRef<CreateDiscountComponent>) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl((this.item && this.item.name) ||
       (this.item.type === 'bathprice' && 'bathprice') || '', [Validators.required, Validators.minLength(2)]),
      value: new FormControl(this.item && (this.item.value || this.item.price), [Validators.required, Validators.min(0)]),
    });
  }

  createDiscount() {
    if (this.form.valid) {
      let res = { ...this.form.value };
      const id = this.item && this.item.id;
      if (id) {
        res = Object.assign({ ...res, id });
      }

      this.dialogRef.close(res);
    }
  }
}
