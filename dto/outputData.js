const errores = (res, code, msg) => {
	return res.status(code).json({
		errores: [{ msg }],
		success: false,
	});
};

const success = (res, code, msg) => {
	return res.status(code).json({
		success: true,
		data: msg,
	});
};

module.exports = {
	errores,
	success,
};
