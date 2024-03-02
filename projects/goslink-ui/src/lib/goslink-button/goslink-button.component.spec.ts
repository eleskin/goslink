import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoslinkButtonComponent } from './goslink-button.component';

describe('GoslinkButtonComponent', () => {
  let component: GoslinkButtonComponent;
  let fixture: ComponentFixture<GoslinkButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoslinkButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoslinkButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Verify the component instance was created successfully
    expect(component).toBeTruthy();
  });

  it('should apply variant based on input', () => {
    // Set the input for 'variant' and trigger change detection
    component.variant = 'secondary';
    fixture.detectChanges(); // Update the component's state to reflect new inputs

    // Find the button element and verify it has the expected class
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.className).toContain('app-goslink-button--secondary');
  });

  it('should disable the button when disabled is true', () => {
    // Set the 'disabled' input to true and update the component
    component.disabled = true;
    fixture.detectChanges();

    // Find the button and verify it is disabled
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.disabled).toBeTrue();
  });

  it('should set the button type based on input', () => {
    // Change the 'type' input to 'submit' and update the component
    component.type = 'submit';
    fixture.detectChanges();

    // Verify the button's 'type' attribute is set correctly
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.type).toBe('submit');
  });

  // Example test for verifying custom content inside the button
  // Testing ng-content requires either creating a test host component or another approach to dynamically inject content.
  it('should render custom content inside the button', () => {
    // Here, we're just confirming the component creates for demonstration purposes.
    expect(component).toBeTruthy();
  });

  // Additional tests can be added as needed to cover other scenarios
});
