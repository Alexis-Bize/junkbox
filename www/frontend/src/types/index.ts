export type MailboxResponse = {
	box: string;
	domain: string;
	hash: string;
};

export type MessageResponse = {
	uid: number;
	box: string;
	hash: string;
	body: string;
	header: {
		date: string;
		subject: string;
		from: string;
	};
};

export type MessagesListResponse = Array<MessageResponse>;

export type Mailbox = null | MailboxResponse;
export type Message = null | MessageResponse | 'welcome-mail';
export type MessagesList = null | MessagesListResponse;
export type WelcomeMailItem = Omit<Required<MessageResponse>, 'body'>;
