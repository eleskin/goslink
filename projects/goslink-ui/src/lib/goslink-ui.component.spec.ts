import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoslinkUiComponent } from './goslink-ui.component';

describe('GoslinkUiComponent', () => {
  let component: GoslinkUiComponent;
  let fixture: ComponentFixture<GoslinkUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoslinkUiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoslinkUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
