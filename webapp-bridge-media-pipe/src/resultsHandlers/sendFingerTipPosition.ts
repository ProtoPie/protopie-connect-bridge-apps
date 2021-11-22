import { ResultsHandler } from '../models/ResultsHandler';

const sendFingerTipPosition: ResultsHandler = ({ acc }) => {
  if (!acc?.fingerTipPosition?.x || !acc?.fingerTipPosition?.y) {
    return;
  }

  return {
    ...acc,
    messages: {
      ...acc.messages,
      x: acc.fingerTipPosition.x,
      y: acc.fingerTipPosition.y,
    },
  };
};

export default sendFingerTipPosition;
