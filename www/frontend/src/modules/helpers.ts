import { getCookie } from './cookies';
import { Mailbox, MailboxResponse } from '../types';

export const getWelcomeMailItem = (mailbox: MailboxResponse) => ({
	uid: 0,
	box: mailbox.box,
	hash: '',
	body: '', // Component
	header: {
		date: getBoxCreationDate(),
		subject: 'Welcome to Junkbox!',
		from: computeDefaultSender(mailbox)
	}
});

export const getSenderInitials = (sender: string) => {
	const match = sender.split('<')[0].match(/[a-zA-Z0-9]+/g) || [];
	const slice = match.slice(0, 2);
	const extract = [(slice[0] || '').charAt(0), (slice[1] || '').charAt(0)];
	return extract.join('').toUpperCase();
};

export const computeDefaultSender = (mailbox: Mailbox) =>
	mailbox !== null
		? `Junkbox <${concatBoxDomain(mailbox.box, mailbox.domain)}>`
		: `Junkbox`;

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

export const formatMessageDate = (date: Date | string) => {
	date = date instanceof Date ? date : new Date(date);
	return [date.toDateString(), date.toLocaleTimeString()].join(' - ');
};

export const concatBoxDomain = (box: string, domain: string) =>
	[box, domain].join('@');
