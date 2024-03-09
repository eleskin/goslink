import {Component, effect, ElementRef, HostListener, inject, ViewChild} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {MainComponent} from './components/main/main.component';

import 'normalize.css';
import {ContextMenuComponent} from './ui/context-menu/context-menu.component';
import InterfaceStore from './store/interface/interface.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgOptimizedImage, MainComponent, ContextMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  @ViewChild('contextMenu') contextMenu: ElementRef | undefined;

  private readonly interfaceStore = inject(InterfaceStore);
  protected mouseX = this.interfaceStore.mouseX();
  protected mouseY = this.interfaceStore.mouseY();
  protected visibleContextMenu = false;

  constructor() {
    effect(() => {
      this.mouseX = this.interfaceStore.mouseX();
      this.mouseY = this.interfaceStore.mouseY();

      if (this.mouseX >= 0 && this.mouseY >= 0) this.visibleContextMenu = true;
    });
  }

  ngOnInit(): void {
    this.adjustHeight();
    document.addEventListener('click', this.handleClickOutside.bind(this), true);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleClickOutside.bind(this), true);
  }

  private handleClickOutside(event: MouseEvent): void {
    if (this.contextMenu && !this.contextMenu.nativeElement.contains(event.target)) {
      this.visibleContextMenu = false;
      setTimeout(() => {
        this.interfaceStore.setMenuCoordinates({mouseX: -1, mouseY: -1});
      }, 300);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.adjustHeight();
  }

  adjustHeight() {
    const vh = window.innerHeight / 100;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}
