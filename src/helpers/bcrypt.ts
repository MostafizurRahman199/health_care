import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
};

const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

export const bcryptHelper = {
  hashPassword,
  comparePassword,
};
