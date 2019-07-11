import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCmvPopupComponent } from './add-cmv-popup.component';

describe('AddCmvPopupComponent', () => {
  let component: AddCmvPopupComponent;
  let fixture: ComponentFixture<AddCmvPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCmvPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCmvPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
