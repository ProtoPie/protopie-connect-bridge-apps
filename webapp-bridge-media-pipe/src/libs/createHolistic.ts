import { Holistic, ResultsListener } from '@mediapipe/holistic';

const createHolistic = (ResultsListener: ResultsListener) => {
  const holistic = new Holistic({
    locateFile: (file) => {
      return `holistic/${file}`;
    },
  });

  holistic.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  holistic.onResults(ResultsListener);

  return holistic;
};

export default createHolistic;
