import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {ButtonComponent} from '../../ui/button/button.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    NgOptimizedImage,
    ButtonComponent,
    RouterLink,
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

}
