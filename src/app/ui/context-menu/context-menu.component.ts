import {Component, Input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
  ],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.css'
})
export class ContextMenuComponent {
  @Input() visible = false;

  protected actionsList = [
    {text: 'Delete chat', action: () => console.log('Delete chat')},
    {text: 'Open chat in new tab', action: () => console.log('Open chat in new tab')},
    {text: 'Mute chat', action: () => console.log('Mute chat')},
  ];
}
