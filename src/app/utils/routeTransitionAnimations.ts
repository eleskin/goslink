import {animate, animateChild, group, query, style, transition, trigger} from '@angular/animations';
export const routeTransitionAnimations = trigger('triggerName', [
  transition('2 => 3', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
      })
    ]),
    query(':enter', [style({ right: '-100%', opacity: 0 })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('0.5s ease-out', style({ right: '100%', opacity: 0 }))]),
      query(':enter', [animate('0.5s ease-out', style({ right: '0%', opacity: 1 }))])
    ]),
    query(':enter', animateChild())
  ]),
  transition('3 => 2', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
      })
    ]),
    query(':enter', [style({ right: '100%', opacity: 0 })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('0.5s ease-out', style({ right: '-100%', opacity: 0 }))]),
      query(':enter', [animate('0.5s ease-out', style({ right: '0%', opacity: 1 }))])
    ]),
    query(':enter', animateChild())
  ])
]);
