"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("details_references", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			concept: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			accountOrigin: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			reference_id: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: "account_states",
					key: "id",
					onDelete: "CASCADE",
					onUpdate: "CASCADE",
				},
			},
			bank_id: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: "banks",
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
		await queryInterface.dropTable("details_references");
	},
};
