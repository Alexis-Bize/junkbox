import * as React from 'react';
import { Layout, PageHeader, Descriptions } from 'antd';
import { MessageResponse } from '../../types';
import { formatMessageDate } from '../../modules/helpers';
import DeleteAction from './DeleteAction';

//#region typings

export type Props = {
	onDelete: () => void;
	message: MessageResponse;
};

//#endregion
//#region component

const ReadMessage = (props: Props) => {
	const { message, onDelete } = props;

	const header = (
		<Layout.Content
			style={{
				backgroundColor: 'white',
				marginBottom: '8px'
			}}>
			<PageHeader
				title={message.header.subject}
				extra={<DeleteAction onDelete={onDelete} />}>
				<Descriptions size="small" column={1}>
					<Descriptions.Item label="From">
						{message.header.from}
					</Descriptions.Item>
					<Descriptions.Item label="Date">
						{formatMessageDate(message.header.date)}
					</Descriptions.Item>
				</Descriptions>
			</PageHeader>
		</Layout.Content>
	);

	const body = (
		<Layout.Content
			style={{
				backgroundColor: 'white',
				padding: '16px 24px'
			}}>
			<div
				dangerouslySetInnerHTML={{
					__html: message.body
				}}
			/>
		</Layout.Content>
	);

	return (
		<>
			{header}
			{body}
		</>
	);
};

export default ReadMessage;

//#endregion
