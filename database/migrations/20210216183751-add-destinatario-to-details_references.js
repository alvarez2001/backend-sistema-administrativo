module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.sequelize.transaction((t) => {
			return Promise.all([
				queryInterface.addColumn(
					"details_references",
					"destinatario",
					{
						type: Sequelize.STRING,
						allowNull: true,
					},
					{ transaction: t },
				),
			]);
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.sequelize.transaction((t) => {
			return Promise.all([
				queryInterface.removeColumn("details_references", "destinatario", {
					transaction: t,
				}),
			]);
		});
	},
};
