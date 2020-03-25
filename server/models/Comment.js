const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Video"
    },
    responseTo: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    rootComment: {
      type: Schema.Types.ObjectId
    },
    content: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
