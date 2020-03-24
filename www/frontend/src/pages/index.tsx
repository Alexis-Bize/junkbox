import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import List from '../components/mails/List';
import MessageView from '../components/mails/MessageView';
import DeleteMailboxModal from '../components/mails/DeleteMailboxModal';
import { deleteBoxCookies } from '../modules/cookies';
import { stringify } from '../modules/utils';
import { Layout, Row, Col } from 'antd';
import { Mailbox, Message, MessagesList, MessageResponse } from '../types';

//#region component

const Index = () => {
	//#region hooks

	const [mailbox, setMailbox] = useState<Mailbox>(null);
	const [message, setMessage] = useState<Message>('welcome-mail');
	const [messages, setMessages] = useState<MessagesList>(null);
	const [showModal, setModal] = useState<boolean>(false);
	const [pulling, setPulling] = useState<boolean>(false);

	const pullMailbox = useCallback(async () => {
		if (mailbox !== null) {
			setPulling(true);
			const qs = stringify({ box: mailbox.box, hash: mailbox.hash });
			const result = await fetch(`/api/mailbox/pull?${qs}`);
			const json = await result.json();
			setMessages(json.items);
			setPulling(false);

			if (message === null) {
				setMessage('welcome-mail');
			}
		}
	}, [mailbox, message]);

	const requestMailbox = useCallback(async () => {
		const result = await fetch('/api/mailbox');
		const json = await result.json();
		setMailbox(json);
		setMessages(null);
	}, []);

	const deleteMailbox = useCallback(async () => {
		await fetch('/api/mailbox/batch/delete', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				items: (messages || []).map(item => ({
					uid: item.uid,
					box: item.box,
					hash: item.hash
				}))
			})
		});

		deleteBoxCookies();
		setMailbox(null);
	}, [messages]);

	const deleteMessage = useCallback(
		async (item: Pick<MessageResponse, 'uid' | 'box' | 'hash'>) => {
			await fetch('/api/mailbox/batch/delete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					items: [{ uid: item.uid, box: item.box, hash: item.hash }]
				})
			});

			setMessage(null);
			setMessages(null);
		},
		[]
	);

	useEffect(() => {
		if (mailbox === null) requestMailbox();
		else if (messages === null) pullMailbox();
	}, [mailbox, messages, requestMailbox, pullMailbox]);

	//#endregion

	return (
		<Layout style={{ height: '100vh' }}>
			<DeleteMailboxModal
				visible={showModal}
				onCancel={() => setModal(false)}
				onOk={() =>
					deleteMailbox().then(() => {
						setModal(false);
					})
				}
			/>
			<Header
				deleteMailbox={() => setModal(!showModal)}
				pullMailbox={() => pullMailbox()}
				mailbox={mailbox}
			/>
			<Layout.Content style={{ padding: '8px' }}>
				<Row
					gutter={[8, 0]}
					style={{ height: '100%', overflow: 'auto' }}>
					<Col span={8}>
						<List
							pulling={pulling}
							setCurrent={uid => {
								if (uid !== 0)
									setMessage(
										(messages || []).find(
											item => item.uid === uid
										) || null
									);
								else setMessage('welcome-mail');
							}}
							current={
								message !== 'welcome-mail'
									? message?.uid || null
									: 0
							}
							messages={messages}
							mailbox={mailbox}
						/>
					</Col>
					<Col span={16}>
						<MessageView
							message={message}
							mailbox={mailbox}
							onDelete={(uid, box, hash) => {
								if (uid === 0) setMessage(null);
								else deleteMessage({ uid, box, hash });
							}}
						/>
					</Col>
				</Row>
			</Layout.Content>
		</Layout>
	);
};

export default Index;

//#endregion
