import { stringify } from 'querystring';
import { getCookie } from './cookies';

import {
	MailboxResponse,
	MessageResponse,
	Mailbox,
	MessagesListResponse
} from '../types';

//#region typings

export type DeleteMessage = Pick<MessageResponse, 'uid' | 'box' | 'hash'>;
export type BatchDeletePayload = Array<DeleteMessage>;

//#endregion
//#region fetch methods

export const requestMailbox = async (): Promise<MailboxResponse> => {
	const result = await fetch('/api/mailbox');
	return result.json();
};

export const pullMessages = async (
	mailbox: MailboxResponse
): Promise<MessagesListResponse> => {
	const qs = stringify({ box: mailbox.box, hash: mailbox.hash });
	const result = await fetch(`/api/mailbox/pull?${qs}`);
	const json = await result.json();
	return json.items;
};

export const batchDeleteMessages = async (
	messages: BatchDeletePayload
): Promise<void> => {
	const items = messages.filter(m => m.uid !== null);

	if (items.length === 0) {
		return;
	}

	await fetch('/api/mailbox/batch/delete', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ items })
	});
};

//#endregion
//#region helpers

export const getSenderInitials = (sender: string) => {
	const match = sender.split('<')[0].match(/[a-zA-Z0-9]+/g) || [];
	const slice = match.slice(0, 2);
	const extract = [(slice[0] || '').charAt(0), (slice[1] || '').charAt(0)];
	return extract.join('').toUpperCase();
};

export const getBoxCreationDate = (format = true) => {
	const cookieDate = String(getCookie('box_created_at') || '');
	const isDateValid = isNaN(Date.parse(cookieDate)) === false;
	const creationDate = new Date(
		isDateValid === false ? Date.now() : cookieDate
	);

	if (format === false) {
		return new Date(creationDate).toISOString();
	} else return formatMessageDate(creationDate);
};

export const getWelcomeMailResponse = (
	mailbox: MailboxResponse
): MessageResponse => ({
	uid: null,
	box: mailbox.box,
	hash: null,
	body: null,
	header: {
		date: getBoxCreationDate(),
		subject: 'Welcome to Junkbox!',
		from: computeDefaultSender(mailbox)
	}
});

export const computeDefaultSender = (mailbox: Mailbox) =>
	mailbox !== null
		? `Junkbox <${concatBoxDomain(mailbox.box, mailbox.domain)}>`
		: `Junkbox`;

export const formatMessageDate = (date: Date | string) => {
	date = date instanceof Date ? date : new Date(date);
	return [date.toDateString(), date.toLocaleTimeString()].join(' - ');
};

export const concatBoxDomain = (box: string, domain: string) =>
	[box, domain].join('@');

//#endregion
