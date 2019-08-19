import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SparkConfigComponent } from './spark-config.component';

describe('SparkConfigComponent', () => {
  let component: SparkConfigComponent;
  let fixture: ComponentFixture<SparkConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SparkConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SparkConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
