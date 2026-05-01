import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    secret: process.env.JWT_SECRET || 'secret123',
    expires_in: process.env.JWT_EXPIRES_IN || '1h',
    refresh_secret: process.env.JWT_REFRESH_SECRET || 'refresh123',
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '365d',
    refresh_cookie_max_age: parseInt(process.env.JWT_REFRESH_COOKIE_MAX_AGE || '31536000000', 10),
    access_cookie_max_age: parseInt(process.env.JWT_ACCESS_COOKIE_MAX_AGE || '3600000', 10),
  },
};
