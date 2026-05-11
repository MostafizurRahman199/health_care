import prisma from '../../../shared/prisma';
import { bcryptHelper } from '../../../helpers/bcrypt';
import { jwtHelper } from '../../../helpers/jwt';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';

const loginWithCredentials = async (payload: any) => {
  const { email, password } = payload;

  // Check if the user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw ApiError.notFound('User does not exist');
  }

  // Check if user is active
  if (user.status !== 'ACTIVE') {
    throw ApiError.forbidden('User is not active');
  }

  // Check if password matches
  const isPasswordMatched = await bcryptHelper.comparePassword(
    password,
    user.password
  );

  if (!isPasswordMatched) {
    throw ApiError.unauthorized('Incorrect password');
  }

  // Generate tokens
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const { accessToken, refreshToken } = jwtHelper.createTokenPair(
    jwtPayload,
    config.jwt.secret as string,
    config.jwt.expires_in as string,
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expires_in as string
  );

  // Remove password from user object before returning
  const { password: _, ...userWithoutPassword } = user;

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
    user: userWithoutPassword,
  };
};

export const AuthService = {
  loginWithCredentials,
};