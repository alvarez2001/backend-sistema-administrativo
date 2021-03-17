const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../db");

class DetalleControl extends Model {}

DetalleControl.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		concepto: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		destinatario: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		monto: {
			type: DataTypes.DECIMAL(20, 2),
			allowNull: true,
		},
		tasa_cambio: {
			type: DataTypes.DECIMAL(20, 2),
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "detalle_control",
	},
);

module.exports = DetalleControl;
