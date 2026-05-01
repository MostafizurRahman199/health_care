import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const generateToken = (
  payload: any,
  secret: Secret,
  expiresIn: string
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret);
};

const createTokenPair = (
  payload: any,
  accessSecret: string,
  accessExpiresIn: string,
  refreshSecret: string,
  refreshExpiresIn: string
) => {
  const accessToken = generateToken(payload, accessSecret, accessExpiresIn);
  const refreshToken = generateToken(payload, refreshSecret, refreshExpiresIn);

  return { accessToken, refreshToken };
};

export const jwtHelper = {
  generateToken,
  verifyToken,
  createTokenPair,
};