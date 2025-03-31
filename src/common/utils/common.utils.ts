import { v4 as uuidv4 } from 'uuid';

export const generateNumberUUIDNonce = () => {
  const uuid = uuidv4().replace(/-/g, '');
  return BigInt(`0x${uuid}`).toString().slice(0, 10).padStart(10, '0');
};

export const createSlug = (str: string): string => {
  return str.replace(/\s+/g, '').toLowerCase();
};
