class GameControllerButtonManager {
  static _instance = null;
  static getInstance() {
    if (GameControllerButtonManager._instance) {
      return GameControllerButtonManager._instance;
    }

    throw new Error('There is no GameControllerButtonManager instance');
  }

  constructor({
    buttonsLength,
    axesLength,
    analogButtonIndexes,
    analogButtonSensitivity = 10,
    axeSensitivity = 10,
  }) {
    if (GameControllerButtonManager._instance) {
      return GameControllerButtonManager.getInstance();
    }

    this._buttons = Array.from({ length: buttonsLength });
    this._axes = Array.from({ length: axesLength });
    this._analogButtonIndexes = analogButtonIndexes;
    this._analogButtonSensitivity = analogButtonSensitivity;
    this._axeSensitivity = axeSensitivity;

    GameControllerButtonManager._instance = this;
  }

  detectButtonsChange(newButtons, newAxes) {
    const changedButton = {};

    const newButtonValues = this._floorAnalogButton(newButtons);
    const newAxeValues = this._floorAxes(newAxes);

    this._buttons.forEach((prevButton, i) => {
      if (prevButton !== newButtonValues[i]) {
        changedButton[`button${i}`] = newButtonValues[i];
      }
    });

    this._axes.forEach((prevAxes, i) => {
      if (prevAxes !== newAxeValues[i]) {
        changedButton[`axes${i}`] = newAxeValues[i];
      }
    });

    return changedButton;
  }

  setButtons(newButtons) {
    this._buttons = this._floorAnalogButton(newButtons);
  }

  setAxes(newAxes) {
    this._axes = this._floorAxes(newAxes);
  }

  _floorAnalogButton(buttons) {
    return buttons.map((button, i) =>
      this._analogButtonIndexes.includes(i)
        ? Math.floor(button.value * this._analogButtonSensitivity)
        : button.value
    );
  }

  _floorAxes(axes) {
    return axes.map((axe) => Math.floor(axe * this._axeSensitivity));
  }
}

window.GameControllerButtonManager = GameControllerButtonManager;
