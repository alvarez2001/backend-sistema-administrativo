const router = require("express").Router();
const middlewares = require("../middlewares");
const { check, param, body } = require("express-validator");
const constroller = require("../../controllers/usuario_controller");

router.post(
	"/registro",
	[
		body("nombre", "El nombre es obligatorio").notEmpty(),
		body("apellido", "El apellido es obligatorio").notEmpty(),
		body("email", "El email es obligatorio").notEmpty().isEmail(),
		body("username", "El username es obligaroio")
			.notEmpty()
			.custom(async (value) => {
				const usuario = await constroller.comprobarUsernamequeexiste(value);
				if (usuario) {
					throw new Error("El username ya existe");
				}
			}),
		body("password", "La contraseña es obligatoria").notEmpty(),
	],
	middlewares.checkErrors,
	constroller.crearUsuario,
);
router.post(
	"/login",
	[
		body("username", "El username es obligatorio").notEmpty(),
		body("password", "La contraseña es obligatoria").notEmpty(),
	],
	middlewares.checkErrors,
	constroller.loginUsuario,
);
router.get("/imagen/:image", constroller.imageUsuario);

module.exports = router;
