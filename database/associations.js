const AccountState = require("./models/estadoCuenta");
const Banks = require("./models/banks");
const DetailsReferences = require("./models/details-reference");
const Usuario = require("./models/usuarios");

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
