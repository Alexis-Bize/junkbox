import { randomBytes, createHmac } from 'crypto';

/** @see https://blog.abelotech.com/posts/generate-random-values-nodejs-javascript/ */
export const rand = (length: number, chars?: string): string => {
	if (length <= 0 || isNaN(length)) {
		throw new Error('"length" must be a number greater than 0');
	}

	chars =
		String(chars || '') ||
		'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';

	const random = randomBytes(length);
	const value = new Array(length);
	const d = 256 / Math.min(256, chars.length);

	for (let i = 0; i < length; ++i) {
		value[i] = chars[Math.floor(random[i] / d)];
	}

	return value.join('');
};

export const createSignedHash = (entry: any) =>
	createHmac('sha1', process.env.HASH_KEY || '')
		.update(String(entry || ''))
		.digest('hex');

export const isHashValid = (entry: any = '', hash: string = '') =>
	createSignedHash(entry) === hash;
