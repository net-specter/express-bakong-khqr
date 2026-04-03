const axios = require("axios");
const { getAccessToken } = require("./bakongAuthService");
require("dotenv").config();
const BASE_URL = process.env.BAKONG_BASE_URL;

// --- Helper function for making authorized API calls ---
const bakongApiCall = async (endpoint, data) => {
  const token = await getAccessToken();
  const url = `${BASE_URL}/v1/${endpoint}`;

  const response = await axios.post(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// =======================================================
// CHECK STATUS BY MD5 HASH
// =======================================================
exports.checkTransactionByMD5 = async (md5Hash) => {
  try {
    const responseData = await bakongApiCall("check_transaction_by_md5", {
      md5: md5Hash,
    });

    // Response Code 0: Success. Transaction completed.
    if (responseData.responseCode === 0) {
      return { status: "COMPLETED", details: responseData.data };
    }

    // Error Code 1: Transaction could not be found (PENDING)
    if (responseData.errorCode === 1) {
      return { status: "PENDING" };
    }

    // Error Code 3: Transaction failed.
    if (responseData.errorCode === 3) {
      return { status: "FAILED", message: responseData.responseMessage };
    }

    // Catch any other unexpected Bakong error codes
    return { status: "UNKNOWN_ERROR", message: responseData.responseMessage };
  } catch (error) {
    throw new Error(`Payment verification failed: ${error.message}`);
  }
};

// =======================================================
// 2. CHECK STATUS BY BATCH OF MD5 HASHES
// =======================================================
exports.checkBatchTransactionByMD5 = async (md5Hashes) => {
  try {
    const responseData = await bakongApiCall("check_transaction_by_md5_list", {
      md5: md5Hashes,
    });

    // Response Code 0: Success. Transaction completed.
    if (responseData.responseCode === 0) {
      return { status: "COMPLETED", details: responseData.data };
    }
    // Error Code 1: Transaction could not be found (PENDING)
    if (responseData.errorCode === 1) {
      return { status: "PENDING" };
    }
    // Error Code 3: Transaction failed.
    if (responseData.errorCode === 3) {
      return { status: "FAILED", message: responseData.responseMessage };
    }
    // Catch any other unexpected Bakong error codes
    return { status: "UNKNOWN_ERROR", message: responseData.responseMessage };
  } catch (error) {
    throw new Error(`Payment verification failed: ${error.message}`);
  }
};
