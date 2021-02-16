const usuario = (data, mostrarId = false) => {
	const datos = {
		nombre: data.nombre,
		apellido: data.apellido,
		email: data.email,
		username: data.username,
	};

	if (mostrarId) {
		datos.id = data.id;
	}

	return datos;
};
const todosLosDatosUsuario = (data) => {
	const usu = usuario(data);
	usu.password = data.password;
	return usu;
};

const passwordUsuario = (data) => {
	return data.password;
};

module.exports = {
	usuario,
	passwordUsuario,
	todosLosDatosUsuario,
};
