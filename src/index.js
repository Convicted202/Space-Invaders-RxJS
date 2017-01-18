import './main.styl';
import Rx from 'rxjs';

import Renderer from './js/renderer';

import CONSTANTS from './js/constants';
import { invaders$, invaderShots$ } from './js/invaders';
import { spaceship$, spaceshipShots$ } from './js/ship';

import { startGame$, inGameTick$ } from './js/tick';
import { gameOver, gameComplete } from './js/utils';
import { score$ } from './js/score';

import BeepSubject from './js/audio';

const renderer = new Renderer('#surface');

renderer.renderTitle();

const update = model => {
  renderer.context.clearRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

  renderer.renderScore(model.score);
  renderer.renderSpaceShip(model.spaceshipX);
  renderer.renderAllInvaders(model.invaders);
  renderer.renderSpaceShipShots(model.shots, model.invaders);
  renderer.renderEnemyShots(model.invaderShots);

  if (gameOver(model.spaceshipX, model.invaders, model.invaderShots)) {
    renderer.renderGameOver(model.score);
    BeepSubject.next(10);
    game$.complete();
  }

  if (gameComplete(model.invaders)) {
    renderer.renderGameComplete(CONSTANTS.INVADERS_ROWS * CONSTANTS.INVADERS_COLS * CONSTANTS.SCORE_STEP);
    BeepSubject.next(60);
    game$.complete();
  }
}

const game$ = startGame$
  .merge(
    Rx.Observable
      .combineLatest(
        spaceship$,
        spaceshipShots$,
        invaders$,
        invaderShots$,
        score$,
        inGameTick$,
        (spaceshipX, shots, invaders, invaderShots, score, tick) => ({
          spaceshipX, shots, invaders, invaderShots, score, tick
        })
      )
  )
  .sample(Rx.Observable.interval(CONSTANTS.TICK))
  // .takeWhile(gameObjects => !gameOver(gameObjects.spaceshipX, gameObjects.invaders, gameObjects.invaderShots))
  .subscribe(update);
