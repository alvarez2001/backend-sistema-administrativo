const router = require("express").Router();
const state_account_router = require("./api/state_account");
const banks_router = require("./api/bank");
const details = require("./api/details");
const usuario = require("./api/usuario");
const { checkToken } = require("./middlewares");

router.use("/state-account", checkToken, state_account_router);
router.use("/bank", checkToken, banks_router);
router.use("/details", checkToken, details);
router.use("/usuario", usuario);

module.exports = router;
