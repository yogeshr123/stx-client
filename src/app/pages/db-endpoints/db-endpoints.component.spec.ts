import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbEndpointsComponent } from './db-endpoints.component';

describe('DbEndpointsComponent', () => {
  let component: DbEndpointsComponent;
  let fixture: ComponentFixture<DbEndpointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbEndpointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbEndpointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
