import * as React from 'react';
import { Message, Mailbox } from '../../types';
import NoMessageSelected from './NoMessageSelected';
import WelcomeMessage from './WelcomeMessage';
import { DeleteMessage } from '../../modules/mailbox';
import ReadMessage from './ReadMessage';

//#region typings

type Props = {
	onDelete: (props: DeleteMessage) => void;
	mailbox: Mailbox;
	message: Message;
};

//#endregion
//#region component

const MessageView = (props: Props) => {
	const { mailbox, message, onDelete } = props;

	if (message === null || mailbox === null) {
		return <NoMessageSelected />;
	}

	const onDeleteAction = () =>
		onDelete({
			uid: message.uid,
			box: message.box,
			hash: message.hash
		});

	if (message.uid === null) {
		return <WelcomeMessage mailbox={mailbox} onDelete={onDeleteAction} />;
	} else return <ReadMessage message={message} onDelete={onDeleteAction} />;
};

export default MessageView;

//#endregion
