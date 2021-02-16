const { validationResult } = require("express-validator");
const jwt = require("jwt-simple");
const moment = require("moment");

const checkErrors = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errores: errors.array() });
	}
	next();
};

const checkToken = (req, res, next) => {
	if (!req.headers["user-token"]) {
		return res.json({ errores: "es necesaria la cabecera del token" });
	}
	const userToken = req.headers["user-token"];
	let payload = {};
	try {
		payload = jwt.decode(userToken, "sistema administrativo");
		if (payload.expiredAt < moment().unix) {
			return res.json({ errores: "El token ha expirado" });
		}
	} catch (error) {
		return res.json({ errores: "El token es incorrecto" });
	}

	req.usuarioId = payload.usuarioId;

	next();
};

module.exports = {
	checkErrors,
	checkToken,
};
