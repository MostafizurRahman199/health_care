import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AuthService } from './auth.service';
import config from '../../../config';

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginWithCredentials(req.body);
  const { refreshToken, accessToken, needPasswordChange, user } = result;

  // Set the refresh token inside a secure, HttpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    secure: config.env === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: config.jwt.refresh_cookie_max_age, 
  });

  // Set the access token inside a secure, HttpOnly cookie
  res.cookie('accessToken', accessToken, {
    secure: config.env === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: config.jwt.access_cookie_max_age, 
  });

  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    data: {
      user,
      needPasswordChange,
    },
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await AuthService.getMyProfile(user as any);

  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.forgotPassword(req.body);

  res.status(200).json({
    success: true,
    message: 'Password reset link sent to your email',
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || '';
  await AuthService.resetPassword(token, req.body);

  res.status(200).json({
    success: true,
    message: 'Password reset successfully',
    data: null,
  });
});

export const AuthController = {
  login,
  getMyProfile,
  forgotPassword,
  resetPassword,
};