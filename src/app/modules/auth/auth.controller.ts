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

export const AuthController = {
  login,
};