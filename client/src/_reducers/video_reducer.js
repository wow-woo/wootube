import { GET_VIDEO_INFO } from "../_actions/types.js";

export default (state = {}, action) => {
  switch (action.type) {
    case GET_VIDEO_INFO:
      return {
        ...state,
        FilePath: action.payload.filePath,
        Thumbnail: action.payload.thumbsFilePath,
        Duration: action.payload.fileDuration
      };
    default:
      return state;
  }
};
