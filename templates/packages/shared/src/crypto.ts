import { sha256 } from "@noble/hashes/sha2.js";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const bytesToBase64Url = (bytes: Uint8Array): string => {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const base64UrlToBytes = (input: string): Uint8Array => {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
};

export const randomString = (length: number): string => {
  const byteLength = Math.ceil((length * 3) / 4);
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes).slice(0, length);
};

export const base64Encode = (input: string): string => {
  return bytesToBase64Url(textEncoder.encode(input));
};

export const base64Decode = (input: string): string => {
  return textDecoder.decode(base64UrlToBytes(input));
};

export const base64EncodeBytes = (input: Uint8Array): string => {
  return bytesToBase64Url(input);
};

export const createHash = (input: string): Uint8Array => {
  return sha256(textEncoder.encode(input));
};
