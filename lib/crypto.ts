import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const algorithm = 'aes-256-gcm';

function getKey() {
  const value = process.env.SECRETS_ENCRYPTION_KEY;
  if (!value) {
    throw new Error('SECRETS_ENCRYPTION_KEY nao configurada');
  }

  const key = Buffer.from(value, 'base64');
  if (key.length !== 32) {
    throw new Error('SECRETS_ENCRYPTION_KEY deve ter 32 bytes em base64');
  }

  return key;
}

export function encryptSecret(value?: string | null) {
  if (!value) return null;

  const iv = randomBytes(12);
  const cipher = createCipheriv(algorithm, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [iv.toString('base64'), tag.toString('base64'), encrypted.toString('base64')].join('.');
}

export function decryptSecret(value?: string | null) {
  if (!value) return undefined;

  const [ivRaw, tagRaw, encryptedRaw] = value.split('.');
  const decipher = createDecipheriv(algorithm, getKey(), Buffer.from(ivRaw, 'base64'));
  decipher.setAuthTag(Buffer.from(tagRaw, 'base64'));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedRaw, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}

export function maskSecret(value?: string | null) {
  return value ? '********' : '';
}
