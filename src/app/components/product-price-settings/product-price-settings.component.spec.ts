import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPriceSettingsComponent } from './product-price-settings.component';

describe('ProductListComponent', () => {
  let component: ProductPriceSettingsComponent;
  let fixture: ComponentFixture<ProductPriceSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductPriceSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPriceSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
