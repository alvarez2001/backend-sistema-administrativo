"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("detalle_control", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			concepto: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			destinatario: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			monto: {
				type: Sequelize.DECIMAL(20, 2),
				allowNull: true,
			},
			tasa_cambio: {
				type: Sequelize.DECIMAL(20, 2),
				allowNull: false,
			},
			account_id: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: "account_states",
					key: "id",
					onDelete: "CASCADE",
					onUpdate: "CASCADE",
				},
			},
			control_id: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: "control",
					key: "id",
					onDelete: "CASCADE",
					onUpdate: "CASCADE",
				},
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("detalle_control");
	},
};
