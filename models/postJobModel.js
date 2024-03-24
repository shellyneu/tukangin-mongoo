const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserModel = require("./userModel");

const PostJobSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  titleJob: {
    type: String,
    required: true,
  },
  serviceCategory: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  listJob: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  statusJob: {
    type: String,
    default: "Rekrut",
  },
  tukang: {
    type: String,
  },
  applyTukang: {
    type: String,
  },
  photo: {
    type: String,
  },
});

PostJobSchema.pre("save", async function (next) {
  try {
    const user = await UserModel.findById(this.userId);
    if (!user) {
      throw new Error("User not found");
    }
    next();
  } catch (error) {
    next(error);
  }
});

const PostJobModel = mongoose.model("PostJob", PostJobSchema);

module.exports = PostJobModel;
