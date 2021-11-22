import './style.css';

import createHolistic from './libs/createHolistic';
import createCamera from './libs/createCamera';
import { ResultsListener } from '@mediapipe/holistic';

const init = (
  resultsListenerPipeline: ($canvas: HTMLCanvasElement) => ResultsListener
) => {
  const $video = document.querySelector('.input-video') as HTMLVideoElement;
  const $canvas = document.querySelector('.output-canvas') as HTMLCanvasElement;

  const holistic = createHolistic(resultsListenerPipeline($canvas));
  const camera = createCamera($video, holistic);

  camera.start();
};

export default init;
