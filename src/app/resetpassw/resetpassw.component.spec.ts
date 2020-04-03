import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpasswComponent } from './resetpassw.component';

describe('ResetpasswComponent', () => {
  let component: ResetpasswComponent;
  let fixture: ComponentFixture<ResetpasswComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetpasswComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetpasswComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
