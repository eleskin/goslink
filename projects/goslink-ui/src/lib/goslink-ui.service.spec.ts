import { TestBed } from '@angular/core/testing';

import { GoslinkUiService } from './goslink-ui.service';

describe('GoslinkUiService', () => {
  let service: GoslinkUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoslinkUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
