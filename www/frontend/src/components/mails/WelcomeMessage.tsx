import * as React from 'react';
import { Layout, PageHeader, Descriptions, Divider } from 'antd';
import { setCookie } from '../../modules/cookies';
import { MailboxResponse } from '../../types';
import DeleteAction from './DeleteAction';

import {
	getBoxCreationDate,
	computeDefaultSender,
	getWelcomeMailItem
} from '../../modules/helpers';

import {
	GithubOutlined,
	MailOutlined,
	LockOutlined,
	CoffeeOutlined
} from '@ant-design/icons';

//#region typings

export type Props = {
	onDelete: () => void;
	mailbox: MailboxResponse;
};

//#endregion
//#region component

const WelcomeMessage = (props: Props) => {
	const { mailbox, onDelete } = props;
	const message = getWelcomeMailItem(mailbox);

	const header = (
		<Layout.Content
			style={{
				backgroundColor: 'white',
				marginBottom: '8px'
			}}>
			<PageHeader
				title={message.header.subject}
				extra={
					<DeleteAction
						onDelete={() => {
							setCookie('box_welcome_mail_deleted', 'yes', {
								sameSite: 'strict'
							});

							onDelete();
						}}
					/>
				}>
				<Descriptions size="small" column={1}>
					<Descriptions.Item label="From">
						{computeDefaultSender(mailbox)}
					</Descriptions.Item>
					<Descriptions.Item label="Date">
						{getBoxCreationDate()}
					</Descriptions.Item>
				</Descriptions>
			</PageHeader>
		</Layout.Content>
	);

	const body = (
		<Layout.Content
			style={{
				backgroundColor: 'white',
				padding: '16px 24px'
			}}>
			<Divider style={{ marginTop: 0 }} />
			<h3>
				<LockOutlined style={{ marginRight: '8px' }} /> Keep your real
				mailbox clean and secure
			</h3>
			<p>
				Forget about spam and advertising mailings,{' '}
				<strong>Junkbox</strong> provides disposable email addresses for
				free.
			</p>
			<Divider />
			<h3>
				<MailOutlined style={{ marginRight: '8px' }} /> What is a
				disposable email address?
			</h3>
			<p>
				A disposable email address is a temporary and completely
				anonymous email address with a predetermined lifetime that does
				not require any registration.
			</p>
			<Divider />
			<h3>
				<GithubOutlined style={{ marginRight: '8px' }} /> Free and open
				sourced!
			</h3>
			<p>
				<strong>Junkbox</strong> source code is available on{' '}
				<a
					href="https://github.com/Alexis-Bize/junkbox"
					target="_blank"
					rel="noreferrer noopener">
					GitHub
				</a>{' '}
				and proudly hosted on{' '}
				<a
					href="https://zeit.co/home"
					target="_blank"
					rel="noreferrer noopener">
					zeit.co
				</a>
				.
			</p>
			<Divider />
			<h3>
				<CoffeeOutlined style={{ marginRight: '8px' }} /> Cookies,
				cookies
			</h3>
			<p>
				Please note that this website uses cookies to give you the best
				experience and features available.
				<br />
				By continuing to use this site, you accept our usage of cookies
				in your browser.
			</p>
			<Divider style={{ marginBottom: 0 }} />
		</Layout.Content>
	);

	return (
		<>
			{header}
			{body}
		</>
	);
};

export default WelcomeMessage;

//#endregion
