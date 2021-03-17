const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../db");

class Banks extends Model {}
Banks.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		identificationCard: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		nationality: {
			type: DataTypes.ENUM,
			allowNull: false,
			values: ["V", "J", "E", "G", "P"],
		},
		bank: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		AccountOwner: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		accountType: {
			type: DataTypes.ENUM,
			values: ["ahorro", "corriente"],
			allowNull: false,
		},
		accountNumber: {
			type: DataTypes.STRING(20),
			allowNull: false,
			unique: true,
			validate: {
				len: [20, 20],
			},
		},
	},
	{
		sequelize,
		modelName: "banks",
	},
);

module.exports = Banks;
