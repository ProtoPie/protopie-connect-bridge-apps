import './style.css';

import createResultsListener from './libs/createResultsListener';
import drawHands from './resultsHandlers/drawHands';
import sendMessages from './resultsHandlers/sendMessages';
import getFingerTipXYRatio from './resultsHandlers/getFingerTipXYRatio';
import getFingerTipPosition from './resultsHandlers/getFingerTipPosition';
import initAccumulator from './resultsHandlers/initAccumulator';
import init from './init';
import sendFingerTipPosition from './resultsHandlers/sendFingerTipPosition';

const resultsListenerPipeline = createResultsListener(
  drawHands,
  getFingerTipXYRatio,
  getFingerTipPosition,
  sendFingerTipPosition,
  sendMessages,
  initAccumulator
);

init(resultsListenerPipeline);
