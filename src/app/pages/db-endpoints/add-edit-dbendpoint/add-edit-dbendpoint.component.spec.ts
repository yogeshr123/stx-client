import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDbendpointComponent } from './add-edit-dbendpoint.component';

describe('AddEditDbendpointComponent', () => {
  let component: AddEditDbendpointComponent;
  let fixture: ComponentFixture<AddEditDbendpointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditDbendpointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditDbendpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
