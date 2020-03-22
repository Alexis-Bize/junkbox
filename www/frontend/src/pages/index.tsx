import React, { useState, useEffect } from 'react';

import {
	Descriptions,
	PageHeader,
	Layout,
	Input,
	Badge,
	List,
	Avatar,
	Button,
	Row,
	Col
} from 'antd';

import {
	DeleteOutlined,
	MailOutlined,
	CopyOutlined,
	ReloadOutlined,
	GithubOutlined,
	TwitterOutlined
} from '@ant-design/icons';

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

	useEffect(() => {
		const requestMailbox = async () => {
			const result = await fetch('/api/mailbox');
			const json = await result.json();
			setMailbox(json);
		};

		const pullMailbox = async (box: string, hash: string) => {
			if (mailbox !== null) {
				const qs = `box=${box}&hash=${hash}`;
				const result = await fetch(`/api/mailbox/pull?${qs}`);
				const json = await result.json();
				setData(json);
			}
		};

		if (mailbox === null) requestMailbox();
		else if (data === null) pullMailbox(mailbox.box, mailbox.hash);
	}, [mailbox, data]);

	return (
		<Layout id="junkbox-pages-index" style={{ height: '100vh' }}>
			<Layout.Sider id="junkbox-components-sider">
				<Layout.Header style={{ backgroundColor: '#FFCC66' }}>
					Junkbox
				</Layout.Header>
				<TwitterOutlined />
				<GithubOutlined />
			</Layout.Sider>
			<Layout.Content
				id="junkbox-components-mails"
				style={{ padding: '8px' }}>
				<Row gutter={[8, 8]}>
					<Col span={8}>
						<Layout.Content id="junkbox-components-mails-list">
							<Input
								size="large"
								addonBefore={
									<Badge
										count={data?.count || 0}
										overflowCount={10}>
										<MailOutlined />
									</Badge>
								}
								addonAfter={
									<div>
										<Button
											type="default"
											icon={<CopyOutlined />}
										/>{' '}
										<Button
											type="default"
											icon={<ReloadOutlined />}
										/>{' '}
										<Button
											type="danger"
											icon={<DeleteOutlined />}
										/>
									</div>
								}
								value={
									mailbox !== null
										? [mailbox.box, mailbox.domain].join(
												'@'
										  )
										: 'Loading...'
								}
							/>
							<List
								itemLayout="horizontal"
								dataSource={data === null ? [] : data.items}
								renderItem={item => (
									<List.Item
										key={item.id}
										style={{
											backgroundColor: 'white',
											padding: '16px',
											marginTop: '8px'
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
										Monday 5th October 2020 11:56PM
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
