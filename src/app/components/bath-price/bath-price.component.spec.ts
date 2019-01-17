import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BathPriceComponent } from './bath-price.component';

describe('BathPriceComponent', () => {
  let component: BathPriceComponent;
  let fixture: ComponentFixture<BathPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BathPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BathPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
