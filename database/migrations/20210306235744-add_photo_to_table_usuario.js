module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.sequelize.transaction((t) => {
			return Promise.all([
				queryInterface.addColumn(
					"usuarios",
					"image",
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
				queryInterface.removeColumn("usuarios", "image", {
					transaction: t,
				}),
			]);
		});
	},
};
