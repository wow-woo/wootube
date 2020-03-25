import { GET_VIDEO_INFO } from "./types";

export const getVideoInfo = (filePath, thumbsFilePath, fileDuration) => {
  return {
    type: GET_VIDEO_INFO,
    payload: {
      filePath,
      thumbsFilePath,
      fileDuration
    }
  };
};
