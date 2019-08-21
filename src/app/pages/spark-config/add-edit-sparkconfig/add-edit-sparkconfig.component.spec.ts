import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSparkconfigComponent } from './add-edit-sparkconfig.component';

describe('AddEditSparkconfigComponent', () => {
  let component: AddEditSparkconfigComponent;
  let fixture: ComponentFixture<AddEditSparkconfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditSparkconfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSparkconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
