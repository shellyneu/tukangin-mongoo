const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserModel = require("./userModel");
const PostJobModel = require("./postJobModel");

const ReviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "PostJob",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
});

const ReviewModel = mongoose.model("Review", ReviewSchema);

module.exports = ReviewModel;
