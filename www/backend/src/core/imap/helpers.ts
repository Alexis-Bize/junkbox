import config from './config';
import { getInstance } from '.';
import { parseHeader } from 'imap';
import { rand, createSignedHash } from '../../modules/crypto';

//#region public methods

export type Headers = {
	date: string;
	subject: string;
	from: string;
};

export type Metadata = {
	id: number;
	hash: string;
	headers: Headers;
};

//#endregion
//#region public methods

export const createBox = () => {
	const { min, max } = config.boxLengths;
	const chars = 'abcdefghijklmnopqrstuvwxyz123567890';
	const length = Math.floor(Math.random() * (max - min + 1)) + min;
	return rand(length, chars);
};

export const isBoxValid = (target: string = '') => {
	const { min, max } = config.boxLengths;
	const regexp = new RegExp(`^([a-z0-9]+){${min},${max}}$`, 'g');
	return target.length !== 0 && regexp.test(target);
};

export const pullIdsForBox = (target: string = ''): Promise<number[]> =>
	new Promise((resolve, reject) => {
		if (target.length === 0) {
			return reject(new Error('Specified "target" is invalid.'));
		}

		getInstance().search(
			['ALL', ['TO', `${target.toString().trim()}@${config.domain}`]],
			(err, ids) => {
				if (err) return reject(err);
				else return resolve(ids);
			}
		);
	});

export const fetchMetadataForIds = (ids: number[]): Promise<Metadata[]> =>
	new Promise((resolve, reject) => {
		const metadata: Metadata[] = [];
		const fetch = getInstance().fetch(ids, {
			bodies: 'HEADER.FIELDS (FROM SUBJECT DATE)'
		});

		fetch.on('message', (message, seqno) => {
			const headers: Headers = {
				date: new Date().toISOString(),
				subject: 'N/A',
				from: ''
			};

			message.on('body', stream => {
				const buffer: string[] = [];

				stream.on('data', chunk => {
					buffer.push(chunk.toString('utf-8'));
				});

				stream.once('end', () => {
					const parse = parseHeader(buffer.join(''));
					headers.date = new Date(
						parse.date[0] || headers.date
					).toISOString();
					headers.subject = parse.subject[0] || headers.subject;
					headers.from = parse.from[0] || '';
				});
			});

			message.once('end', () => {
				if (headers.from.length !== 0) {
					const hash = createSignedHash(seqno);
					metadata.push({ id: seqno, hash, headers });
				}
			});
		});

		fetch.once('error', reject);
		fetch.once('end', () => resolve(metadata.reverse()));
	});

export const fetchBody = (id: string): Promise<string> =>
	new Promise((resolve, reject) => {
		const details: string[] = [];
		const fetch = getInstance().fetch(id, {
			bodies: 'TEXT',
			markSeen: true
		});

		fetch.on('message', message => {
			let bodyText = '';

			message.on('body', stream => {
				const buffer: string[] = [];

				stream.on('data', chunk => {
					buffer.push(chunk.toString('utf-8'));
				});

				stream.once('end', () => {
					bodyText = buffer.join('');
				});
			});

			message.once('end', () => {
				details.push(bodyText);
			});
		});

		fetch.once('error', reject);
		fetch.once('end', () => resolve(details.join('')));
	});

//#endregion
