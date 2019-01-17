import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { IDiscount } from '../../services/interfaces';

@Component({
  selector: 'app-create-discount',
  templateUrl: './create-discount.component.html',
  styleUrls: ['./create-discount.component.scss']
})
export class CreateDiscountComponent implements OnInit {
  form: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) private discount: IDiscount,
  private dialogRef: MatDialogRef<CreateDiscountComponent>) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(this.discount && this.discount.name, [Validators.required, Validators.minLength(2)]),
      value: new FormControl(this.discount && this.discount.value, [Validators.required, Validators.min(0)]),
    });
  }

  createDiscount() {
    if (this.form.valid) {
      let res = { ...this.form.value };
      const id = this.discount && this.discount.id;
      if (id) {
        res = Object.assign({ ...res, id });
      }

      this.dialogRef.close(res);
    }
  }
}
