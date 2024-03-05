import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'transparent' = 'primary';
  @Input() size: 'default' | 'compact' = 'default';
  @Input() disabled: boolean = false;
}
