require("dotenv").config();
const express = require("express");
const app = express();
const auth = require("./routes/auth");

const sequelize = require("./db");

sequelize.sync();

app.use(express.json({ extended: false }));

app.use("/auth", auth);

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
