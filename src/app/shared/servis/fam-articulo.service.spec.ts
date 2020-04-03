import { TestBed } from '@angular/core/testing';

import { FamArticuloService } from './fam-articulo.service';

describe('FamArticuloService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FamArticuloService = TestBed.get(FamArticuloService);
    expect(service).toBeTruthy();
  });
});
