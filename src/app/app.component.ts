import {Component, effect, HostListener, inject} from '@angular/core';
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
  private readonly interfaceStore = inject(InterfaceStore);
  protected mouseX = this.interfaceStore.mouseX();
  protected mouseY = this.interfaceStore.mouseY();

  constructor() {
    effect(() => {
      this.mouseX = this.interfaceStore.mouseX();
      this.mouseY = this.interfaceStore.mouseY();
    });
  }

  ngOnInit(): void {
    this.adjustHeight();
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
