import BN from 'bn.js';

export const serializePda = (pda: any) => {
  return serializeBN(pda);
};

const serializeBN = (obj: any): any => {
  if (obj instanceof BN) {
    return obj.toString();
  } else if (Array.isArray(obj)) {
    return obj.map(serializeBN);
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, serializeBN(value)]),
    );
  }
  return obj;
};
