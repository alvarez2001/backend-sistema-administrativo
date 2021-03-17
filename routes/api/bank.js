const router = require("express").Router();
const controllersState = require("../../controllers/banks_controllers");
const middlewares = require("../middlewares");
const { check, param } = require("express-validator");

router.get("/", controllersState.getAll);
router.get("/:bank", controllersState.getOne);
router.get("/names/list", controllersState.getNameBanks);
router.post(
	"/",
	[
		check("identificationCard", "La cedula/rif es obligatoria")
			.not()
			.isEmpty()
			.isLength({ max: 20 })
			.withMessage("La cedula/rif debe contener maximo 20 caracteres")
			.isDecimal()
			.withMessage("La cedula/rif solo acepta caracteres numericos"),
		check("nationality", "La nacionalidad es obligatoria")
			.not()
			.isEmpty()
			.isUppercase()
			.isIn(["V", "J", "P", "G", "E"])
			.withMessage(
				"La nacionalidad debe ser una de las letrass ( V , J , P , G , E )",
			),

		check("bank", "El nombre del banco es obligatorio").not().isEmpty(),
		check(
			"AccountOwner",
			"El nombre del propietario de la cuenta es obligatorio",
		)
			.not()
			.isEmpty(),
		check("accountType", "El tipo de cuenta es obligatorio")
			.not()
			.isEmpty()
			.isLowercase()
			.isIn(["corriente", "ahorro"])
			.withMessage("El tipo de cuenta debe ser ahorro o corriente"),
		check("accountNumber", "El numero de cuenta es obligatorio")
			.not()
			.isEmpty()
			.isLength({ min: 20, max: 20 })
			.withMessage("El numero de cuenta debe ser de 20 digitos")
			.isDecimal()
			.withMessage("Solo acepta caracteres numericos la cuenta")
			.custom((value) => {
				return controllersState.comprobarSiExiste(value);
			}),
	],
	middlewares.checkErrors,
	controllersState.createOne,
);

router.delete(
	"/:bank",
	[
		param("bank")
			.isNumeric()
			.withMessage("Debe ser una ID el parametro para borrar"),
	],
	middlewares.checkErrors,
	controllersState.deleteOne,
);

module.exports = router;
