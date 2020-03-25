import * as React from 'react';
import { Layout, PageHeader, Descriptions } from 'antd';
import { MessageResponse } from '../../types';
import DeleteAction from './DeleteAction';

//#region typings

type Props = {
	onDelete: () => void;
	header: MessageResponse['header'];
};

//#endregion
//#region component

const MessageHeader = (props: Props) => (
	<Layout.Content
		style={{
			backgroundColor: 'white',
			marginBottom: '8px'
		}}>
		<PageHeader
			title={props.header.subject}
			extra={<DeleteAction onDelete={props.onDelete} />}>
			<Descriptions size="small" column={1}>
				<Descriptions.Item label="From">
					{props.header.from}
				</Descriptions.Item>
				<Descriptions.Item label="Date">
					{props.header.date}
				</Descriptions.Item>
			</Descriptions>
		</PageHeader>
	</Layout.Content>
);

export default MessageHeader;

//#endregion
