import config from './config';
import { getInstance } from './initializer';
import { parseHeader } from 'imap';
import { joinIdBox } from './helpers';
import { createSignedHash } from '../../modules/crypto';

//#region typings

export type Header = {
	date: string;
	subject: string;
	from: string;
};

export type FetchResponse = {
	uid: number;
	box: string;
	hash: string;
	header?: Header;
	body?: string;
};

//#endregion
//#region private methods

const _searchInBoxByFlag = (box: string, flag: string): Promise<number[]> =>
	new Promise((resolve, reject) => {
		getInstance().seq.search(
			[flag, ['TO', [box, config.junkbox.domain].join('@')]],
			(err, uids) => {
				if (err) return reject(err);
				else return resolve(uids);
			}
		);
	});

const _parseRawHeader = (rawHeader: string = '') => {
	if (rawHeader.trim().length === 0) {
		return;
	}

	const outputHeaders: Header = {
		date: new Date().toISOString(),
		subject: 'N/A',
		from: 'unknown'
	};

	const parse = parseHeader(rawHeader);

	outputHeaders.date = new Date(
		parse.date[0] || outputHeaders.date
	).toISOString();
	outputHeaders.subject = parse.subject[0] || outputHeaders.subject;
	outputHeaders.from = parse.from[0] || '';

	return outputHeaders;
};

//#endregion
//#region public methods

export const pullUidsForBox = (box: string) =>
	_searchInBoxByFlag(box, 'UNDELETED');

export const fetchForUids = (
	ids: number[],
	box: string,
	options: { bodies?: string[] | string; markSeen?: boolean }
): Promise<FetchResponse[]> =>
	new Promise((resolve, reject) => {
		const responses: FetchResponse[] = [];
		const fetch = getInstance().seq.fetch(ids, {
			markSeen: !!options.markSeen,
			bodies: options.bodies
		});

		fetch.on('message', message => {
			let messageUniqueId = 0;

			const bodyBuffer: string[] = [];
			const headerBuffer: string[] = [];

			message.on('body', (stream, info) => {
				stream.on('data', chunk => {
					if (info.which === 'TEXT')
						bodyBuffer.push(chunk.toString('utf-8'));
					else headerBuffer.push(chunk.toString('utf-8'));
				});
			});

			message.once('attributes', attrs => {
				const { uid } = attrs;
				messageUniqueId = uid;
			});

			message.once('end', () => {
				const hash = createSignedHash(joinIdBox(messageUniqueId, box));
				const responseBody = bodyBuffer.join('') || void 0;
				const responseHeader = _parseRawHeader(
					headerBuffer.join('') || void 0
				);

				responses.push({
					uid: messageUniqueId,
					box,
					hash,
					header: responseHeader,
					body: responseBody
				});
			});
		});

		fetch.once('error', reject);
		fetch.once('end', () => resolve(responses.reverse()));
	});

export const deleteByUids = (uids: number[]) =>
	new Promise((resolve, reject) => {
		getInstance().move(uids, config.mapping.trash, moveError => {
			if (moveError) return reject(moveError);
			return resolve();
		});
	});

//#endregion
