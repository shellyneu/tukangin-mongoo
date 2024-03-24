const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");

const authentication = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await UserModel.findById(decoded.id);

      if (user) {
        req.user = user;
        next();
      } else {
        throw new Error("Pengguna tidak ditemukan");
      }
    } catch (error) {
      console.error(error);
      res.status(401).json({
        success: false,
        message: "Not authorized - Token expired or invalid",
      });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }
});

module.exports = { authentication };
