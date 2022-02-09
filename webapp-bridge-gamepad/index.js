function append(parent, label, value) {
  const e = document.createElement('div');
  e.textContent = `${label}: ${value}`;
  parent.appendChild(e);
}

function update(axes0, axes1, buttons, stickCanvases) {
  const buttonsElement = document.querySelector('#buttons');
  const axes0Element = document.querySelector('#axes0');
  const axes1Element = document.querySelector('#axes1');

  buttonsElement.textContent = '';

  for (b in buttons) {
    append(buttonsElement, `button[${b}]`, JSON.stringify(buttons[b]));
  }

  if (axes0.length > 0) {
    axes0Element.textContent = '';

    for (a in axes0) {
      append(axes0Element, `axes[${a}]`, JSON.stringify(axes0[a]));
    }

    stickCanvases[0].draw(axes0[0], axes0[1]);
  }

  if (axes1.length > 0) {
    axes1Element.textContent = '';

    for (a in axes1) {
      append(axes1Element, `axes[${a}]`, JSON.stringify(axes1[a]));
    }

    stickCanvases[1].draw(axes1[0], axes1[1]);
  }
}

function runConnectClient() {
  const client = new ConnectClient(io, 'http://localhost:9981');
  client.connect();

  return client;
}

function runGameController(onEvent) {
  const controller = new GameController();

  controller.on('event', onEvent);
  controller.connect();

  return controller;
}

function appendStickCanvas($parent) {
  const stickCanvases = ['stick1', 'stick2'].map((stick) => {
    const stickCanvas = new StickCanvas({
      name: stick,
      size: 200,
      backgroundColor: 'transparent',
    });

    return stickCanvas;
  });

  stickCanvases.forEach((stickCanvas) => {
    $parent.appendChild(stickCanvas.canvas);
  });

  return stickCanvases;
}

function main() {
  const $stickCanvasContainer = document.querySelector('#sticks');
  const stickCanvases = appendStickCanvas($stickCanvasContainer);
  const connectClient = runConnectClient();
  let gameControllerButtonManager = null;

  const handleControllerEvent = (data) => {
    const emptyButtons = new Array(16).fill(0);

    if (data.length > 0) {
      const { axes, buttons } = data[0];
      const axes0 = axes.slice(0, 2);
      const axes1 = axes.slice(2);

      update(axes0, axes1, emptyButtons, stickCanvases);

      if (!gameControllerButtonManager) {
        gameControllerButtonManager = new GameControllerButtonManager({
          buttonsLength: buttons.length,
          axesLength: axes.length,
          analogButtonIndexes: [6, 7],
          axeSensitivity: 10,
          analogButtonSensitivity: 10,
        });
      }

      const changedButtons = gameControllerButtonManager.detectButtonsChange(
        buttons,
        axes
      );

      gameControllerButtonManager.setButtons(buttons);
      gameControllerButtonManager.setAxes(axes);

      for (const button in changedButtons) {
        const buttonValue = changedButtons[button];
        connectClient.send(button, buttonValue);
      }

      buttons.forEach((button, i) => {
        if (button.pressed) {
          emptyButtons[i] = button.value;
          update(axes0, axes1, emptyButtons, stickCanvases);
        }
      });
    }
  };

  const gameController = runGameController(handleControllerEvent);
}

main();
