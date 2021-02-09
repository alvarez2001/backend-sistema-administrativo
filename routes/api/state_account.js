const router = require("express").Router();
const controllersState = require("../../controllers/state_account_controllers");
const middlewares = require("../middlewares");
const path = require("path");
const { check, param } = require("express-validator");

router.get("/", controllersState.conseguirTodos);
router.get("/reference/all", controllersState.getReferenciasAll);
router.get("/excel/:fecha1/:fecha2", async (req, res) => {
	const datas = await controllersState.getAll(
		req.params.fecha1,
		req.params.fecha2,
	);

	const workSheetColumnNames = [
		"id",
		"Fecha",
		"Referencia",
		"Concepto",
		"DEBE",
		"HABER",
		"SALDO",
		"Verificado",
	];
	const workSheetName = "Libro Mayor";
	const filePath = "./output/excel.xlsx";
	const excelExport = controllersState.exportUserToExcel(
		datas,
		workSheetColumnNames,
		workSheetName,
		filePath,
	);

	return res.download(path.resolve(filePath), "excel.xlsx", (error) => {
		if (error) {
			console.log(error);
		} else {
		}
	});
});

router.post(
	"/",
	[
		check("date", "La fecha es obligatoria")
			.not()
			.isEmpty()
			.isDate()
			.withMessage("Debe ser una fecha valida"),
		check("reference", "La referencia es obligatoria")
			.not()
			.isEmpty()
			.bail()
			.isDecimal()
			.withMessage("La referencia debe ser numerica")
			.custom((value) => {
				return controllersState.comprobarSiExiste(value);
			})
			.bail(),

		check("sign", "El signo es obligatorio").not().isEmpty(),
		check("mount", "El monto es obligatorio")
			.not()
			.isEmpty()
			.bail()
			.isDecimal()
			.withMessage("El monto debe ser numerico"),
		check("commission", "La comision es obligatoria").not().isEmpty(),
		check(
			"cuenta_terceros",
			"Seleccione si es cuenta a otros bancos o del mismo banco",
		)
			.notEmpty()
			.isLowercase()
			.isIn(["si", "no"])
			.withMessage("Las respuestas de cuentas de terceros es si o no"),
		check("monto_comision", "El monto de la comision es obligatorio")
			.if((value, { req }) => req.body.cuenta_terceros === "si")
			.isDecimal()
			.withMessage("El monto de la comision debe ser numerico"),
	],
	middlewares.checkErrors,
	controllersState.crearState,
);

router.get("/:reference", controllersState.oneState);

router.put(
	"/:reference",
	[
		check("sign", "El signo es obligatorio").not().isEmpty(),
		check("commission", "La comision es obligatoria").not().isEmpty(),
		param("reference")
			.custom((value) => {
				return controllersState.comprobarNoExiste(value);
			})
			.bail(),
	],
	middlewares.checkErrors,
	controllersState.putState,
);
router.delete(
	"/:reference",
	[
		param("reference")
			.custom((value) => {
				return controllersState.comprobarNoExiste(value);
			})
			.bail(),
	],
	middlewares.checkErrors,
	controllersState.deleteState,
);

module.exports = router;
