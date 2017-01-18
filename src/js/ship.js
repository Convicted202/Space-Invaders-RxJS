import Rx from 'rxjs';

import CONSTANTS from './constants';
import { inGameTick$ } from './tick';
import { clampToCanvasWidth } from './utils';

const KEYS = CONSTANTS.KEYS;

// arrow key pressed, map keydown to -1 or 1
// map to 0 when keyup is triggered on arrow key
const shipMoveInput$ = Rx.Observable
  .merge(
    Rx.Observable.fromEvent(document, 'keydown')
      .filter(e => e.keyCode === KEYS.LEFT)
      .mapTo(-1),
    Rx.Observable.fromEvent(document, 'keydown')
      .filter(e => e.keyCode === KEYS.RIGHT)
      .mapTo(1),
    Rx.Observable.fromEvent(document, 'keyup')
      .filter(e => e.keyCode === KEYS.LEFT || e.keyCode === KEYS.RIGHT)
      .mapTo(0)
  )
  .distinctUntilChanged();

// listen to space keydown
const shootingEvent$ = Rx.Observable
  .fromEvent(document, 'keydown')
  .filter(e => e.keyCode === KEYS.SPACE)
  .sample(Rx.Observable.interval(CONSTANTS.FIRE_INTERVAL))
  .distinctUntilChanged();

// get position of spaceship
const spaceship$ = inGameTick$
  .withLatestFrom(shipMoveInput$)
  .scan((posX, [tick, direction]) => {
    const next = posX + direction * tick.delta * CONSTANTS.SPEED;
    return clampToCanvasWidth(next);
  }, CONSTANTS.CANVAS_WIDTH / 2)
  // spaceship position is in the middle of canvas initially
  .startWith(CONSTANTS.CANVAS_WIDTH / 2)
  .distinctUntilChanged()

// listen to space pressed and react on shots
// get spaceship position on every shotEvent and generate model for a shot
const spaceshipShots$ = shootingEvent$
  .withLatestFrom(spaceship$)
  // push new shot to the shots array
  .scan((shots, [shot, spaceshipX]) => {
    shots.push({
      x: spaceshipX,
      y: CONSTANTS.CANVAS_HEIGHT - CONSTANTS.SHIP_HEIGHT,
      width: CONSTANTS.BULLET_WIDTH,
      height: CONSTANTS.BULLET_HEIGHT
    });
    return shots;
  }, [])
  // shots are empty array initially
  .startWith([])

export { spaceship$, spaceshipShots$ };
