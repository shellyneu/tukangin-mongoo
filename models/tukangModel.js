const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserModel = require("./userModel");

const TukangSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deskripsi: {
    type: String,
    default: null,
  },
  ktp: {
    type: String,
    default: null,
  },
  statusValidate: {
    type: Boolean,
    default: true,
  },
  nama: {
    type: String,
    required: true,
  },
  noHP: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

TukangSchema.pre("save", async function (next) {
  try {
    const user = await UserModel.findById(this.userId);
    if (user) {
      this.nama = user.nama;
      this.noHP = user.noHP;
      this.email = user.email;
      this.password = user.password;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const TukangModel = mongoose.model("Tukang", TukangSchema);

module.exports = TukangModel;
