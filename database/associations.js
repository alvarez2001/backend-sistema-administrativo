const AccountState = require("./models/estadoCuenta");
const Banks = require("./models/banks");
const DetailsReferences = require("./models/details-reference");
const Usuario = require("./models/usuarios");
const Control = require("./models/control");
const Detalle_Control = require("./models/detalle-control");

Control.hasMany(Detalle_Control, {
	as: "detalle",
	foreignKey: {
		name: "control_id",
		allowNull: true,
	},
});
Detalle_Control.belongsTo(Control, {
	as: "control",
	foreignKey: {
		name: "control_id",
		allowNull: true,
	},
});

AccountState.hasMany(Detalle_Control, {
	as: "detalle",
	foreignKey: {
		name: "account_id",
		allowNull: true,
	},
});

Detalle_Control.belongsTo(AccountState, {
	as: "account",
	foreignKey: {
		name: "account_id",
		allowNull: true,
	},
});

//un estado de cuenta con el detalle de la transferencia
// añade una clave foranea a la tabla detailsreference
AccountState.hasOne(DetailsReferences, {
	as: "details",
	foreignKey: {
		name: "reference_id",
		allowNull: false,
		unique: true,
	},
});
//añade una clave accountstateid a la tabla details
DetailsReferences.belongsTo(AccountState, {
	as: "reference",
	foreignKey: {
		name: "reference_id",
		allowNull: false,
		unique: true,
	},
});

// uno a muchos
Banks.hasMany(DetailsReferences, {
	as: "details",
	foreignKey: "bank_id",
});
DetailsReferences.belongsTo(Banks, {
	as: "bank",
	foreignKey: "bank_id",
});
