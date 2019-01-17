import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appPlacePrice]',
  exportAs: 'priceType'
})
export class PlacePriceDirective {
  @Input() id: number;
  @Input() val: any;

  public get price(): any {
    return this.val.value;
  }
  public set price(value: any) {
    this.val.value = value;
  }

  constructor() { }

}
