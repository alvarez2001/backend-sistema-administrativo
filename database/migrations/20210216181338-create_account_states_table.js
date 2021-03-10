"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("account_states", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			date: {
				type: Sequelize.DATEONLY,
				allowNull: false,
			},
			reference: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false,
			},
			sign: {
				type: Sequelize.ENUM,
				values: ["+", "-"],
				allowNull: false,
			},
			mount: {
				type: Sequelize.DECIMAL(20, 2),
				allowNull: false,
			},
			commission: {
				type: Sequelize.ENUM,
				values: ["si", "no"],
				allowNull: false,
			},
			verified: {
				type: Sequelize.ENUM,
				values: ["si", "no"],
				defaultValue: "no",
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
		await queryInterface.dropTable("account_states");
	},
};
