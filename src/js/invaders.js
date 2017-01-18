import Rx from 'rxjs';

import CONSTANTS from './constants';
import { startGame$, inGameTick$ } from './tick';
import { getRandomInt } from './utils';

const {
  CANVAS_WIDTH,
  INVADERS_GAP,
  INVADERS_COLS,
  INVADERS_ROWS,
  INVADERS_HEIGHT,
  INVADERS_WIDTH,
  INVADER_SHOOTING_FREQUENCY,
  BULLET_WIDTH,
  BULLET_HEIGHT
} = CONSTANTS;

const populateInvaders = () => {
  const invaders = [],
        startLeft = (CANVAS_WIDTH - INVADERS_GAP - (INVADERS_GAP + INVADERS_WIDTH) * INVADERS_COLS) / 2;

  let i, j;

  for (i = 0; i < INVADERS_ROWS; i++) {
    for (j = 0; j < INVADERS_COLS; j++) {
      invaders.push({
        x: startLeft + j * (INVADERS_WIDTH + INVADERS_GAP) + INVADERS_WIDTH / 2 + INVADERS_GAP,
        y: i * (INVADERS_HEIGHT + INVADERS_GAP) + INVADERS_HEIGHT / 2 + INVADERS_GAP + 20,
        width: INVADERS_WIDTH,
        height: INVADERS_HEIGHT
      });
    }
  }

  return invaders;
}

const invaders$ = Rx.Observable
  .of(populateInvaders())
  .startWith([]);

const invaderShots$ = Rx.Observable
  .interval(INVADER_SHOOTING_FREQUENCY)
  .skipUntil(inGameTick$)
  .withLatestFrom(invaders$)
  .scan((shots, [invaderIndex, invaders]) => {
    const aliveInvaders = invaders.filter(invader => !invader.isDead),
          invader = aliveInvaders[getRandomInt(0, aliveInvaders.length)];

    shots.push({
      x: invader.x,
      y: invader.y + INVADERS_WIDTH / 2,
      width: BULLET_WIDTH,
      height: BULLET_HEIGHT
    });
    return shots;
  }, [])
  .sample(Rx.Observable.interval(INVADER_SHOOTING_FREQUENCY))
  .startWith([])
  .distinctUntilChanged();

export { invaders$, invaderShots$ };
