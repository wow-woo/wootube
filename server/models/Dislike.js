const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dislikeSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "specify what you'd like to give a dislike to"]
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dislike", dislikeSchema);
