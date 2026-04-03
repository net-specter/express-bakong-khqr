const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.BAKONG_BASE_URL;

let currentToken = process.env.BAKONG_ACCESS_TOKEN;
let registeredEmail = process.env.BAKONG_EMAIL;
let tokenExpiry = new Date(process.env.BAKONG_TOKEN_EXPIRY || 0);

/**
 * Calls the /v1/renew_token API to refresh the access token.
 */
const renewToken = async () => {
  try {
    if (!registeredEmail) {
      throw new Error("BAKONG_EMAIL is missing in .env. Cannot renew token.");
    }

    const response = await axios.post(`${BASE_URL}/v1/renew_token`, {
      email: registeredEmail,
    });

    if (response.data.responseCode !== 0) {
      throw new Error(`Bakong Renew Failed: ${response.data.responseMessage}`);
    }

    const newToken = response.data.token;

    currentToken = newToken;
    tokenExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

    console.log("✅ Bakong Token Renewed Successfully.");
    return currentToken;
  } catch (error) {
    console.error(
      "Bakong Token Renewal Failed:",
      error.response ? error.response.data : error.message,
    );
    throw new Error("Critical: Failed to renew Bakong access token.");
  }
};

const getAccessToken = async () => {
  const gracePeriod = 24 * 60 * 60 * 1000;

  if (!currentToken || tokenExpiry < new Date(Date.now() + gracePeriod)) {
    console.log("Bakong token near expiry/missing. Attempting renewal...");
    return await renewToken();
  }
  return currentToken;
};

module.exports = { getAccessToken };
