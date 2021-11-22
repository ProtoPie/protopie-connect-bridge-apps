// https://github.com/andypotato/fingerpose/blob/master/src/GestureDescription.js
// https://github.com/andypotato/fingerpose/blob/master/src/GestureEstimator.js

import { ArrayifiedLandmarkList } from './ArrayifiedLandmarkList';
import {
  FingerValues,
  FingerCurlValues,
  FingerDirectionValues,
} from './FingerposeConstants';

interface IGestureDescription {
  name: string;
  curls: { [finger in FingerValues]?: number[][] };
  directions: { [finger in FingerValues]?: number[][] };
  weights: number[];
  weightsRelative: number[];

  addCurl: (
    finger: FingerValues,
    curl: FingerCurlValues,
    confidence: number
  ) => void;

  addDirection: (
    finger: FingerValues,
    position: FingerDirectionValues,
    confidence: number
  ) => void;

  setWeight: (finger: FingerValues, weight: number) => void;

  matchAgainst: (
    detectedCurls: IGestureDescription['curls'],
    detectedDirections: IGestureDescription['directions']
  ) => number;
}

interface IGestureEstimator {
  gestures: IGestureDescription[];

  estimate: (
    landmarks: ArrayifiedLandmarkList,
    minConfidence: number
  ) => {
    poseData: string[][];
    gestures: {
      name: string;
      confidence: number;
    }[];
  };
}

export { IGestureDescription, IGestureEstimator };
