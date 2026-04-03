const {
  generateKhqrPayload,
  createQrCodeImage,
  createQRStand,
} = require("../utils/khqrUtils");
require("dotenv").config();
const bakongApiService = require("../services/bakongApiService");
const { hashJsonObject } = require("../utils/encryptUtils");

exports.initiatePayment = async (req, res, next) => {
  const { amount, currency = "KHR" } = req.body;

  try {
    // Validate amount
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Invalid amount. Must be a positive number.",
      });
    }

    const BAKONG_ACCOUNT_ID = process.env.BAKONG_ACCOUNT_ID;
    const MERCHANT_NAME = process.env.MERCHANT_NAME;
    const ACQUIRING_BANK = process.env.ACQUIRING_BANK;
    const MERCHANT_CITY = process.env.MERCHANT_CITY;
    const MOBILE_NUMBER = process.env.MOBILE_NUMBER;
    const STORE_LABEL = process.env.STORE_LABEL;

    const transactionRefHash = {
      amount: amount,
      currency: currency,
      dateTime: new Date().toISOString(),
    };

    const transactionRefHashString = hashJsonObject(
      JSON.stringify(transactionRefHash),
    );

    const expire = new Date().getTime() + 3 * 60 * 1000; // 3 minutes in ms

    const transactionRef = `Transaction-${transactionRefHashString.substring(0, 20)}`;

    const data = {
      price: amount,
      currency: currency,
      bakongAccountID: BAKONG_ACCOUNT_ID,
      merchantName: MERCHANT_NAME,
      acquiringBank: ACQUIRING_BANK,
      merchantCity: MERCHANT_CITY,
      mobileNumber: MOBILE_NUMBER,
      storeLabel: STORE_LABEL,
      expirationTimestamp: expire,
    };

    // --- 2. GENERATE KHQR PAYLOAD (STRING) ---
    const { khqrString, md5Hash } = generateKhqrPayload(transactionRef, data);
    let qrStand;
    if (khqrString) {
      const qrCodeImage = await createQrCodeImage(khqrString);
      qrStand = await createQRStand(qrCodeImage, data.merchantName);
    }
    // const decode = BakongKHQR.decode(khqrString);

    res.status(200).json({
      status: "pending",
      khqrString: khqrString,
      md5Hash: md5Hash,
      // decode: decode,
      qrStand: qrStand,
    });
  } catch (error) {
    console.error("Payment Initiation Error:", error);
    next(error);
  }
};

// Checking payment status by MD5 hash in every 3s(3000ms) for pending transactions
exports.checkPaymentStatusMD5 = async (req, res, next) => {
  const { md5Hash } = req.params;

  try {
    // --- 1. CHECK STATUS WITH BAKONG ---
    const verificationResult =
      await bakongApiService.checkTransactionByMD5(md5Hash);

    if (verificationResult.status.toUpperCase() === "COMPLETED") {
      return res.status(200).json({
        status: verificationResult.status,
        detail: verificationResult.details,
        message: verificationResult.message,
      });
    } else if (verificationResult.status.toUpperCase() === "FAILED") {
      return res.status(400).json({
        status: verificationResult.status,
        detail: verificationResult.details,
        message: verificationResult.message,
      });
    }
    return res.status(202).json({
      status: verificationResult.status,
      detail: verificationResult.details,
      message: verificationResult.message,
    });
  } catch (error) {
    console.error("Verification Status Check Error:", error);
    next(error);
  }
};
