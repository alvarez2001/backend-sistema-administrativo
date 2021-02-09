const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./database/db");
const cors = require("cors");
const apiRouter = require("./routes/api");
require("./database/associations");
const PORT = process.env.PORT | 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
	res.json({ welcome: "a la api" });
});
app.use("/api", apiRouter);

app.listen(PORT, () => {
	console.log("servidor arrancado en el host " + PORT);

	sequelize
		.sync({ force: false })
		.then(() => {
			console.log("conectado a la db");
		})
		.catch((error) => {
			console.log("se ha producido un error" + error);
		});
});
