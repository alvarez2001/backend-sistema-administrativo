const Banks = require("../database/models/banks");
const { Op } = require("sequelize");

const getAll = async (req, res) => {
	try {
		const bank = await Banks.findAll({
			attributes: [
				"identificationCard",
				"nationality",
				"bank",
				"AccountOwner",
				"accountType",
				"accountNumber",
				"id",
			],
		});
		return res.json(bank);
	} catch (error) {
		return res.status(400).json({ errores: error });
	}
};

const getOne = async (req, res) => {
	try {
		const bank = await Banks.findByPk(req.params.bank, {
			attributes: [
				"identificationCard",
				"nationality",
				"bank",
				"AccountOwner",
				"accountType",
				"accountNumber",
				"id",
			],
		});

		return bank
			? res.json(bank)
			: res.json({ errores: { msg: "No se ha encontrado el banco" } });
	} catch (error) {
		return res.status(400).json({ errores: error });
	}
};

const comprobarSiExiste = (value) => {
	return Banks.findOne({ where: { accountNumber: value } }).then(
		(numberBank) => {
			if (numberBank) {
				return Promise.reject(
					"Ya existe el numero de cuenta en la base de datos",
				);
			}
		},
	);
};

const comprobarExistenciaID = (id) => {
	return Banks.findByPk(id).then((existe) => {
		if (!existe) {
			return Promise.reject("No existe el identificador del banco");
		}
	});
};

const getOneExist = async (id) => {
	return await Banks.findByPk(id);
};

const getNameBanks = async (req, res) => {
	try {
		const banksNames = await Banks.findAll({ attributes: ["bank"] });

		return res.json(banksNames);
	} catch (error) {
		return res.status(400).json({ errores: error });
	}
};

const createOne = async (req, res) => {
	try {
		const bank = await Banks.create(
			{
				identificationCard: req.body.identificationCard,
				nationality: req.body.nationality,
				bank: req.body.bank,
				AccountOwner: req.body.AccountOwner,
				accountType: req.body.accountType,
				accountNumber: req.body.accountNumber,
			},
			{
				fields: [
					"identificationCard",
					"nationality",
					"bank",
					"AccountOwner",
					"accountType",
					"accountNumber",
				],
			},
		);
		return res.json(bank);
	} catch (error) {
		return res.status(400).json({ errores: error });
	}
};

const deleteOne = async (req, res) => {
	try {
		const banks = await Banks.destroy({ where: { id: req.params.bank } });

		return banks
			? res.json({
					success: { msg: "Se ha eliminado correctamente el banco" },
			  })
			: res.json({
					errores: { msg: "No se pudo eliminar o no existe el banco" },
			  });
	} catch (error) {
		return res.status(400).json({ errores: error });
	}
};

module.exports = {
	getAll,
	getOne,
	createOne,
	getNameBanks,
	comprobarSiExiste,
	deleteOne,
	comprobarExistenciaID,
	getOneExist,
};
