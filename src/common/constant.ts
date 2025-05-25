import { PublicKey } from '@solana/web3.js';

export const TypeColumn = [
  'varbinary',
  'varchar',
  'bigint',
  'integer',
  'double precision',
  'boolean',
  'timestamp',
  'date',
  'bigint',
];

export const TIME_WAIT_RESEND_TX = 2_000;
export const DELAY_RETRY_TX = 0;
export const DEFAULT_RETRIES = 3;
export const TIME_WAIT_RETRY_PARSE_TX = 1000;
export const DEFAULT_MICRO_LAMPORTS = 50000;
export const DEFAULT_COMPUTE_UNIT_LIMIT = 1000000;
export const DEFAULT_TIMEOUT_SEND_TX = 90_000;
export const MAX_COMPUTE_UNIT = 1_400_000;
export const PRIORITY_FEE_MICRO_LAMPORT = 100_000;
export const DEFAULT_TX_HASHES = [
  '1111111111111111111111111111111111111111111111111111111111111111',
];
export const DEFAULT_PUBLICK_KEY = new PublicKey(
  '11111111111111111111111111111111',
);
