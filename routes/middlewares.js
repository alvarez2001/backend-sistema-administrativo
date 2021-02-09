const { validationResult } = require("express-validator");

const checkErrors = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errores: errors.array() });
	}
	next();
};

module.exports = {
	checkErrors: checkErrors,
};
