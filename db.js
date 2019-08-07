const Sequelize = require("sequelize");

const sequelize = new Sequelize("app", "postgres", "unixpgadmin13", {
  host: "localhost",
  dialect: "postgres"
});

sequelize
  .authenticate()
  .then(() => console.log("connected to database"), err => console.log(err));

module.exports = sequelize;
