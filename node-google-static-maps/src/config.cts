import * as dotenv from 'dotenv';

dotenv.config();

export const KEY = process.env.GOOGLE_STATIC_MAPS_API_KEY;
export const SECRET = process.env.GOOGLE_STATIC_MAPS_API_SECRET;
