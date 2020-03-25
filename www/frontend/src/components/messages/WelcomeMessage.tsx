import * as React from 'react';
import MessageHeader from './MessageHeader';
import MessageBody from './MessageBody';
import { Layout, Divider } from 'antd';
import { setCookie } from '../../modules/cookies';
import { MailboxResponse } from '../../types';

import {
	getBoxCreationDate,
	computeDefaultSender,
	getWelcomeMailResponse
} from '../../modules/mailbox';

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
	const message = getWelcomeMailResponse(mailbox);

	const bodyContent = (
		<div>
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
		</div>
	);

	return (
		<Layout.Content>
			<MessageHeader
				header={{
					subject: message.header.subject,
					from: computeDefaultSender(mailbox),
					date: getBoxCreationDate()
				}}
				onDelete={() => {
					setCookie('box_welcome_mail_deleted', 'yes', {
						sameSite: 'strict'
					});

					onDelete();
				}}
			/>
			<MessageBody body={bodyContent} />
		</Layout.Content>
	);
};

export default WelcomeMessage;

//#endregion
