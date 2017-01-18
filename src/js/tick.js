import Rx from 'rxjs'
import CONSTANTS from './constants';

// stream that generates ticks approximately every 16.6 ms
const tick$ = Rx.Observable
  .interval(CONSTANTS.TICK, Rx.Scheduler.requestAnimationFrame)
  .map(() => ({
    time: Date.now()
  }))
  .scan(
    (previous, current) => ({
      time: current.time,
      delta: (current.time - previous.time) / 1000
    })
  );

// listen to game start (enter key pressed) and generate initial model
const startGame$ = Rx.Observable
  .fromEvent(document, 'keydown')
  .filter(e => e.keyCode === CONSTANTS.KEYS.ENTER)
  .mapTo({spaceshipX: CONSTANTS.CANVAS_WIDTH / 2, shots: []})
  .distinctUntilChanged();

// emit ticks only when game started
const inGameTick$ = tick$
  .skipUntil(startGame$)

export { startGame$, inGameTick$ };
