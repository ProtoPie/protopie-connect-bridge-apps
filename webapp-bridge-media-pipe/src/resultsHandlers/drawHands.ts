import { HAND_CONNECTIONS } from '@mediapipe/holistic';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { ResultsHandler } from '../models/ResultsHandler';

const drawHands: ResultsHandler = ({ results, $canvas }) => {
  const ctx = $canvas.getContext('2d');

  ctx.save();
  ctx.clearRect(0, 0, $canvas.width, $canvas.height);
  ctx.drawImage(results.image, 0, 0, $canvas.width, $canvas.height);

  if (results.leftHandLandmarks) {
    drawConnectors(ctx, results.leftHandLandmarks, HAND_CONNECTIONS, {
      color: '#CC0000',
      lineWidth: 5,
    });
    drawLandmarks(ctx, results.leftHandLandmarks, {
      color: '##00FF00',
      lineWidth: 2,
    });
  }

  if (results.rightHandLandmarks) {
    drawConnectors(ctx, results.rightHandLandmarks, HAND_CONNECTIONS, {
      color: '#00CC00',
      lineWidth: 5,
    });
    drawLandmarks(ctx, results.rightHandLandmarks, {
      color: '#FF0000',
      lineWidth: 2,
    });
  }

  ctx.restore();
};

export default drawHands;
