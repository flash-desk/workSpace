import { generateAccessToken } from "../../utils/generateJWT.js";
import RefreshToken from "./models/refreshToken.model.js";
import { sha256, generateOpaqueToken } from "../../utils/hash.js";

const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const issueAuthTokens = async (user, meta = {}) => {
  const accessToken = generateAccessToken({
    email: user.email,
    id: user._id,
    role: user.role,
  }); // access is regenerated 

  const rawRefreshToken = generateOpaqueToken();
  const family = generateOpaqueToken(16);

  await RefreshToken.create({
    user: user._id,
    tokenHash: sha256(rawRefreshToken),
    family,
    userAgent: meta.userAgent || null,
    ip: meta.ip || null,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  }); // store session data 

  return { accessToken, refreshToken: rawRefreshToken };
};

export const rotateRefreshToken = async (tokenDoc) => {
  const rawRefreshToken = generateOpaqueToken();
  const newTokenHash = sha256(rawRefreshToken);

  await RefreshToken.create({
    user: tokenDoc.user,
    tokenHash: newTokenHash,
    family: tokenDoc.family,
    userAgent: tokenDoc.userAgent,
    ip: tokenDoc.ip,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  });

  tokenDoc.revokedAt = new Date();
  tokenDoc.replacedByTokenHash = newTokenHash;
  await tokenDoc.save();

  return rawRefreshToken;
}; // new refresh token


export const revokeTokenFamily = async (family) => {
  await RefreshToken.updateMany(
    { family, revokedAt: null },
    { revokedAt: new Date() },
  );
};


export const revokeAllUserTokens = async (userId) => {
  await RefreshToken.updateMany(
    { user: userId, revokedAt: null },
    { revokedAt: new Date() },
  );
};
