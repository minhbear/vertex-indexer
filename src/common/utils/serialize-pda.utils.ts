import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export const serializePda = (pda: any) => {
  let serializedPda = serializeBN(pda);
  serializedPda = serializePubkey(serializedPda);

  return serializedPda;
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

const serializePubkey = (obj: any): any => {
  if (obj instanceof PublicKey) {
    return obj.toBase58();
  } else if (Array.isArray(obj)) {
    return obj.map(serializePubkey);
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, serializePubkey(value)]),
    );
  }
  return obj;
};
