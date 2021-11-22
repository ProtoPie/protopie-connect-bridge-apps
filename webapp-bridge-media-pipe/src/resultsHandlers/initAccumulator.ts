import { ResultsHandler } from '../models/ResultsHandler';

const initAccumulator: ResultsHandler = ({ acc }) => {
  if (!acc) {
    return;
  }

  return { prev: { ...acc.prev, ...acc } };
};

export default initAccumulator;
