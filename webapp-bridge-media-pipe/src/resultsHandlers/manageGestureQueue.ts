import { ResultsHandler } from '../models/ResultsHandler';
import { GestureQueue } from '../models/Accumulator';

const enqueueGesture = (
  prevQueue: GestureQueue | undefined,
  newGesture: string
): GestureQueue => {
  const MAXIMUM = 10;

  if (!prevQueue) {
    return [newGesture];
  }

  const firstGesture = prevQueue[0];
  const lastGesture = prevQueue[prevQueue.length - 1];

  if (
    prevQueue.length === MAXIMUM &&
    firstGesture !== lastGesture &&
    newGesture === firstGesture
  ) {
    return Array.from<string>({ length: MAXIMUM }).fill(firstGesture);
  }

  const result = [...prevQueue, newGesture];

  if (result.length > MAXIMUM) {
    result.shift();
    return result;
  }

  return result;
};

const manageGestureQueue: ResultsHandler = ({ acc }) => {
  if (!acc?.gestures) {
    return;
  }

  return {
    ...acc,
    gestureQueue: enqueueGesture(acc?.prev?.gestureQueue, acc.gestures[0].name),
  };
};

export default manageGestureQueue;
