import * as React from 'react';
import WelcomeMail from './WelcomeMessage';
import NoMessageSelected from './NoMessageSelected';
import { Message, Mailbox } from '../../types';
import { isWelcomeMailDeleted } from '../../modules/cookies';
import ReadMessage from './ReadMessage';

//#region typings

type Props = {
	onDelete: (uid: number, box: string, hash: string) => void;
	mailbox: Mailbox;
	message: Message;
};

//#endregion
//#region component

const MessageView = (props: Props) => {
	const { mailbox, message, onDelete } = props;

	if (mailbox === null || message === null) {
		return <NoMessageSelected />;
	} else if (message === 'welcome-mail') {
		if (isWelcomeMailDeleted() === false) {
			return (
				<WelcomeMail
					mailbox={mailbox}
					onDelete={() => onDelete(0, mailbox.box, '')}
				/>
			);
		} else return <NoMessageSelected />;
	}

	return (
		<ReadMessage
			message={message}
			onDelete={() => onDelete(message.uid, message.box, message.hash)}
		/>
	);
};

export default MessageView;

//#endregion
