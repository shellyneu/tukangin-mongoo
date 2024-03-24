const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserModel = new Schema({
  nama: {
    type: String,
    required: true,
    unique: true,
  },
  deskripsi: {
    type: String,
    allowNull: true,
  },
  noHP: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{9,13}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  ktp: {
    type: String,
    allowNull: true,
  },
  statusValidate: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("User", UserModel);
