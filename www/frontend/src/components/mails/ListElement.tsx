import * as React from 'react';
import { List as AntdList, Avatar } from 'antd';
import { MessageResponse } from '../../types';
import { getSenderInitials } from '../../modules/mailbox';

//#region typings

type Props = {
	onSelect: () => void;
	selected: boolean;
	message: MessageResponse;
};

//#endregion
//#region component

const ListElement = (props: Props) => {
	const { message, selected, onSelect } = props;

	if (message.header === void 0) {
		return null;
	}

	return (
		<AntdList.Item
			className={selected === true ? 'selected' : ''}
			style={{ wordBreak: 'break-word', overflow: 'hidden' }}
			onClick={onSelect}>
			<AntdList.Item.Meta
				avatar={
					<Avatar
						style={{
							color: '#f56a00',
							backgroundColor: '#fde3cf'
						}}>
						{getSenderInitials(message.header.from)}
					</Avatar>
				}
				title={message.header.subject}
				description={message.header.from}
			/>
		</AntdList.Item>
	);
};

export default ListElement;

//#endregion
