const robot = require('robotjs');
robot.setMouseDelay(0);

const oldTouchpadPos = {
  x: 0,
  y: 0,
};
const oldMousePos = {
  x: 0,
  y: 0,
};
let isMouseDown = false;

const TOUCHPAD_SENSITIVITY = 5;
const TAP_RANGE = 5;

function checkIsTap(oldTouchpadPosX, oldTouchpadPosY, upPosX, upPosY) {
  const isXInRange = Math.abs(oldTouchpadPosX - upPosX) <= TAP_RANGE;
  const isYInRange = Math.abs(oldTouchpadPosY - upPosY) <= TAP_RANGE;
  const isInRange = isXInRange && isYInRange;

  return isMouseDown && isInRange;
}

function getXYPosFromString(xyString) {
  return xyString.split(' ').map((stringifiedNum) => Number(stringifiedNum));
}

module.exports.messageHandler = (ppMessage) => {
  switch (ppMessage.messageId) {
    case 'down_pos': {
      const [x, y] = getXYPosFromString(ppMessage.value);

      oldTouchpadPos.x = x;
      oldTouchpadPos.y = y;

      const { x: mousePosX, y: mousePosY } = robot.getMousePos();
      oldMousePos.x = mousePosX;
      oldMousePos.y = mousePosY;

      isMouseDown = true;

      break;
    }

    case 'up_pos': {
      const [x, y] = getXYPosFromString(ppMessage.value);
      const isTap = checkIsTap(oldTouchpadPos.x, oldTouchpadPos.y, x, y);

      if (isTap) {
        robot.mouseClick();
      }

      isMouseDown = false;
      break;
    }

    case 'move_pos': {
      if (!isMouseDown) {
        return;
      }

      const [x, y] = getXYPosFromString(ppMessage.value);

      robot.moveMouse(
        oldMousePos.x + (x - oldTouchpadPos.x) * TOUCHPAD_SENSITIVITY,
        oldMousePos.y + (y - oldTouchpadPos.y) * TOUCHPAD_SENSITIVITY
      );
      break;
    }

    default:
      break;
  }
};
