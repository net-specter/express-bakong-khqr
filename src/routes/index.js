const express = require("express");
const router = express.Router();

router.use(`/payments`, require("./payments/planPaymentRoutes"));

module.exports = router;
