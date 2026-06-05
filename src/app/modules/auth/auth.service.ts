import prisma from '../../../shared/prisma';
import { bcryptHelper } from '../../../helpers/bcrypt';
import { jwtHelper } from '../../../helpers/jwt';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';

import { emailHelper } from '../../../helpers/emailSender';

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

const getMyProfile = async (user: any) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      needPasswordChange: true,
    },
  });

  if (!userInfo) {
    throw ApiError.notFound('User does not exist');
  }

  return userInfo;
};

const forgotPassword = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: 'ACTIVE',
    },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const resetToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.jwt.reset_pass_secret as string,
    config.jwt.reset_pass_expires_in as string
  );

  const resetLink = `${config.frontend_url}/reset-password?userId=${user.id}&token=${resetToken}`;

  await emailHelper.sendEmail(
    user.email,
    'Reset your password',
    `
      <div>
        <h1>Password Reset</h1>
        <p>Click the link below to reset your password. The link is valid for 10 minutes.</p>
        <a href="${resetLink}">Reset Password</a>
      </div>
    `
  );
};

const resetPassword = async (token: string, payload: any) => {
  let decodedData;
  try {
    decodedData = jwtHelper.verifyToken(token, config.jwt.reset_pass_secret as string);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired token');
  }

  const user = await prisma.user.findUnique({
    where: {
      email: (decodedData as any).email,
    },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  if (payload.newPassword !== payload.confirmPassword) {
      throw ApiError.badRequest("Passwords do not match");
  }

  const hashedPassword = await bcryptHelper.hashPassword(payload.newPassword);

  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
};

export const AuthService = {
  loginWithCredentials,
  getMyProfile,
  forgotPassword,
  resetPassword,
};