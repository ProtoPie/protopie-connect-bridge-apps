import { ResultsHandler } from '../models/ResultsHandler';

const getFingerTipPosition: ResultsHandler = ({ $canvas, acc }) => {
  if (!acc?.xyRatio?.x || !acc?.xyRatio?.y) {
    return;
  }

  return {
    ...acc,
    fingerTipPosition: {
      x: $canvas.width * acc.xyRatio.x,
      y: $canvas.height * acc.xyRatio.y,
    },
  };
};

export default getFingerTipPosition;
