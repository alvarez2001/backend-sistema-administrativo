const account_state = require("../database/models/estadoCuenta");
const { Op } = require("sequelize");
const xlsx = require("xlsx");
const path = require("path");
const DetailsReferences = require("../database/models/details-reference");
const { sequelize } = require("../database/db");
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

			return res.json(States);
		});
	} catch (error) {
		return res.status(400).json({ errores: error });
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
			attributes: ["concept"],
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
		return res.json(getReferencias);
	} catch (error) {
		return res.status(400).json({ errores: error });
	}
};
const oneState = async (req, res) => {
	try {
		const oneState = await account_state.findAll({
			where: {
				reference: {
					[Op.like]: `%${req.params.reference}%`,
				},
			},
		});
		return res.json(oneState);
	} catch (error) {
		return res.status(400).json({ errores: error });
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
			dat.id,
			dat.date,
			dat.reference,
			dat?.details?.concept,
			datosMontos.debe,
			datosMontos.haber,
			dat?.saldo,
			dat?.verified,
		];
	});

	createExcel(data, workSheetColumnNames, workSheetName, filePath);
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
};
