/**
 * Foydalanuvchi kiritgan parolni Web Crypto API yordamida
 * SHA-256 kichik harfli hex satrga aylantiradi.
 * @param {string} password
 * @returns {Promise<string>}
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
