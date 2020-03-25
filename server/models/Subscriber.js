const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriberSchema = new Schema({
  uploader: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  subscribingUser: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  timeAt: {
    type: Date,
    default: Date()
  }
});

module.exports = mongoose.model("Subscriber", subscriberSchema);
