import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { FilterOrderService } from 'src/app/services/filter-order.service';

@Component({
  selector: 'app-filter-orders',
  templateUrl: './filter-orders.component.html',
  styleUrls: ['./filter-orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterOrdersComponent implements OnInit {
  formGroup: FormGroup;
  showEndDate: boolean;

  constructor(private filterService: FilterOrderService,
    private dialogRef: MatDialogRef<FilterOrdersComponent>) { }

  ngOnInit() {
    const config = this.filterService.filterConfig$.value;

    this.formGroup = new FormGroup({
      room: new FormControl(config.room),
      payment: new FormControl(config.payment),
      status: new FormControl(config.status),
      date: new FormControl(config.date),
      start: new FormControl(config.start),
      end: new FormControl(config.end),
   });

   this.showEndDate = config.date === 'interval';
  }

  dateControlChanged(ev: MatRadioChange) {
    this.showEndDate = ev.value === 'interval';
  }

  submit() {
    this.filterService.filterConfig$.next(this.formGroup.value);
    this.dialogRef.close();
  }
}
