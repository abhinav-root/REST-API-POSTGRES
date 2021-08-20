const router = require("express").Router();
const authRoute = require("./authRoute");
const noteRoute = require("./noteRoute");

router.use("/auth", authRoute);
router.use("/user", noteRoute);

module.exports = router;
