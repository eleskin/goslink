import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appFullHeight]',
  standalone: true
})
export class FullHeightDirective {
  constructor(private element: ElementRef) {
    this.adjustHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.adjustHeight();
  }

  private adjustHeight(): void {
    this.element.nativeElement.style.height = `${window.innerHeight}px`;
  }
}
