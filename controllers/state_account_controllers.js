const account_state = require("../database/models/estadoCuenta");
const { Op } = require("sequelize");
const xlsx = require("xlsx");
const path = require("path");
const DetailsReferences = require("../database/models/details-reference");
const { sequelize } = require("../database/db");
const { success, errores } = require("../dto/outputData");
const buildPaginator = require("pagination-apis");
const moment = require("moment");
const xl = require("excel4node");

const paginacion = async (req, res) => {
	let page2 = parseInt(req.query.page);
	let limit2 = parseInt(req.query.limit);

	if (page2 < 1 || isNaN(page2)) {
		page2 = 1;
	}
	if (limit2 < 1 || isNaN(limit2)) {
		limit2 = 10;
	}

	const { page, limit, skip, paginate } = buildPaginator({
		limit: limit2,
		page: page2,
	});

	const momento = moment([parseInt(req.params.ano), parseInt(req.params.mes)]);
	const desde = momento.startOf("month").format("YYYY-MM-DD");
	const hasta = momento.endOf("month").format("YYYY-MM-DD");

	const { count, rows } = await account_state.findAndCountAll({
		limit,
		offset: skip,
		where: {
			date: {
				[Op.between]: [desde, hasta],
			},
		},
		// order: [["date", "ASC"]],
	});
	const response = Object.assign({}, paginate(rows, count), { page });

	return success(res, 200, response);
};

const crearState = async (req, res) => {
	try {
		const result = await sequelize.transaction(async (t) => {
			const datos = {
				date: req.body.date,
				reference: req.body.reference,
				sign: req.body.sign,
				mount: req.body.mount,
				commission: req.body.commission,
			};

			const state = await crearStateIndividual(datos, t);
			const States = [];
			States.push(state);
			if (req.body.cuenta_terceros === "si") {
				const ReferenceString = datos.reference.split("");
				const array = ReferenceString.splice(3, ReferenceString.length - 3);
				const reference = "221" + array.join("");
				const datosComision = Object.assign(
					{},
					{
						...datos,
						reference: reference,
						mount: req.body.monto_comision,
						commission: "si",
					},
				);

				const stateComision = await crearStateIndividual(datosComision, t);
				States.push(stateComision);
			}

			return success(res, 200, "Se ha registrado la transferencia con exito");
		});
	} catch (error) {
		return errores(
			res,
			200,
			"Ha ocurrido un error al registrar la transferencia",
		);
	}
};

const crearStateIndividual = async (datos, t) => {
	const state = await account_state.create(
		{
			date: datos.date,
			reference: datos.reference,
			sign: datos.sign,
			mount: datos.mount,
			commission: datos.commission,
		},
		{
			fields: ["date", "reference", "sign", "mount", "commission"],
			transaction: t,
		},
	);
	return state;
};

const getAll = async (desde, hasta) => {
	return await account_state.findAll({
		attributes: [
			"id",
			"date",
			"reference",
			"sign",
			"mount",
			"commission",
			"verified",
		],

		include: {
			model: DetailsReferences,
			as: "details",
			attributes: ["concept", "destinatario"],
		},
		where: {
			date: {
				[Op.between]: [desde, hasta],
			},
		},
	});
};

const conseguirTodos = async (req, res) => {
	try {
		const state = await account_state.findAll();
		return res.json(state);
	} catch (error) {
		return res.status(400).json({ errores: error });
	}
};

const getReferenciasAll = async (req, res) => {
	try {
		const getReferencias = await account_state.findAll({
			attributes: ["reference", "verified", "id"],
		});
		return success(res, 200, getReferencias);
	} catch (error) {
		return errores(res, 400, "Ha ocurrido un error al buscar las referencias");
	}
};
const oneState = async (req, res) => {
	try {
		const oneState = await account_state.findOne({
			where: {
				reference: {
					[Op.like]: `%${req.params.reference}%`,
				},
			},
			attributes: [
				"commission",
				"date",
				"id",
				"mount",
				"reference",
				"sign",
				"verified",
			],
		});
		if (oneState) {
			return success(res, 200, oneState);
		}
		return errores(res, 404, "No se ha encontrado la referencia");
	} catch (error) {
		return errores(res, 400, "Ha ocurrido un error al buscar la referencia");
	}
};
const putState = async (req, res) => {
	try {
		const oneState = await account_state.update(
			{
				sign: req.body.sign,
				commission: req.body.commission,
			},
			{
				where: {
					reference: req.params.reference,
				},

				fields: ["sign", "commission"],
			},
		);

		return res.json({
			success:
				"Se ha actualizado correctamente el estado " + req.params.reference,
		});
	} catch (error) {
		return res.status(400).json({ errores: error });
	}
};

const verifiedState = async (id, t) => {
	try {
		const oneState = await account_state.update(
			{
				verified: "si",
			},
			{
				where: {
					id: id,
				},
				fields: ["verified"],
				transaction: t,
			},
		);

		return oneState;
	} catch (error) {
		return false;
	}
};

