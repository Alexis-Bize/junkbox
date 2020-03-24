import * as React from 'react';
import { Spin, List as AntdList, Layout } from 'antd';
import { MessagesList, Mailbox } from '../../types';
import { isWelcomeMailDeleted } from '../../modules/cookies';
import { getWelcomeMailItem } from '../../modules/helpers';
import ListElement from './ListElement';

//#region typings

type Props = {
	setCurrent: (uid: number) => void;
	pulling: boolean;
	current: number | null;
	messages: MessagesList;
	mailbox: Mailbox;
};

//#endregion
//#region component

const List = (props: Props) => {
	const messages = props.messages || [];
	const items = [...messages];
	const { current, pulling, mailbox, setCurrent } = props;

	if (mailbox !== null && isWelcomeMailDeleted() === false) {
		items.push(getWelcomeMailItem(mailbox));
	}

	return (
		<Layout.Content
			style={{
				backgroundColor: 'white',
				height: '100%'
			}}>
			<Spin spinning={pulling}>
				<AntdList
					itemLayout="horizontal"
					dataSource={items}
					renderItem={item => (
						<ListElement
							key={item.uid}
							message={item}
							selected={item.uid === current}
							onSelect={() => setCurrent(item.uid)}
						/>
					)}></AntdList>
			</Spin>
		</Layout.Content>
	);
};

export default List;

//#endregion
