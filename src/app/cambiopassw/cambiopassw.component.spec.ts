import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiopasswComponent } from './cambiopassw.component';

describe('CambiopasswComponent', () => {
  let component: CambiopasswComponent;
  let fixture: ComponentFixture<CambiopasswComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambiopasswComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiopasswComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
