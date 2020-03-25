import * as React from 'react';
import { Layout, Input, Tooltip, Button } from 'antd';
import { copyToClipboard } from '../modules/utils';
import { DeleteOutlined, CopyOutlined, RedoOutlined } from '@ant-design/icons';
import { concatBoxDomain } from '../modules/mailbox';
import { Mailbox } from '../types';

//#region typings

export type Props = {
	pullMessages: () => void;
	askForDelete: () => void;
	mailbox: Mailbox;
};

//#endregion
//#region utils

const Header = (props: Props) => {
	const { mailbox, pullMessages, askForDelete } = props;

	return (
		<Layout.Header
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
				<div className="junkbox-title">
					<span className="junkbox-title-alt">Your temporary</span>{' '}
					<span style={{ color: '#FFCC66' }}>
						Junkbox <DeleteOutlined />
					</span>{' '}
					<span className="junkbox-title-alt">email address</span>
				</div>
				<Input
					addonAfter={
						<div>
							<Tooltip
								placement="bottom"
								title={'Copy to clipboard'}>
								<Button
									onClick={() =>
										mailbox !== null &&
										copyToClipboard(
											concatBoxDomain(
												mailbox.box,
												mailbox.domain
											)
										)
									}
									loading={mailbox === null}
									type="dashed"
									icon={<CopyOutlined />}
								/>
							</Tooltip>{' '}
							<Tooltip
								placement="bottom"
								title={'Refresh messages list'}>
								<Button
									onClick={pullMessages}
									loading={mailbox === null}
									type="default"
									icon={<RedoOutlined />}
								/>
							</Tooltip>{' '}
							<Tooltip
								placement="bottom"
								title={'Delete this email address'}>
								<Button
									onClick={askForDelete}
									loading={mailbox === null}
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
							? concatBoxDomain(mailbox.box, mailbox.domain)
							: 'Loading...'
					}
				/>
			</div>
		</Layout.Header>
	);
};

export default Header;

//#endregion
