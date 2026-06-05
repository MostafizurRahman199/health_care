import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
 database_url: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET || 'secret123',
    expires_in: process.env.JWT_EXPIRES_IN || '1h',
    refresh_secret: process.env.JWT_REFRESH_SECRET || 'refresh123',
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '365d',
    refresh_cookie_max_age: parseInt(process.env.JWT_REFRESH_COOKIE_MAX_AGE || '31536000000', 10),
    access_cookie_max_age: parseInt(process.env.JWT_ACCESS_COOKIE_MAX_AGE || '3600000', 10),
    reset_pass_secret: process.env.JWT_RESET_PASS_SECRET || 'resetpasssecret123',
    reset_pass_expires_in: process.env.JWT_RESET_PASS_EXPIRES_IN || '10m',
  },
  open_router_key: process.env.open_router_key,
  emailSender: {
    email: process.env.EMAIL_SENDER,
    app_pass: process.env.EMAIL_APP_PASSWORD,
  },
  frontend_url: process.env.FRONTEND_URL || 'http://localhost:3000',
};
