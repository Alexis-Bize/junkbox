import React, { useState, useEffect, useCallback } from 'react';

import {
	DeleteOutlined,
	CopyOutlined,
	ReloadOutlined
} from '@ant-design/icons';

import {
	Descriptions,
	PageHeader,
	Layout,
	Input,
	List,
	Avatar,
	Button,
	Row,
	Col
} from 'antd';

const getSenderInitials = (from: string) => {
	const match = from.split('<')[0].match(/[a-zA-Z0-9]+/g) || [];
	const slice = match.slice(0, 2);
	const extract = [(slice[0] || '').charAt(0), (slice[1] || '').charAt(0)];
	return extract.join('').toUpperCase();
};

const Index = () => {
	const [mailbox, setMailbox] = useState<null | {
		box: string;
		domain: string;
		hash: string;
	}>(null);

	const [data, setData] = useState<null | {
		items: Array<{
			id: string;
			hash: string;
			headers: {
				date: string;
				subject: string;
				from: string;
			};
		}>;
		count: number;
	}>(null);

	const pullMailbox = useCallback(async () => {
		if (mailbox !== null) {
			const qs = `box=${mailbox.box}&hash=${mailbox.hash}`;
			const result = await fetch(`/api/mailbox/pull?${qs}`);
			const json = await result.json();
			setData(json);
		}
	}, [mailbox]);

	const requestMailbox = useCallback(async () => {
		const result = await fetch('/api/mailbox');
		const json = await result.json();
		setMailbox(json);
		setData(null);
	}, []);

	useEffect(() => {
		if (mailbox === null) requestMailbox();
		else if (data === null) pullMailbox();
	}, [mailbox, data, requestMailbox, pullMailbox]);

	return (
		<Layout id="junkbox-pages-index" style={{ height: '100vh' }}>
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
								<Button type="dashed" icon={<CopyOutlined />} />{' '}
								<Button
									onClick={() =>
										mailbox !== null
											? pullMailbox()
											: void 0
									}
									type="default"
									icon={<ReloadOutlined />}
								/>{' '}
								<Button
									onClick={requestMailbox}
									type="danger"
									icon={<DeleteOutlined />}
								/>
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
				<Row gutter={[8, 0]}>
					<Col span={8}>
						<Layout.Content id="junkbox-components-mails-list">
							<List
								itemLayout="horizontal"
								dataSource={data === null ? [] : data.items}
								renderItem={item => (
									<List.Item
										key={item.id}
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
														item.headers.from
													)}
												</Avatar>
											}
											title={item.headers.subject}
											description={item.headers.from}
										/>
									</List.Item>
								)}
							/>
						</Layout.Content>
					</Col>
					<Col span={16}>
						<Layout.Content
							id="junkbox-components-mails-view-header"
							style={{
								backgroundColor: 'white',
								marginBottom: '8px'
							}}>
							<PageHeader
								title="Welcome to Junkbox!"
								extra={
									<Button
										type="danger"
										icon={<DeleteOutlined />}>
										Delete
									</Button>
								}>
								<Descriptions size="small" column={1}>
									<Descriptions.Item label="From">
										{mailbox === null
											? 'Junkbox'
											: `Junkbox <${[
													mailbox?.box,
													mailbox?.domain
											  ].join('@')}>`}
									</Descriptions.Item>
									<Descriptions.Item label="Date">
										{new Date().toLocaleDateString()} -
										{new Date().toLocaleTimeString()}
									</Descriptions.Item>
								</Descriptions>
							</PageHeader>
						</Layout.Content>
						<Layout.Content
							id="junkbox-components-mails-view-body"
							style={{
								backgroundColor: 'white',
								padding: '16px 24px'
							}}>
							<p>Hello you!</p>
						</Layout.Content>
					</Col>
				</Row>
			</Layout.Content>
		</Layout>
	);
};

export default Index;
