import './style.css';

import createResultsListener from './libs/createResultsListener';
import drawHands from './resultsHandlers/drawHands';
import sendMessages from './resultsHandlers/sendMessages';
import getFingerTipXYRatio from './resultsHandlers/getFingerTipXYRatio';
import getBrightnessFromYRatio from './resultsHandlers/getBrightnessFromYRatio';
import init from './init';
import recognizeGestures from './resultsHandlers/recognizeGestures';
import manageGestureQueue from './resultsHandlers/ManageGestureQueue';
import sendBrightnessByGesture from './resultsHandlers/sendBrightnessByGesture';
import initAccumulator from './resultsHandlers/initAccumulator';

const resultsListenerPipeline = createResultsListener(
  getFingerTipXYRatio,
  getBrightnessFromYRatio,
  recognizeGestures,
  manageGestureQueue,
  sendBrightnessByGesture,
  sendMessages,
  initAccumulator,
  drawHands
);

init(resultsListenerPipeline);
