module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    encryptedPassword: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};
