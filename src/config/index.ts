import dotenv from 'dotenv';

dotenv.config();

export const config = {
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET || '',
  PORT: process.env.PORT || 3100,
};
