import {Component, HostListener} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {MainComponent} from './components/main/main.component';

import 'normalize.css';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgOptimizedImage, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
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
