const { sequelize } = require("../database/db");
const DetailsReferences = require("../database/models/details-reference");
const AccountState = require("../database/models/estadoCuenta");
const { verifiedState } = require("./state_account_controllers");
const { getOneExist } = require("./banks_controllers");
const { get } = require("../routes/api/details");
const { errores, success } = require("../dto/outputData");

const getAll = async (req, res) => {
	try {
		const detailsReference = await DetailsReferences.findAll({
			attributes: ["concept", "accountOrigin", "id", "destinatario"],
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
		console.log(req.params.reference);
		const detailsReference = await DetailsReferences.findOne({
			attributes: ["concept", "accountOrigin", "id", "destinatario"],
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
			return success(res, 200, detailsReference);
		}
		return errores(
			res,
			404,
			"No se ha podido encontrar la referencia solicitada",
		);
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
		destinatario: req.body?.destinatario,
	};

	if (!isNaN(bankid)) {
		const one = await getOneExist(req.body.bank_id);
		datos["bank_id"] = bankid;

		if (!one) {
			return errores(res, 404, "No existe el identificador del banco");
		}
	}
	try {
		const result = await sequelize.transaction(async (t) => {
			verifiedState(req.body.reference_id, t);

			const details = await DetailsReferences.create(Object.assign({}, datos), {
				fields: [
					"concept",
					"accountOrigin",
					"bank_id",
					"reference_id",
					"destinatario",
				],
				transaction: t,
			});
			return success(
				res,
				200,
				"Se ha verificado correctamente la transferencia",
			);
		});
	} catch (error) {
		return errores(
			res,
			400,
			"Ha ocurrido un error al verificar la transferencia",
		);
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

const actualizarDetalle = async (req, res) => {
	const actualizar = await DetailsReferences.findOne({
		where: { id: req.params.id },
	});

	if (actualizar) {
		try {
			const result = await sequelize.transaction(async (t) => {
				if (req.body.concept && req.body.concept !== actualizar.concept) {
					await actualizar.update(
						{ concept: req.body.concept },
						{ transaction: t },
					);
				}
				if (
					req.body.destinatario &&
					req.body.destinatario !== actualizar.destinatario
				) {
					await actualizar.update(
						{ destinatario: req.body.destinatario },
						{ transaction: t },
					);
				}
				if (
					req.body.accountOrigin &&
					req.body.accountOrigin !== actualizar.accountOrigin
				) {
					await actualizar.update(
						{ accountOrigin: req.body.accountOrigin },
						{ transaction: t },
					);
				}

				return res.json({
					success: "Se ha actualizado correctamente",
					data: actualizar,
				});
			});
		} catch (error) {
			return res.json({ errores: error });
		}
	} else {
		return res.status(400).json({
			errores: "No se ha encontrado el id del detalle de la referencia",
		});
	}
};

module.exports = {
	getAll,
	actualizarDetalle,
	comprobarexistencia,
	createOne,
	getOne,
	deleteOne,
};
