import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appFullHeight]',
  standalone: true
})
export class FullHeightDirective {
  constructor(private el: any) {
    this.adjustHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.adjustHeight();
  }

  private adjustHeight(): void {
    this.el.nativeElement.style.height = `${window.innerHeight}px`;
  }
}
