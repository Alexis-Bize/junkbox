import * as React from 'react';
import { Spin, List as AntdList, Layout } from 'antd';
import {
	MessagesList,
	Mailbox,
	MessageResponse,
	MailboxResponse
} from '../../types';
import { isWelcomeMessageDeleted } from '../../modules/cookies';
import { getWelcomeMailResponse } from '../../modules/mailbox';
import ListElement from './ListElement';

//#region typings

type Props = {
	setCurrent: (message: MessageResponse) => void;
	loading: boolean;
	current: MessageResponse | null;
	messages: MessagesList;
	mailbox: Mailbox;
};

//#endregion
//#region component

const List = (props: Props) => {
	const messages = props.messages || [];
	const items = [...messages];
	const { current, loading, mailbox, setCurrent } = props;

	const pushWelcomeMessage =
		props.messages !== null &&
		mailbox !== null &&
		isWelcomeMessageDeleted() === false;

	if (pushWelcomeMessage === true) {
		items.push(getWelcomeMailResponse(mailbox as MailboxResponse));
	}

	return (
		<Layout.Content
			style={{
				backgroundColor: 'white',
				height: '100%'
			}}>
			<Spin spinning={loading}>
				<AntdList
					itemLayout="horizontal"
					dataSource={items}
					renderItem={item => (
						<ListElement
							key={item.uid || ''}
							message={item}
							selected={
								current !== null && item.uid === current.uid
							}
							onSelect={() => setCurrent(item)}
						/>
					)}></AntdList>
			</Spin>
		</Layout.Content>
	);
};

export default List;

//#endregion
