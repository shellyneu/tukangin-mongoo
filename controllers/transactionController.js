const TransactionModel = require("../models/transactionModel");
const PostJobModel = require("../models/postJobModel"); // Assuming validStatus is defined in a helper file

// Create a new transaction
const createTransaction = async (req, res) => {
  const { tukangId, jobId } = req.params;
  const { file } = req;
  const buktiName = file ? file.filename : null;
  const date = new Date();

  try {
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Tukang ID and Job ID are required",
      });
    }

    const postJob = await PostJobModel.findById(jobId);
    if (!postJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const price = postJob.price;
    const price_admin = 2500;
    const price_total = price + price_admin;

    const transaction = await TransactionModel.create({
      userId: req.user.id,
      tukangId,
      jobId,
      date,
      price,
      price_admin,
      price_total,
      bukti: `${process.env.BASE_URL}/bukti/${buktiName}`,
    });

    res.status(201).json({
      success: true,
      data: transaction,
      message: "Transaction created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all transactions
const getTransactions = async (req, res) => {
  const { status } = req.query;
  const filter = {};

  if (status && validStatus.includes(status)) {
    filter.status = status;
  }

  try {
    const transactions = await TransactionModel.find();
    res.status(200).json({
      success: true,
      data: transactions,
      message: "All transactions retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
};
