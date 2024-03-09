import {Component, effect, inject, Input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import InterfaceStore from '../../store/interface/interface.store';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
  ],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.css',
})
export class ContextMenuComponent {
  @Input() visible = false;

  private readonly interfaceStore = inject(InterfaceStore);

  protected actions = this.interfaceStore.actions();

  constructor() {
    effect(() => {
      this.actions = this.interfaceStore.actions().map((action) => ({
        ...action,
        function: () => {
          this.interfaceStore.setMenuCoordinates({mouseX: -1, mouseY: -1});
          action.function();
        },
      }));
    });
  }
}