const deleteState = async (req, res) => {
	try {
		const oneState = await account_state.destroy({
			where: { reference: req.params.reference },
		});

		return res.json({
			success:
				"Se ha eliminado correctamente el estado " + req.params.reference,
		});
	} catch (error) {
		return res.status(400).json({ errores: error });
	}
};
const findOne = (reference) => {
	return account_state.findAll({
		where: {
			reference: {
				[Op.eq]: reference,
			},
		},
	});
};
const comprobarSiExiste = (reference) => {
	return findOne(reference).then((state) => {
		if (state.length > 0) {
			return Promise.reject("Ya existe el registro en la base de datos");
		}
	});
};

const comprobarNoExiste = (reference) => {
	return findOne(reference).then((state) => {
		if (state.length < 1) {
			return Promise.reject("No existe el registro en la base de datos");
		}
	});
};

const comprobarNoexistePk = (id) => {
	return account_state.findByPk(id).then((state) => {
		if (!state) {
			return Promise.reject("No existe el registro en la base de datos");
		}
	});
};

const createExcel = (data, workSheetColumnNames, workSheetName, filePath) => {
	const workBook = xlsx.utils.book_new();
	const workSheetData = [workSheetColumnNames, ...data];
	const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
	xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
	xlsx.writeFile(workBook, path.resolve(filePath));
};

const exportUserToExcel = (
	datas,
	workSheetColumnNames,
	workSheetName,
	filePath,
) => {
	const data = datas.map((dat) => {
		const mount = parseFloat(dat.mount);

		const datosMontos = {
			debe: 0,
			haber: 0,
		};

		if (dat.sign === "+") {
			datosMontos.debe = mount;
		}
		if (dat.sign === "-") {
			datosMontos.haber = mount;
		}

		return [
			dat.date,
			dat.reference,
			dat?.details?.concept,
			datosMontos.debe,
			datosMontos.haber,
			dat?.saldo,
		];
	});

	createExcel(data, workSheetColumnNames, workSheetName, filePath);
};

const exportExcel4node = ({ fecha, datos }) => {
	const wb = new xl.Workbook();

	const ws = wb.addWorksheet("Libro Mayor");
	const ws2 = wb.addWorksheet("Libro Diario");

	// Create a reusable style
	var style = wb.createStyle({
		font: {
			color: "#374151",
			size: 12,
		},
		numberFormat: "$#,##0.00; ($#,##0.00); -",
	});

	ws.cell(2, 1).string("Fecha").style(style);
	ws.cell(2, 2).string("Referencia").style(style);
	ws.cell(2, 3).string("Concepto").style(style);
	ws.cell(2, 4).string("Debe").style(style);
	ws.cell(2, 5).string("Haber").style(style);
	ws.cell(2, 6).string("Saldo").style(style);

	ws2.cell(2, 1).string("Fecha").style(style);
	ws2.cell(2, 2).string("Referencia").style(style);
	ws2.cell(2, 3).string("Concepto").style(style);
	ws2.cell(2, 4).string("Destinatario").style(style);
	ws2.cell(2, 5).string("Debe").style(style);
	ws2.cell(2, 6).string("Haber").style(style);

	ws.cell(3, 3).string(`Saldo al ${fecha}`).style(style);
	ws.cell(3, 6).number(0).style(style);

	for (let i = 0; i < datos.length; i++) {
		const transferencia = datos[i];
		const actual = i + 4;
		ws.cell(actual, 1).string(transferencia.date).style(style);
		ws.cell(actual, 2).string(transferencia.reference).style(style);
		if (transferencia?.details?.concept) {
			ws.cell(actual, 3).string(transferencia?.details?.concept).style(style);
		}
		if (transferencia.sign === "+") {
			ws.cell(actual, 4).number(parseFloat(transferencia.mount)).style(style);
		} else {
			ws.cell(actual, 5).number(parseFloat(transferencia.mount)).style(style);
		}
		ws.cell(actual, 6)
			.formula(`F${actual - 1}+D${actual}-E${actual}`)
			.style(style);
	}

	//libro diario
	for (let i = 0; i < datos.length; i++) {
		const transferencia = datos[i];
		const actual = i + 3 + 1;
		ws2.cell(actual, 1).string(transferencia.date).style(style);
		ws2.cell(actual, 2).string(transferencia.reference).style(style);
		if (transferencia?.details?.concept) {
			ws2.cell(actual, 3).string(transferencia?.details?.concept).style(style);
		}
		if (transferencia?.details?.destinatario) {
			ws2
				.cell(actual, 4)
				.string(transferencia?.details?.destinatario)
				.style(style);
		}
		if (transferencia.sign === "+") {
			ws2.cell(actual, 5).number(parseFloat(transferencia.mount)).style(style);
		} else {
			ws2.cell(actual, 6).number(parseFloat(transferencia.mount)).style(style);
		}
	}

	// // Set value of cell C1 to a formula styled with paramaters of style
	// ws.cell(1, 3).formula("A1 + B1").style(style);

	wb.write("./output/excel.xlsx");
};

module.exports = {
	crearState,
	conseguirTodos,
	oneState,
	comprobarNoexistePk,
	putState,
	deleteState,
	comprobarNoExiste,
	comprobarSiExiste,
	verifiedState,
	getReferenciasAll,
	exportUserToExcel,
	getAll,
	exportExcel4node,
	paginacion,
};
