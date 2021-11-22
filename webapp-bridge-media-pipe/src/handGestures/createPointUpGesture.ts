import { GestureDescription } from 'fingerpose';
import {
  Finger,
  FingerCurl,
  FingerDirection,
} from '../models/FingerposeConstants';
import { IGestureDescription } from '../models/Fingerpose';
import { GestureNames } from './GestureNames';

const createPointUpGesture = () => {
  const pointUp = new GestureDescription(GestureNames.pointUpGesture) as IGestureDescription;

  // Thumb
  pointUp.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.5);
  pointUp.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);
  pointUp.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
  pointUp.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 1.0);

  // Index
  pointUp.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
  pointUp.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);

  // Middle
  pointUp.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
  pointUp.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.2);
  pointUp.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 1.0);
  pointUp.addDirection(Finger.Middle, FingerDirection.HorizontalLeft, 0.2);

  // Ring
  pointUp.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
  pointUp.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.2);
  pointUp.addDirection(Finger.Ring, FingerDirection.DiagonalUpLeft, 1.0);
  pointUp.addDirection(Finger.Ring, FingerDirection.HorizontalLeft, 0.2);

  // Pinky
  pointUp.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
  pointUp.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.2);
  pointUp.addDirection(Finger.Pinky, FingerDirection.DiagonalUpLeft, 1.0);
  pointUp.addDirection(Finger.Pinky, FingerDirection.HorizontalLeft, 0.2);

  return pointUp;
};

export default createPointUpGesture;
