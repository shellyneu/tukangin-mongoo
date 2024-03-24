const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserModel = require("./userModel");
const PostJobModel = require("./postJobModel");

const TransactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tukangId: {
    type: Schema.Types.ObjectId,
    ref: "Tukang",
    required: true,
    default: 1,
  },
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "PostJob",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  price_admin: {
    type: Number,
    required: true,
  },
  price_total: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  bukti: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Pengajuan",
  },
  action: {
    type: Boolean,
    default: null,
  },
});

TransactionSchema.pre("save", async function (next) {
  try {
    const job = await PostJobModel.findById(this.jobId);
    if (job) {
      this.price = job.price;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const TransactionModel = mongoose.model("Transaction", TransactionSchema);

module.exports = TransactionModel;
