import CONSTANTS from './constants';

export const clampToCanvasWidth = position =>
  Math.max(
    Math.min(
      position,
      CONSTANTS.CANVAS_WIDTH - CONSTANTS.SHIP_WIDTH / 2
    ),
    CONSTANTS.SHIP_WIDTH / 2
  );

export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const didCollide = (A, B) => {
  const shiftAX = A.x - A.width / 2,
        shiftBX = B.x - B.width / 2;

  return (shiftAX < shiftBX + B.width && shiftAX + A.width > shiftBX)
    && (A.y < B.y + B.height && A.height + A.y > B.y);
}

export const gameOver = (shipX, invaders, invaderShots) => {
  const ship = {
    x: shipX,
    y: CONSTANTS.CANVAS_HEIGHT - CONSTANTS.SHIP_HEIGHT,
    width: CONSTANTS.SHIP_WIDTH,
    height: CONSTANTS.SHIP_HEIGHT
  };

  return invaders && invaders.some(invader => {
    if (didCollide(ship, invader)) return true;
    if (invader.x + invader.height <= 0) return true;

    return invaderShots.some(shot => didCollide(ship, shot));
  });
}

export const gameComplete = invaders => invaders && invaders.every(invader => invader.isDead);
