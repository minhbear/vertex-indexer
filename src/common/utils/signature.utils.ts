import bs58 from 'bs58';
import nacl from 'tweetnacl';

export const verifyMessageSignature = (input: {
  message: string;
  signature: string;
  walletAddress: string;
}): boolean => {
  const { message, signature, walletAddress } = input;

  return nacl.sign.detached.verify(
    new TextEncoder().encode(message),
    bs58.decode(signature),
    bs58.decode(walletAddress),
  );
};
