const router = require("express").Router();
const controllersState = require("../../controllers/details_controllers");
const {
	comprobarNoexistePk,
} = require("../../controllers/state_account_controllers");
const middlewares = require("../middlewares");
const { check, param } = require("express-validator");

router.get("/", controllersState.getAll);
router.get(
	"/:reference",
	[
		param("reference", "La referencia es obligatoria")
			.not()
			.isEmpty()
			.isDecimal()
			.withMessage("La referencia debe ser numerica"),
	],
	middlewares.checkErrors,
	controllersState.getOne,
);
router.put("/:id", middlewares.checkErrors, controllersState.actualizarDetalle);
router.post(
	"/",
	[
		check("concept", "El concepto es obligatorio")
			.not()
			.isEmpty()
			.trim()
			.escape(),
		check("accountOrigin", "El origen es obligatorio")
			.not()
			.isEmpty()
			.trim()
			.escape(),
		check("reference_id", "La id de la referencia es obligatorio")
			.not()
			.isEmpty()
			.custom((value) => {
				return controllersState.comprobarexistencia(value);
			})
			.custom((value) => {
				return comprobarNoexistePk(value);
			}),
		check("destinatario", "El destinatario es obligatorio")
			.notEmpty()
			.trim()
			.escape(),
	],
	middlewares.checkErrors,
	controllersState.createOne,
);

module.exports = router;
