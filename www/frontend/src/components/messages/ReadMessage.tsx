import * as React from 'react';
import MessageHeader from './MessageHeader';
import MessageBody from './MessageBody';
import { MessageResponse } from '../../types';
import { formatMessageDate } from '../../modules/mailbox';
import { Layout } from 'antd';

//#region typings

export type Props = {
	onDelete: () => void;
	message: MessageResponse;
};

//#endregion
//#region component

const ReadMessage = (props: Props) => {
	const { message, onDelete } = props;

	return (
		<Layout.Content>
			<MessageHeader
				header={{
					subject: message.header.subject,
					from: message.header.from,
					date: formatMessageDate(message.header.date)
				}}
				onDelete={onDelete}
			/>
			<MessageBody body={message.body || ''} />
		</Layout.Content>
	);
};

export default ReadMessage;

//#endregion
