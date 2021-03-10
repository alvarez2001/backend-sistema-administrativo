const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../db");

class Control extends Model {}

Control.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		concepto: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		monto_dolares: {
			type: DataTypes.DECIMAL(20, 2),
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "control",
	},
);

module.exports = Control;
