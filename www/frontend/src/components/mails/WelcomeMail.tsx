import * as React from 'react';
import { Layout, PageHeader, Descriptions, Divider, Button } from 'antd';
import { getCookieValue, createCookie } from '../../modules/cookies';
import DeleteAction from './DeleteAction';

import {
	GithubOutlined,
	MailOutlined,
	LockOutlined,
	CoffeeOutlined
} from '@ant-design/icons';

//#region typings

export type Props = {
	onDeleted: () => void;
	mailbox: null | {
		box: string;
		domain: string;
		hash: string;
	};
};

//#endregion
//#region utils

const getBoxCreationDate = () => {
	const cookieDate = String(getCookieValue('box_created_at') || '');
	const isDateValid = isNaN(Date.parse(cookieDate)) === false;
	const creationDate = new Date(
		isDateValid === false ? Date.now() : cookieDate
	);

	return [
		creationDate.toDateString(),
		creationDate.toLocaleTimeString()
	].join(' - ');
};

//#endregion
//#region component

const WelcomeMail = (props: Props) => {
	const { onDeleted, mailbox } = props;

	const emailDate = getBoxCreationDate();
	const computeSender = () =>
		mailbox === null
			? 'Junkbox'
			: `Junkbox <${[mailbox.box, mailbox.domain].join('@')}>`;

	const header = (
		<Layout.Content
			id="junkbox-components-mails-mail-header"
			style={{
				backgroundColor: 'white',
				marginBottom: '8px'
			}}>
			<PageHeader
				title="Welcome to Junkbox!"
				extra={
					<DeleteAction
						onDelete={() => {
							createCookie('box_welcome_mail_deleted', 'yes', {
								sameSite: 'strict'
							});

							onDeleted();
						}}
					/>
				}>
				<Descriptions size="small" column={1}>
					<Descriptions.Item label="From">
						{computeSender()}
					</Descriptions.Item>
					<Descriptions.Item label="Date">
						{emailDate}
					</Descriptions.Item>
				</Descriptions>
			</PageHeader>
		</Layout.Content>
	);

	const body = (
		<Layout.Content
			id="junkbox-components-mails-mail-body"
			style={{
				backgroundColor: 'white',
				padding: '16px 24px'
			}}>
			<div
				style={{
					margin: '0 auto'
				}}>
				<Divider style={{ marginTop: 0 }} />
				<h3>
					<LockOutlined style={{ marginRight: '8px' }} /> Keep your
					real mailbox clean and secure
				</h3>
				<p>
					Forget about spam and advertising mailings,{' '}
					<strong>Junkbox</strong> provides disposable email addresses
					for free.
				</p>
				<Divider />
				<h3>
					<MailOutlined style={{ marginRight: '8px' }} /> What is a
					disposable email address?
				</h3>
				<p>
					A disposable email address is a temporary and completely
					anonymous email address with a predetermined lifetime that
					does not require any registration.
				</p>
				<Divider />
				<h3>
					<GithubOutlined style={{ marginRight: '8px' }} /> Free and
					open sourced!
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
					Please note that this website uses cookies to give you the
					best experience and features available.
					<br />
					By continuing to use this site, you accept our usage of
					cookies in your browser.
				</p>
				<Divider style={{ marginBottom: 0 }} />
			</div>
		</Layout.Content>
	);

	return (
		<>
			{header}
			{body}
		</>
	);
};

export default WelcomeMail;

//#endregion
