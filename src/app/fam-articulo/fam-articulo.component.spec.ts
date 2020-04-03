import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamArticuloComponent } from './fam-articulo.component';

describe('FamArticuloComponent', () => {
  let component: FamArticuloComponent;
  let fixture: ComponentFixture<FamArticuloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamArticuloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamArticuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
