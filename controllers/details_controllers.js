const { sequelize } = require("../database/db");
const DetailsReferences = require("../database/models/details-reference");
const AccountState = require("../database/models/estadoCuenta");
const { verifiedState } = require("./state_account_controllers");
const { getOneExist } = require("./banks_controllers");
const { get } = require("../routes/api/details");

const getAll = async (req, res) => {
	try {
		const detailsReference = await DetailsReferences.findAll({
			attributes: ["concept", "accountOrigin", "id"],
			include: {
				model: AccountState,
				as: "reference",
				attributes: ["reference", "sign", "mount", "commission", "verified"],
			},
		});
		return res.json(detailsReference);
	} catch (error) {
		return res.status(400).json({ errores: error });
	}
};

const getOne = async (req, res) => {
	try {
		const detailsReference = await DetailsReferences.findOne({
			attributes: ["concept", "accountOrigin", "id"],
			where: {
				reference_id: req.params.reference,
			},
			include: {
				model: AccountState,
				as: "reference",
				attributes: [
					"reference",
					"sign",
					"mount",
					"commission",
					"verified",
					"id",
					"date",
				],
			},
		});

		if (detailsReference) {
			return res.json(detailsReference);
		}
		return res.status(404).json({
			errores: { msg: "No se ha podido encontrar la referencia solicitada" },
		});
	} catch (error) {
		return res.status(400).json({ errores: error });
	}
};

const createOne = async (req, res) => {
	const bankid = parseInt(req.body.bank_id);

	const datos = {
		concept: req.body.concept,
		accountOrigin: req.body.accountOrigin,
		reference_id: req.body.reference_id,
	};

	if (!isNaN(bankid)) {
		const one = await getOneExist(req.body.bank_id);
		datos["bank_id"] = bankid;

		if (!one) {
			return res.status(400).json({
				errores: { msg: "No existe el identificador del banco" },
			});
		}
	}
	try {
		const result = await sequelize.transaction(async (t) => {
			verifiedState(req.body.reference_id, t);

			const details = await DetailsReferences.create(Object.assign({}, datos), {
				fields: ["concept", "accountOrigin", "bank_id", "reference_id"],
				transaction: t,
			});
			return res.json(details);
		});
	} catch (error) {
		return res.status(400).json({ errores: error });
	}
};

const comprobarexistencia = (idReferencia) => {
	return DetailsReferences.findOne({
		where: {
			reference_id: idReferencia,
		},
	}).then((value) => {
		if (value) {
			return Promise.reject(
				"Ya se encuentra registrado un detalle a la referencia",
			);
		}
	});
};

const deleteOne = async (req, res) => {
	try {
		const details = await DetailsReferences.destroy({
			where: { id: req.params.details },
		});

		return details
			? res.json({
					success: {
						msg: "Se ha eliminado correctamente el detalle de la transferencia",
					},
			  })
			: res.json({
					errores: {
						msg:
							"No se pudo eliminar o no existe el detalle de la transferencia",
					},
			  });
	} catch (error) {
		return res.status(400).json({ errores: error });
	}
};

module.exports = {
	getAll,
	comprobarexistencia,
	createOne,
	getOne,
	deleteOne,
};
