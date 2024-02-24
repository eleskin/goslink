import {Component, Input} from '@angular/core';
import {NgIf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    NgIf,
    NgOptimizedImage,
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent {
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() value = '';
  @Input() prompt = ''
}
