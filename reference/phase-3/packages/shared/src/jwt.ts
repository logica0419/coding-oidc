import { generateKeyPair, exportJWK, importJWK, SignJWT, jwtVerify } from "jose";

import { ALGORITHM, KEY_ID, ACCESS_TOKEN_TTL_SEC, ID_TOKEN_TTL_SEC } from "./constants";

const OP_ISSUER = "http://localhost:3301";
const CLIENT_ID = "rp-demo";

interface CachedKeys {
  privateKey: CryptoKey;
  publicKey: CryptoKey;
  publicJwk: Record<string, unknown>;
}

let cached: CachedKeys | undefined;

const getSigningKeys = async (): Promise<CachedKeys> => {
  if (cached === undefined) {
    const { privateKey, publicKey } = await generateKeyPair(ALGORITHM);
    const publicJwk = await exportJWK(publicKey);

    cached = {
      privateKey,
      publicKey,
      publicJwk: { ...publicJwk, kid: KEY_ID, alg: ALGORITHM, use: "sig" },
    };
  }

  return cached;
};

export interface IdTokenClaims {
  sub: string;
  name: string;
}

export interface AccessTokenClaims {
  sub: string;
  scope: string;
}

export interface JwksDocument {
  keys: Record<string, unknown>[];
}

const assertClaim = (payload: Record<string, unknown>, name: string): string => {
  const value = payload[name];

  if (typeof value !== "string") {
    throw new Error("invalid token claims");
  }

  return value;
};

const issuedAt = (): number => {
  return Math.floor(Date.now() / 1000);
};

const resolveVerifyKey = async (
  publicJwk?: Record<string, unknown>,
): Promise<CryptoKey | Uint8Array> => {
  if (publicJwk !== undefined) {
    return importJWK(publicJwk, ALGORITHM);
  }

  const { publicKey } = await getSigningKeys();

  return publicKey;
};

export const createIdToken = async (claims: IdTokenClaims): Promise<string> => {
  const { privateKey } = await getSigningKeys();

  return new SignJWT({ name: claims.name })
    .setProtectedHeader({ alg: ALGORITHM, kid: KEY_ID })
    .setIssuer(OP_ISSUER)
    .setAudience(CLIENT_ID)
    .setSubject(claims.sub)
    .setIssuedAt(issuedAt())
    .setExpirationTime(issuedAt() + ID_TOKEN_TTL_SEC)
    .sign(privateKey);
};

export const verifyIdToken = async (
  token: string,
  publicJwk?: Record<string, unknown>,
): Promise<IdTokenClaims> => {
  const verifyKey = await resolveVerifyKey(publicJwk);
  const { payload } = await jwtVerify(token, verifyKey, {
    issuer: OP_ISSUER,
    audience: CLIENT_ID,
  });

  return {
    sub: assertClaim(payload, "sub"),
    name: assertClaim(payload, "name"),
  };
};

export const createAccessToken = async (claims: AccessTokenClaims): Promise<string> => {
  const { privateKey } = await getSigningKeys();

  return new SignJWT({ scope: claims.scope })
    .setProtectedHeader({ alg: ALGORITHM, kid: KEY_ID })
    .setIssuer(OP_ISSUER)
    .setAudience(OP_ISSUER)
    .setSubject(claims.sub)
    .setIssuedAt(issuedAt())
    .setExpirationTime(issuedAt() + ACCESS_TOKEN_TTL_SEC)
    .sign(privateKey);
};

export const verifyAccessToken = async (
  token: string,
  publicJwk?: Record<string, unknown>,
): Promise<AccessTokenClaims> => {
  const verifyKey = await resolveVerifyKey(publicJwk);
  const { payload } = await jwtVerify(token, verifyKey, {
    issuer: OP_ISSUER,
    audience: OP_ISSUER,
  });

  return { sub: assertClaim(payload, "sub"), scope: assertClaim(payload, "scope") };
};

export const getJWTPublicKey = async (): Promise<JwksDocument> => {
  const { publicJwk } = await getSigningKeys();
  return { keys: [publicJwk] };
};
