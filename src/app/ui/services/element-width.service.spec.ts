import { TestBed } from '@angular/core/testing';

import { ElementWidthService } from './element-width.service';

describe('ElementWidthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ElementWidthService = TestBed.get(ElementWidthService);
    expect(service).toBeTruthy();
  });
});
