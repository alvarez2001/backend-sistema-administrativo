const router = require("express").Router();
const state_account_router = require("./api/state_account");
const banks_router = require("./api/bank");
const details = require("./api/details");

router.use("/state-account", state_account_router);
router.use("/bank", banks_router);
router.use("/details", details);

module.exports = router;
