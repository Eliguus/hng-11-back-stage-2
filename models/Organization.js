const { DataTypes } = require('sequelize');
const {db} = require('../utils/dbConnect');

const Organization = db.define('Organisation', {
  orgId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
});

module.exports = Organization;