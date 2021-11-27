import bcrypt from 'bcrypt';
import { User } from './index';

const insertAdmin = async () => {
  const adminPassword = process.env.ADMIN_PASSWORD as string;
  try {
    const salt = process.env.SALT as string;
    const hashedPassword = await bcrypt.hash(adminPassword, +salt);
    await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    });
  } catch (err) {
    return console.error(`Admin user exists with username: admin, password: ${adminPassword}`);
  }
  return console.log(`Admin user created with username: admin, password: ${adminPassword}`);
};

export default insertAdmin;
