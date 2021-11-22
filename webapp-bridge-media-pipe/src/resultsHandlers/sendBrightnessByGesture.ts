import { ResultsHandler } from '../models/ResultsHandler';
import { GestureNames } from '../handGestures/GestureNames';
import { GestureQueue } from '../models/Accumulator';

const isReadyToSend = (
  gestureQueue: GestureQueue,
  currentGesture: string
): boolean => {
  return gestureQueue.every((gesture) => gesture === currentGesture);
};

const messageIdsByGestures = {
  [GestureNames.pointUpGesture]: 'first',
  [GestureNames.vGesture]: 'second',
  [GestureNames.wGesture]: 'third',
};

const sendBrightnessByGestures: ResultsHandler = ({ acc }) => {
  if (!acc?.gestures || !acc?.gestureQueue || acc?.brightness == null) {
    return;
  }

  const brightness = acc.brightness;
  const gestureName = acc.gestures[0].name;

  if (isReadyToSend(acc.gestureQueue, gestureName)) {
    return {
      ...acc,
      messages: {
        ...acc.messages,
        [messageIdsByGestures[gestureName]]: brightness,
      },
    };
  }
};

export default sendBrightnessByGestures;
