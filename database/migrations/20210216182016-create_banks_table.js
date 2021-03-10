"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("banks", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,

				allowNull: false,
			},
			identificationCard: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			nationality: {
				type: Sequelize.ENUM,
				allowNull: false,
				values: ["V", "J", "E", "G", "P"],
			},
			bank: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			AccountOwner: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			accountType: {
				type: Sequelize.ENUM,
				values: ["ahorro", "corriente"],
				allowNull: false,
			},
			accountNumber: {
				type: Sequelize.STRING(20),
				allowNull: false,
				unique: true,
				validate: {
					len: [20, 20],
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
		await queryInterface.dropTable("banks");
	},
};
