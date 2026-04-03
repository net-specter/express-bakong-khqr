const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/paymentController");

// POST /payments/initiate-payment - Generates a unique KHQR code/deeplink for a plan payment.
router.post("/initiate-payment", paymentController.initiatePayment);

// GET /payments/check-status/:md5Hash - Checks the payment status using the MD5 hash of the KHQR string.
router.get("/check-status/:md5Hash", paymentController.checkPaymentStatusMD5);

module.exports = router;
