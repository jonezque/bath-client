import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { PlacePriceDirective } from '../../directives/place-price.directive';
import { DbService } from '../../services/db.service';
import { IBathPrice, PlaceType, RoomType } from '../../services/interfaces';

@Component({
  selector: 'app-bath-price',
  templateUrl: './bath-price.component.html',
  styleUrls: ['./bath-price.component.scss']
})
export class BathPriceComponent implements OnInit {

  prices: Array<IBathPrice>;
  @ViewChildren(PlacePriceDirective) priceForms: QueryList<PlacePriceDirective>;

  constructor(private db: DbService) { }

  ngOnInit() {
    this.db.getPrices().subscribe(x => this.prices = x);
  }

  getRoomName(p: IBathPrice) {
    return p.room === RoomType.men ? 'Мужское' : 'Женское';
  }

  getPlaceName(p: IBathPrice) {
    return p.type === PlaceType.normal ? 'Стандарт' : 'Кабинка';
  }

  changePrices() {
    const data = this.priceForms.map(x => Object.assign({id: x.id, price: x.price}));
    this.db.setPrices(data).subscribe();
  }

  reset() {
    this.db.getPrices().subscribe(x =>
      this.priceForms.forEach(f =>
        f.price = x.find(v => v.id === f.id).price
      )
    );
  }
}
