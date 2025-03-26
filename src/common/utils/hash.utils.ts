import * as crypto from 'crypto';

export function generateIdlHash(programId: string, version: string): string {
  const data = `${programId}-${version}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}
