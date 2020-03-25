const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = new Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    title: {
      type: String,
      maxlength: 50
    },
    description: {
      type: String
    },
    privacy: {
      type: Number
    },
    filePath: {
      type: String
    },
    category: {
      type: String
    },
    views: {
      type: Number,
      default: 0
    },
    duration: {
      type: String
    },
    thumbnail: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
