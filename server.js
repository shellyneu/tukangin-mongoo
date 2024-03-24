const express = require("express");
const config = require("./config/config");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { mongoDB } = require("./config/mongoDB");

const port = process.env.PORT || 5002;

const corsOption = {
  origin: "*",
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoDB(config)
  .then(() => {
    app.use("/api/users", require("./routes/userRoutes"));
    app.use("/api/tukang", require("./routes/tukangRoutes"));
    app.use("/api/postJobs", require("./routes/postJobRoutes"));
    app.use("/api/reviews", require("./routes/reviewRoutes"));
    app.use("/api/transactions", require("./routes/transactionRoutes"));

    app.use(express.static("storage"));

    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
