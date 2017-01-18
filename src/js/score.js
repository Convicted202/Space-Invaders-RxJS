import Rx from 'rxjs';

export const ScoreSubject = new Rx.Subject();

export const score$ = ScoreSubject
  .scan((prev, cur) => (prev + cur), 0)
  .startWith(0);
