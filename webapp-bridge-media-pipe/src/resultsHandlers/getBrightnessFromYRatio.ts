import { ResultsHandler } from '../models/ResultsHandler';

const getBrightnessFromYRatio: ResultsHandler = ({ acc }) => {
  if (!acc?.xyRatio?.y) {
    return;
  }

  const { y: yRatio } = acc.xyRatio;

  const OFFSET = 1.6;

  let brightness = yRatio > 0 ? 255 - Math.floor(255 * (yRatio * OFFSET)) : 255;
  brightness = brightness < 0 ? 0 : brightness;

  return {
    ...acc,
    brightness,
  };
};

export default getBrightnessFromYRatio;
