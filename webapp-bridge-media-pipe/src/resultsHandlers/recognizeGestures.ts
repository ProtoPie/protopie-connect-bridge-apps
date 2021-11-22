import { GestureEstimator } from 'fingerpose';
import { ResultsHandler } from '../models/ResultsHandler';
import { IGestureEstimator } from '../models/Fingerpose';
import createPointUpGesture from '../handGestures/createPointUpGesture';
import createVGesture from '../handGestures/createVGesture';
import createWGesture from '../handGestures/createWGesture';
import arrayifyLandmarkList from '../libs/arrayifyLandmarkList';

const recognizeGestures: ResultsHandler = ({ results, acc }) => {
  if (!results.rightHandLandmarks) {
    return;
  }

  const pointUpGesture = createPointUpGesture();
  const vGesture = createVGesture();
  const wGesture = createWGesture();

  const gestureEstimator = new GestureEstimator([
    pointUpGesture,
    vGesture,
    wGesture,
  ]) as IGestureEstimator;
  const landmarks = arrayifyLandmarkList(results.rightHandLandmarks);

  const recognition = gestureEstimator.estimate(landmarks, 7);

  if (recognition?.gestures?.length) {
    return { ...acc, gestures: recognition.gestures }
  }
};

export default recognizeGestures;