import React, { useState, useEffect } from 'react';
import { Input, Badge, List, Avatar } from 'antd';
import { MailOutlined } from '@ant-design/icons';

const getSenderInitials = (from: string) => {
	const explode = from.split(' ').slice(0, 2);
	const extract = [
		(explode[0] || '').charAt(0),
		(explode[1] || '').charAt(0)
	];

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
		<div className="junkbox-pages-index">
			<Input
				size="large"
				addonBefore={
					<Badge count={data?.count || 0} overflowCount={10}>
						<MailOutlined />
					</Badge>
				}
				value={
					mailbox !== null
						? [mailbox.box, mailbox.domain].join('@')
						: 'Loading...'
				}
			/>
			<List
				itemLayout="horizontal"
				dataSource={data === null ? [] : data.items}
				renderItem={item => (
					<List.Item key={item.id}>
						<List.Item.Meta
							avatar={
								<Avatar
									style={{
										color: '#f56a00',
										backgroundColor: '#fde3cf'
									}}>
									{getSenderInitials(item.headers.from)}
								</Avatar>
							}
							title={item.headers.subject}
							description={item.headers.from}
						/>
					</List.Item>
				)}
			/>
		</div>
	);
};

export default Index;
