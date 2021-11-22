import { Results, ResultsListener } from '@mediapipe/holistic';
import { Accumulator } from '../models/Accumulator';
import { ResultsHandler } from '../models/ResultsHandler';

const createResultsListener =
  (...funcs: ResultsHandler[]) =>
  ($canvas: HTMLCanvasElement): ResultsListener => {
    let acc: Accumulator = null;

    return (results: Results) => {
      for (const func of funcs) {
        const nextAcc = func({ results, $canvas, acc });

        if (nextAcc) {
          acc = nextAcc;
        }
      }
    };
  };

export default createResultsListener;
