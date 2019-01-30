import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SittingPlacesWomenComponent } from './sitting-places-women.component';

describe('SittingPlacesWomenComponent', () => {
  let component: SittingPlacesWomenComponent;
  let fixture: ComponentFixture<SittingPlacesWomenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SittingPlacesWomenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SittingPlacesWomenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
