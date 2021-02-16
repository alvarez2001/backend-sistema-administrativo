const moment = require("moment");
const bcryp = require("bcryptjs");
const jwt = require("jwt-simple");
const Usuario = require("../database/models/usuarios");
const dtoUsuario = require("../dto/usuario");

const crearUsuario = async (req, res) => {
	req.body.password = bcryp.hashSync(req.body.password, 10);

	const user = dtoUsuario.todosLosDatosUsuario(req.body);

	try {
		const usu = await Usuario.create(user, {
			fields: ["password", "nombre", "apellido", "username", "email"],
		});

		return res.json({ success: "Se ha creado el usuario" });
	} catch (error) {
		return res.json({ errores: error });
	}
};

const comprobarUsernamequeexiste = async (username) => {
	const usuario = await Usuario.findOne({ where: { username: username } });
	return usuario;
};

const loginUsuario = async (req, res) => {
	const usuario = await Usuario.findOne({
		where: { username: req.body.username },
	});
	if (usuario) {
		const iguales = bcryp.compareSync(req.body.password, usuario.password);
		if (iguales) {
			return res.json({ success: crearToken(usuario) });
		} else {
			return res.json({ errores: "Error en usuario y/o contraseña" });
		}
	} else {
		return res.json({ errores: "Error en usuario y/o contraseña" });
	}
};

const crearToken = (usuario) => {
	const payload = {
		usuarioId: usuario.id,
		createdAt: moment().unix(),
		expiredAt: moment().add(5, "minutes").unix(),
	};

	return jwt.encode(payload, "sistema administrativo");
};

module.exports = {
	crearUsuario,
	loginUsuario,
	comprobarUsernamequeexiste,
};
