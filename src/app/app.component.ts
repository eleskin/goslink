import {Component, HostListener} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {MainComponent} from './components/main/main.component';

import 'normalize.css';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgOptimizedImage, HeaderComponent, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  ngOnInit() {
    this.adjustHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.adjustHeight();
  }

  adjustHeight() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }
}
