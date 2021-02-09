const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../db");

class AccountState extends Model {}

AccountState.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		date: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		reference: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		sign: {
			type: DataTypes.ENUM,
			values: ["+", "-"],
			allowNull: false,
		},
		mount: {
			type: DataTypes.DECIMAL(20, 2),
			allowNull: false,
		},
		commission: {
			type: DataTypes.ENUM,
			values: ["si", "no"],
			allowNull: false,
		},
		verified: {
			type: DataTypes.ENUM,
			values: ["si", "no"],
			defaultValue: "no",
		},
	},
	{
		sequelize,
		modelName: "account_state",
	},
);

module.exports = AccountState;
