import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {routeTransitionAnimations} from '../../utils/routeTransitionAnimations';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  animations: [routeTransitionAnimations]
})
export class MainComponent {
  prepareRoute(outlet: RouterOutlet) {
    return outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animationState'];
  }
}
