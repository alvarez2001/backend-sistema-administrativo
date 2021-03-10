const config = require("./config-orm");

module.exports = {
	database: {
		database: config.database,
		username: config.username,
		password: config.password,
		host: config.host,
		dialect: config.dialect,
	},
};
