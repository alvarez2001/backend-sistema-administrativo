const moment = require("moment");
const bcryp = require("bcryptjs");
const jwt = require("jwt-simple");
const Usuario = require("../database/models/usuarios");
const dtoUsuario = require("../dto/usuario");
const { errores, success } = require("../dto/outputData");
const path = require("path");

const crearUsuario = async (req, res) => {
	req.body.password = bcryp.hashSync(req.body.password, 10);

	const image = req.files?.image;
	const user = dtoUsuario.todosLosDatosUsuario(req.body);

	try {
		const nameImage = image ? moment().unix() + image.name : null;
		if (image) {
			image.mv(`./images/${nameImage}`);
		}
		const usu = await Usuario.create(
			Object.assign({}, user, { image: nameImage }),
			{
				fields: [
					"password",
					"nombre",
					"apellido",
					"username",
					"email",
					"image",
				],
			},
		);

		return success(res, 200, "Se ha creado el usuario");
	} catch (error) {
		return errores(res, 400, "Ha ocurrido un error al crear el usuario");
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
			return success(res, 200, {
				token: crearToken(usuario),
				usuario: dtoUsuario.usuario(usuario, true),
			});
		} else {
			return errores(res, 400, "Error en usuario y/o contraseña");
		}
	} else {
		return errores(res, 400, "Error en usuario y/o contraseña");
	}
};

const imageUsuario = (req, res) => {
	const param = req.params.image;
	const pathImage = path.resolve(__dirname, `../images/${param}`);

	return res.sendFile(pathImage);
};

const crearToken = (usuario) => {
	const payload = {
		usuarioId: usuario.id,
		createdAt: moment().unix(),
		expiredAt: moment().add(360, "minutes").unix(),
	};

	return jwt.encode(payload, "sistema administrativo");
};

module.exports = {
	crearUsuario,
	loginUsuario,
	comprobarUsernamequeexiste,
	imageUsuario,
};
