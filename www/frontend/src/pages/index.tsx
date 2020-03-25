import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../components/Header';
import List from '../components/mails/List';
import MessageView from '../components/messages/MessageView';
import DeleteMailboxModal from '../components/modals/DeleteMailbox';
import { Layout, Row, Col } from 'antd';
import { isWelcomeMailDeleted, deleteBoxCookies } from '../modules/cookies';
import { Mailbox, Message, MessagesList, MailboxResponse } from '../types';

import {
	pullMessages,
	getWelcomeMailResponse,
	requestMailbox,
	batchDeleteMessages,
	BatchDeletePayload
} from '../modules/mailbox';

//#region utild

/**
 * @see https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
const useInterval = (callback: () => void, delay: number | null = null) => {
	const savedCallback = useRef<any>();

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		const tick = () => {
			savedCallback.current();
		};

		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
};

//#endregion
//#region component

const Index = () => {
	//#region hooks

	const [mailbox, setMailbox] = useState<Mailbox>(null);
	const [message, setMessage] = useState<Message>(null);
	const [messages, setMessages] = useState<MessagesList>(null);
	const [showDeleteModal, setDeleteModal] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const setWelcomeMessageHook = useCallback(() => {
		const shouldSetWelcomeMessage =
			mailbox !== null &&
			message === null &&
			isWelcomeMailDeleted() === false;

		if (shouldSetWelcomeMessage === true) {
			setMessage(getWelcomeMailResponse(mailbox as MailboxResponse));
		}
	}, [mailbox, message]);

	const requestMailboxHook = useCallback(
		async (force = false) => {
			setLoading(true);

			if (mailbox === null || force === true) {
				const response = await requestMailbox();
				setMailbox(response);
			}

			setLoading(false);
		},
		[mailbox]
	);

	const pullMessagesHook = useCallback(
		async (ping = false) => {
			if (mailbox !== null) {
				if (ping === false) setLoading(true);
				const response = await pullMessages(mailbox);
				setMessages(response);
				if (ping === false) setWelcomeMessageHook();
				if (ping === false) setLoading(false);
			}
		},
		[mailbox, setWelcomeMessageHook]
	);

	const batchDeleteMessagesHook = useCallback(
		async (payload: BatchDeletePayload) => {
			setLoading(true);
			await batchDeleteMessages(payload);
			setMessage(null);
			await pullMessagesHook();
			setLoading(false);
		},
		[pullMessagesHook]
	);

	const deleteMailboxHook = async (payload: BatchDeletePayload) => {
		setLoading(true);
		await batchDeleteMessagesHook(payload);
		deleteBoxCookies();
		setMessage(null);
		setMailbox(null);
		setMessages(null);
		setDeleteModal(false);
		setLoading(false);
	};

	useEffect(() => {
		if (mailbox === null) requestMailboxHook(true);
	}, [mailbox, requestMailboxHook]);

	useEffect(() => {
		if (mailbox !== null && messages === null) pullMessagesHook();
	}, [mailbox, messages, pullMessagesHook]);

	useInterval(() => {
		if (loading === false) pullMessagesHook(true);
	}, 5000);

	//#endregion

	return (
		<Layout style={{ height: '100vh' }}>
			{messages !== null && (
				<DeleteMailboxModal
					visible={showDeleteModal}
					onCancel={() => setDeleteModal(false)}
					onOk={() =>
						deleteMailboxHook(
							messages.map(m => ({
								uid: m.uid,
								box: m.box,
								hash: m.hash
							}))
						)
					}
				/>
			)}
			<Header
				askForDelete={() => setDeleteModal(true)}
				pullMessages={pullMessagesHook}
				mailbox={mailbox}
			/>
			<Layout.Content style={{ padding: '8px' }}>
				<Row
					gutter={[8, 0]}
					style={{ height: '100%', overflow: 'auto' }}>
					<Col span={8}>
						<List
							loading={loading}
							setCurrent={setMessage}
							current={message}
							messages={messages}
							mailbox={mailbox}
						/>
					</Col>
					<Col span={16}>
						<MessageView
							message={message}
							mailbox={mailbox}
							onDelete={target => {
								batchDeleteMessagesHook([target]);
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
