export type MailboxResponse = {
	box: string;
	domain: string;
	hash: string;
};

export type MessageResponse = {
	uid: number | null;
	box: string;
	hash: string | null;
	body: string | null;
	header: {
		date: string;
		subject: string;
		from: string;
	};
};

export type MessagesListResponse = Array<MessageResponse>;

export type Mailbox = null | MailboxResponse;
export type Message = null | MessageResponse;
export type MessagesList = null | MessagesListResponse;
export type WelcomeMailItem = Omit<Required<MessageResponse>, 'body'>;
export type LayoutType = 'plain' | 'overlay';
