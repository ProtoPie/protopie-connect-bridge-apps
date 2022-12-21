const robot = require('robotjs');

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

module.exports.messageHandler = (ppMessage) => {
  switch (ppMessage.messageId) {
    case 'down_x':
      oldTouchpadPos.x = Number(ppMessage.value);
      oldMousePos.x = robot.getMousePos().x;
      isMouseDown = true;
      return;
    case 'down_y':
      oldTouchpadPos.y = Number(ppMessage.value);
      oldMousePos.y = robot.getMousePos().y;
      isMouseDown = true;
      return;
    case 'up_x':
      isMouseDown = false;
      return;
    case 'up_y':
      isMouseDown = false;
      return;
    default:
      // mouse_x, mouse_y

      if (!isMouseDown) {
        return;
      }

      robot.setMouseDelay(1);
      if (ppMessage.messageId === 'mouse_x') {
        const newTouchpadX = Number(ppMessage.value);
        robot.moveMouse(
          oldMousePos.x + (newTouchpadX - oldTouchpadPos.x) * TOUCHPAD_SENSITIVITY,
          robot.getMousePos().y
        );
      } else {
        const newTouchpadY = Number(ppMessage.value);
        robot.moveMouse(
          robot.getMousePos().x,
          oldMousePos.y + (newTouchpadY - oldTouchpadPos.y) * TOUCHPAD_SENSITIVITY
        );
      }
      break;
  }
};
