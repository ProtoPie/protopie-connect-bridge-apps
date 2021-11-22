import { Results } from '@mediapipe/holistic';
import { Accumulator } from './Accumulator';

export type ResultsHandler = (ingredient: {
  results: Results;
  $canvas: HTMLCanvasElement;
  acc: Accumulator;
}) => Accumulator | void;
