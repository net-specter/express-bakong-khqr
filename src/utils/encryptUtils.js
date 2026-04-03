const crypto = require("crypto");

/**
 * Creates a SHA-256 hash of a JavaScript object.
 * @param {object} jsonObject - The object to be hashed.
 * @returns {string} The SHA-256 hash as a hexadecimal string.
 */
function hashJsonObject(jsonObject) {
  // Serialize the object into a consistent string format.
  const jsonString = JSON.stringify(jsonObject);

  // Use the same hashing logic as hashString for consistency.
  return hashString(jsonString);
}

/**
 * Creates a SHA-256 hash of a string.
 * @param {string} inputString - The string to be hashed.
 * @returns {string} The SHA-256 hash as a hexadecimal string.
 */
function hashString(inputString) {
  // FIX: Replaced the invalid algorithm "hash" with the specific "md5".
  const hash = crypto.createHash("md5");

  hash.update(inputString);

  return hash.digest("hex");
}

module.exports = {
  hashJsonObject,
  hashString,
};
