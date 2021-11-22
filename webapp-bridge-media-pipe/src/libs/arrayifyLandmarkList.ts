import { NormalizedLandmarkList } from '@mediapipe/holistic';
import { ArrayifiedLandmarkList } from '../models/ArrayifiedLandmarkList';

const arrayifyLandmarkList = (
  landmarks: NormalizedLandmarkList
): ArrayifiedLandmarkList =>
  landmarks.map((landmark) =>
    Object.values(landmark).filter(
      (coordinate: number | undefined) => coordinate != undefined
    )
  );

export default arrayifyLandmarkList;
