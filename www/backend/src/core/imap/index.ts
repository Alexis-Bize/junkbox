import config from './config';
import * as mailparser from 'mailparser';
import { getInstance } from './initializer';
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
	header: Header;
	body: string;
};

export type Message = {
	uid: number;
	hash: string;
	content: string;
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

const _parseMessages = async (messages: Message[], box: string) => {
	const parsed: FetchResponse[] = [];

	await Promise.all(
		messages.map(message => mailparser.simpleParser(message.content))
	).then(contents => {
		contents.forEach((content, index) => {
			parsed.push({
				uid: messages[index].uid,
				hash: messages[index].hash,
				box,
				header: {
					date: content.date
						? content.date.toISOString()
						: new Date().toISOString(),
					subject: content.subject,
					from: content.from.text
				},
				body:
					typeof content.html === 'string'
						? content.html
						: content.text
			});
		});
	});

	return parsed;
};

//#endregion
//#region public methods

export const pullUidsForBox = (box: string) =>
	_searchInBoxByFlag(box, 'UNDELETED');

export const fetchForUids = (
	ids: number[],
	box: string,
	options: { markSeen?: boolean }
): Promise<FetchResponse[]> =>
	new Promise((resolve, reject) => {
		const messages: Message[] = [];
		const fetch = getInstance().seq.fetch(ids, {
			markSeen: !!options.markSeen,
			bodies: '',
			struct: true
		});

		fetch.on('message', message => {
			let messageUniqueId = 0;
			const parts: string[] = [];

			message.on('body', stream => {
				stream.on('data', chunk => {
					parts.push(chunk.toString('utf-8'));
				});
			});

			message.once('attributes', attrs => {
				const { uid } = attrs;
				messageUniqueId = uid;
			});

			message.once('end', () => {
				messages.push({
					uid: messageUniqueId,
					hash: createSignedHash(joinIdBox(messageUniqueId, box)),
					content: parts.join('')
				});
			});
		});

		fetch.once('error', reject);
		fetch.once('end', () => {
			return _parseMessages(messages, box).then(parsed =>
				resolve(parsed.reverse())
			);
		});
	});

export const deleteByUids = (uids: number[]) =>
	new Promise((resolve, reject) => {
		getInstance().move(uids, config.mapping.trash, moveError => {
			if (moveError) return reject(moveError);
			return resolve();
		});
	});

//#endregion
