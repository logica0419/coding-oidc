import { sha256 } from "@noble/hashes/sha2.js";

const textEncoder = new TextEncoder();

const bytesToBase64Url = (bytes: Uint8Array): string => {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export const randomString = (length: number): string => {
  const byteLength = Math.ceil((length * 3) / 4);
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);

  return bytesToBase64Url(bytes).slice(0, length);
};

const base64EncodeBytes = (input: Uint8Array): string => {
  return bytesToBase64Url(input);
};

const createHash = (input: string): Uint8Array => {
  return sha256(textEncoder.encode(input));
};

export const createBase64EncodedHash = (input: string): string => {
  return base64EncodeBytes(createHash(input));
};
