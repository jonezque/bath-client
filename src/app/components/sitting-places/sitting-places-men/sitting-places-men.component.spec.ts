import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SittingPlacesMenComponent } from './sitting-places-men.component';

describe('SittingPlacesComponent', () => {
  let component: SittingPlacesMenComponent;
  let fixture: ComponentFixture<SittingPlacesMenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SittingPlacesMenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SittingPlacesMenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
