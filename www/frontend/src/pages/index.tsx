import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../components/Header';
import List from '../components/mails/List';
import MessageView from '../components/messages/MessageView';
import DeleteMailboxModal from '../components/modals/DeleteMailbox';
import { Layout, Row, Col } from 'antd';
import { Mailbox, Message, MessagesList, MailboxResponse } from '../types';

import {
	isWelcomeMessageDeleted,
	isWelcomeMessageRead,
	deleteBoxCookies,
	markWelcomeMessageHasRead
} from '../modules/cookies';

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

	const handleWelcomeMessageHook = useCallback(() => {
		const isDeleted = isWelcomeMessageDeleted();
		const isRead = isWelcomeMessageRead();

		const shouldSetWelcomeMessage =
			mailbox !== null &&
			message === null &&
			isDeleted === false &&
			isRead === false;

		if (shouldSetWelcomeMessage === true) {
			setMessage(getWelcomeMailResponse(mailbox as MailboxResponse));
		} else if (isRead === false) {
			markWelcomeMessageHasRead();
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
		async (silent = false) => {
			if (mailbox !== null) {
				if (silent === false) setLoading(true);
				const response = await pullMessages(mailbox);
				setMessages(response);
				if (silent === false) setLoading(false);
			}
		},
		[mailbox]
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
		else if (messages?.length === 0) handleWelcomeMessageHook();
	}, [mailbox, messages, pullMessagesHook, handleWelcomeMessageHook]);

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
					<Col
						xs={{ order: 2, span: 24 }}
						md={{ order: 1, span: 12 }}
						lg={{ order: 1, span: 8 }}>
						<List
							loading={loading}
							setCurrent={setMessage}
							current={message}
							messages={messages}
							mailbox={mailbox}
						/>
					</Col>
					<Col
						xs={{ order: 1, span: 24 }}
						md={{ order: 2, span: 12 }}
						lg={{ order: 2, span: 12 }}>
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
