import CONSTANTS from './constants';
import { didCollide } from './utils';
import { ScoreSubject } from './score';
import BeepSubject from './audio';

function Graphics(selector) {
  const surface = document.querySelector(selector),
        context = surface.getContext('2d');

  context.fillStyle = 'lightgrey';

  const renderFinalScreen = (text, finalScore) => {
    context.clearRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);
    context.textAlign = 'center';
    context.font = '36px Arial';
    context.fillText(`${text}`, CONSTANTS.CANVAS_WIDTH / 2, CONSTANTS.CANVAS_HEIGHT / 2);
    context.font = '26px Arial';
    context.fillText(`Score: ${finalScore}`, CONSTANTS.CANVAS_WIDTH / 2, CONSTANTS.CANVAS_HEIGHT / 2 + 50);
  }

  this.context = context;

  this.renderTitle = () => {
    context.textAlign = 'center';
    context.font = '26px Arial';
    context.fillText('SPACE INVADERS', CONSTANTS.CANVAS_WIDTH / 2, CONSTANTS.CANVAS_HEIGHT / 2 - 50);
    context.font = '16px Arial';
    context.fillText('Press [ENTER] to start', CONSTANTS.CANVAS_WIDTH / 2, CONSTANTS.CANVAS_HEIGHT / 2);
    context.fillText('Move with [<|>], shoot with [SPACE]', CONSTANTS.CANVAS_WIDTH / 2, CONSTANTS.CANVAS_HEIGHT / 2 + 30);
  }

  this.renderGameOver = finalScore => {
    renderFinalScreen('GAME OVER', finalScore);
  }

  this.renderGameComplete = finalScore => {
    renderFinalScreen('AMAZING!', finalScore);
  }

  this.renderScore = score => {
    context.save();
    context.fillStyle = 'beige';
    context.font = 'bold 22px Arial';
    context.fillText(`Score: ${score}`, 70, 50);
    context.restore();
  }

  this.renderSpaceShip = posX => {
    context.beginPath();
    context.rect(
      posX - CONSTANTS.SHIP_WIDTH / 2,
      CONSTANTS.CANVAS_HEIGHT - CONSTANTS.SHIP_HEIGHT - 1,
      CONSTANTS.SHIP_WIDTH,
      CONSTANTS.SHIP_HEIGHT
    );
    context.fill();
    context.closePath();
  }

  this.renderInvader = invader => {
    context.beginPath();
    context.rect(
      invader.x - invader.width / 2,
      invader.y - invader.height / 2,
      invader.width,
      invader.height
    );
    context.fill();
    context.closePath();
  }

  this.renderAllInvaders = invaders => {
    invaders && invaders
      .filter(invader => !invader.isDead)
      .forEach(invader => {
        this.renderInvader(invader)
        invader.y += 0.2;
      });
  }

  this.renderSpaceShipShots = (shots, invaders) => {
    shots && shots
      .filter(shot => shot.y > 0)
      .forEach(shot => {
        let i, ln = invaders.length;

        for (i = 0; i < ln; i++) {
          const invader = invaders[i];

          if (!invader.isDead && didCollide(shot, invader)) {
            ScoreSubject.next(CONSTANTS.SCORE_STEP);
            BeepSubject.next(30);
            invader.isDead = true;
            shot.y = 0;
            break;
          }
        }

        shot.y -= CONSTANTS.SHOOTING_SPEED;
        context.fillRect(shot.x - 1, shot.y - 5, 2, 5);
      });
  }

  this.renderEnemyShots = shots => {
    shots && shots
      .filter(shot => shot.y < CONSTANTS.CANVAS_HEIGHT)
      .forEach(shot => {
        shot.y += CONSTANTS.SHOOTING_SPEED;
        context.fillRect(shot.x - 1, shot.y - 5, 2, 5);
      })
  }
}

export default Graphics;
