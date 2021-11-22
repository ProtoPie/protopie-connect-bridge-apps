import { Camera } from '@mediapipe/camera_utils';
import { Holistic } from '@mediapipe/holistic';

export default function createCamera(
  $video: HTMLVideoElement,
  holistic: Holistic
) {
  const camera = new Camera($video, {
    onFrame: async () => {
      await holistic.send({ image: $video });
    },
    width: 1280,
    height: 720,
  });

  return camera;
}
