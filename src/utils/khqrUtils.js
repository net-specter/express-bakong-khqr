const QRCode = require("qrcode");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

/**
 * 1. Generates the raw KHQR payload string using the KHQR SDK.
 * @param {string} transactionRef - Our unique internal ID (used as BillNumber).
 * @param {number} amount - The transaction amount.
 * @returns {{khqrString: string, md5Hash: string}} The payload string and its MD5 hash.
 */
function generateKhqrPayload(transactionRef, data) {
  // Import khqrData to access currency enums
  const { BakongKHQR, khqrData, MerchantInfo } = require("bakong-khqr");
  const KHQR_GENERATOR = new BakongKHQR();

  // Map currency codes to KHQR currency enums
  const currencyMap = {
    USD: khqrData.currency.usd,
    KHR: khqrData.currency.khr,
  };

  const selectedCurrency =
    currencyMap[data.currency?.toUpperCase()] || khqrData.currency.khr;

  // 2. SET UP MERCHANT & INDIVIDUAL INFO
  const merchantInfo = {
    merchantID: transactionRef,
    bakongAccountID: data.bakongAccountID,
    merchantName: data.merchantName,
    acquiringBank: data.acquiringBank,
    merchantCity: data.merchantCity,
    currency: selectedCurrency,
    amount: data.price,
    mobileNumber: data.mobileNumber,
    storeLabel: data.storeLabel,
    terminalLabel: data.plan_name,
    expirationTimestamp: data.expirationTimestamp,
  };

  // 3. GENERATE THE KHQR
  const khqrResponse = KHQR_GENERATOR.generateMerchant(merchantInfo);

  if (khqrResponse.status.code !== 0) {
    throw new Error(`KHQR SDK Error: ${khqrResponse.status.message}`);
  }

  return {
    khqrString: khqrResponse.data.qr,
    md5Hash: khqrResponse.data.md5,
  };
}

async function createQrCodeImage(string) {
  const qrBase64 = await QRCode.toDataURL(string);
  return qrBase64;
}

/**
 * Creates a QR stand image by overlaying QR and text onto a base template.
 * @param {string} bufferImage - Base64 Data URL of the QR code image.
 * @param {string} holder_name - The text to be displayed below the QR (e.g., Organizer Name).
 * @returns {Promise<string>} Base64 Data URL of the final composite image.
 */

async function createQRStand(bufferImage, holder_name) {
  const baseImagePath = "./public/images/Bakong_Stand.png";
  const baseImageBuffer = fs.readFileSync(baseImagePath);

  // 1. Prepare Base64 QR Image Buffer
  const cleanBase64 = bufferImage.replace(/^data:image\/\w+;base64,/, "");
  const overlayBuffer = Buffer.from(cleanBase64, "base64");

  // 2. Resize QR image to EXACT px (no decimals)
  const resizedOverlay = await sharp(overlayBuffer)
    .resize({
      width: 564,
      height: 564,
      fit: "cover",
    })
    .png()
    .toBuffer();

  // 3. Create SVG Text (center aligned)
  const textSvg = `
    <svg width="1274" height="120">
      <style>
        .title {
          font-family: Arial, sans-serif;
          font-size: 80px;
          font-weight: bold;
          fill: black;
        }
      </style>
      <text x="50%" y="50%" text-anchor="middle" alignment-baseline="middle" class="title">
        ${holder_name}
      </text>
    </svg>
  `;

  const textBuffer = Buffer.from(textSvg);
  const finalImage = await sharp(baseImageBuffer)
    .composite([
      {
        input: resizedOverlay,
        left: Math.round(460.2),
        top: Math.round(662.6),
      },
      {
        input: textBuffer,
        left: Math.round(98.3),
        top: Math.round(1369.2),
      },
    ])
    .png()
    .toBuffer();

  return `data:image/png;base64,${finalImage.toString("base64")}`;
}

module.exports = {
  generateKhqrPayload,
  createQrCodeImage,
  createQRStand,
};
