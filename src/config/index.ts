import dotenv from 'dotenv';

dotenv.config();

export const config = {
  GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET || '',
  PORT: process.env.PORT || 3100,
};
