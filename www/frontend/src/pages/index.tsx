import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import List from '../components/mails/List';
import MessageView from '../components/messages/MessageView';
import DeleteMailboxModal from '../components/modals/DeleteMailbox';
import { Layout, Row, Col, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

import {
	Mailbox,
	Message,
	MessagesList,
	MailboxResponse,
	LayoutType
} from '../types';

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

//#region utils

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

const getLayoutType = (): LayoutType =>
	window.matchMedia('(min-width: 1280px)').matches === true
		? 'plain'
		: 'overlay';

//#endregion
//#region component

const Index = () => {
	//#region states

	const [mailbox, setMailbox] = useState<Mailbox>(null);
	const [message, setMessage] = useState<Message>(null);
	const [messages, setMessages] = useState<MessagesList>(null);
	const [layoutType, setLayoutType] = useState<LayoutType>(getLayoutType());
	const [showDeleteModal, setDeleteModal] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	//#endregion
	//#region states

	const resizeListener = useRef(() => setLayoutType(getLayoutType()));

	//#endregion
	//#region hook functions

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

	//#endregion
	//#region effects

	useEffect(() => {
		if (mailbox === null) requestMailboxHook(true);
	}, [mailbox, requestMailboxHook]);

	useEffect(() => {
		if (mailbox !== null && messages === null) pullMessagesHook();
		else if (messages?.length === 0) handleWelcomeMessageHook();
	}, [mailbox, messages, pullMessagesHook, handleWelcomeMessageHook]);

	useEffect(() => {
		const { current } = resizeListener;
		if (current !== null) window.addEventListener('resize', current);
		return () => window.removeEventListener('resize', current);
	}, [resizeListener]);

	useInterval(() => {
		if (loading === false) pullMessagesHook(true);
	}, 5000);

	//#endregion
	//#region render

	const shouldDisplayList =
		layoutType === 'plain' ||
		(layoutType === 'overlay' && message === null);

	const shouldDisplayMessage =
		layoutType === 'plain' ||
		(layoutType === 'overlay' && message !== null);

	const shouldDisplayBackButton =
		layoutType === 'overlay' && message !== null;

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
				pullMessages={() => pullMessagesHook()}
				mailbox={mailbox}
			/>
			<Layout.Content style={{ padding: '8px' }}>
				<Row
					gutter={[8, 0]}
					style={{ height: '100%', overflow: 'auto' }}>
					{shouldDisplayList === true && (
						<Col span={layoutType === 'plain' ? 6 : 24}>
							<List
								loading={loading}
								setCurrent={current =>
									setMessage(
										current.uid === message?.uid
											? null
											: current
									)
								}
								current={message}
								messages={messages}
								mailbox={mailbox}
							/>
						</Col>
					)}
					{shouldDisplayMessage && (
						<Col span={layoutType === 'plain' ? 18 : 24}>
							{shouldDisplayBackButton === true && (
								<Button
									style={{ marginBottom: '8px' }}
									icon={<ArrowLeftOutlined />}
									onClick={() => setMessage(null)}>
									Back to Inbox
								</Button>
							)}
							<MessageView
								message={message}
								mailbox={mailbox}
								onDelete={target => {
									batchDeleteMessagesHook([target]);
								}}
							/>
						</Col>
					)}
				</Row>
			</Layout.Content>
			<Footer />
		</Layout>
	);

	//#endregion
};

export default Index;

//#endregion
