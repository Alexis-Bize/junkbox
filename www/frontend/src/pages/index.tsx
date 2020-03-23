import React, { useState, useEffect, useCallback } from 'react';
import WelcomeMail from '../components/mails/WelcomeMail';
import NoMessageSelected from '../components/mails/NoMessageSelected';
import { DeleteOutlined, CopyOutlined, RedoOutlined } from '@ant-design/icons';
import { getSenderInitials } from '../modules/utils';
import { isWelcomeMailDeleted, deleteBoxCookies } from '../modules/cookies';

import {
	Spin,
	Modal,
	Tooltip,
	Layout,
	Input,
	List,
	Avatar,
	Button,
	Row,
	Col
} from 'antd';

const Index = () => {
	const [mailbox, setMailbox] = useState<null | {
		box: string;
		domain: string;
		hash: string;
	}>(null);

	const [message, setMessage] = useState<
		| null
		| 'welcome-mail'
		| {
				uid: string;
				box: string;
				hash: string;
				body: string;
		  }
	>('welcome-mail');

	const [data, setData] = useState<null | {
		items: Array<{
			uid: string;
			box: string;
			hash: string;
			header: {
				date: string;
				subject: string;
				from: string;
			};
		}>;
		count: number;
	}>(null);

	const [showModal, setModal] = useState<boolean>(false);
	const [pulling, setPulling] = useState<boolean>(false);

	const pullMailbox = useCallback(async () => {
		if (mailbox !== null) {
			setPulling(true);
			const qs = `box=${mailbox.box}&hash=${mailbox.hash}`;
			const result = await fetch(`/api/mailbox/pull?${qs}`);
			const json = await result.json();
			setData(json);
			setPulling(false);
		}
	}, [mailbox]);

	const requestMailbox = useCallback(async () => {
		const result = await fetch('/api/mailbox');
		const json = await result.json();
		setMailbox(json);
		setData(null);
	}, []);

	const deleteMailbox = useCallback(async () => {
		await fetch('/api/mailbox/batch/delete', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				items: (data?.items || []).map(item => ({
					uid: item.uid,
					box: item.box,
					hash: item.hash
				}))
			})
		});

		deleteBoxCookies();
		setMailbox(null);
	}, [data]);

	useEffect(() => {
		if (mailbox === null) requestMailbox();
		else if (data === null) pullMailbox();
	}, [mailbox, data, requestMailbox, pullMailbox]);

	return (
		<Layout id="junkbox-pages-index" style={{ height: '100vh' }}>
			<Modal
				okType="danger"
				okText="Delete"
				title="Delete this email address"
				visible={showModal}
				onOk={() => {
					deleteMailbox().then(() => {
						setModal(false);
					});
				}}
				onCancel={() => setModal(false)}>
				<p>
					This action will delete <strong>all existing mails</strong>{' '}
					in this mailbox and a new one will be assigned to you.
				</p>
				<p>
					Please note that this email address could be{' '}
					<strong>randomly generated once again</strong> by you or
					someone else.
				</p>
			</Modal>
			<Layout.Header
				id="junkbox-components-header"
				style={{
					height: 'auto',
					paddingTop: '16px',
					paddingBottom: '16px'
				}}>
				<div
					className="mail-details"
					style={{
						textAlign: 'center',
						maxWidth: '620px',
						margin: '0 auto'
					}}>
					<div
						style={{
							fontSize: '20px',
							fontWeight: 'bold',
							color: 'white'
						}}>
						Your temporary{' '}
						<span style={{ color: '#FFCC66' }}>
							Junkbox <DeleteOutlined />
						</span>{' '}
						email address
					</div>
					<Input
						addonAfter={
							<div>
								<Tooltip
									placement="bottom"
									title={'Copy to clipboard'}>
									<Button
										type="dashed"
										icon={<CopyOutlined />}
									/>
								</Tooltip>{' '}
								<Tooltip
									placement="bottom"
									title={'Refresh messages list'}>
									<Button
										onClick={() =>
											mailbox !== null &&
											pulling === false
												? pullMailbox()
												: void 0
										}
										type="default"
										icon={<RedoOutlined />}
									/>
								</Tooltip>{' '}
								<Tooltip
									placement="bottom"
									title={'Delete this email address'}>
									<Button
										onClick={() => setModal(!showModal)}
										type="danger"
										icon={<DeleteOutlined />}
									/>
								</Tooltip>
							</div>
						}
						type="email"
						autoComplete="off"
						size="large"
						value={
							mailbox !== null
								? [mailbox.box, mailbox.domain].join('@')
								: 'Loading...'
						}
					/>
				</div>
			</Layout.Header>
			<Layout.Content
				id="junkbox-components-mails"
				style={{ padding: '8px' }}>
				<Row
					gutter={[8, 0]}
					style={{ height: '100%', overflow: 'auto' }}>
					<Col span={8}>
						<Layout.Content
							id="junkbox-components-mails-list"
							style={{
								backgroundColor: 'white',
								height: '100%'
							}}>
							<Spin spinning={pulling}>
								<List
									itemLayout="horizontal"
									dataSource={data === null ? [] : data.items}
									renderItem={item => (
										<List.Item
											key={item.uid}
											style={{
												backgroundColor: 'white',
												padding: '16px',
												marginBottom: '8px'
											}}>
											<List.Item.Meta
												avatar={
													<Avatar
														style={{
															color: '#f56a00',
															backgroundColor:
																'#fde3cf'
														}}>
														{getSenderInitials(
															item.header.from
														)}
													</Avatar>
												}
												title={item.header.subject}
												description={item.header.from}
											/>
										</List.Item>
									)}
								/>
							</Spin>
						</Layout.Content>
					</Col>
					<Col span={16}>
						{(message === 'welcome-mail' &&
							isWelcomeMailDeleted() === false && (
								<WelcomeMail
									onDeleted={() => {
										setMessage(null);
									}}
									mailbox={mailbox}
								/>
							)) || <NoMessageSelected />}
					</Col>
				</Row>
			</Layout.Content>
		</Layout>
	);
};

export default Index;
