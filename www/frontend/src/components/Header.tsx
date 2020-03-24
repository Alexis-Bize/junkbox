import * as React from 'react';
import { Layout, Input, Tooltip, Button } from 'antd';
import { copyToClipboard } from '../modules/utils';
import { DeleteOutlined, CopyOutlined, RedoOutlined } from '@ant-design/icons';
import { concatBoxDomain } from '../modules/helpers';
import { Mailbox } from '../types';

//#region typings

export type Props = {
	pullMailbox: () => void;
	deleteMailbox: () => void;
	mailbox: Mailbox;
};

//#endregion
//#region utils

const Header = (props: Props) => {
	const { mailbox, pullMailbox, deleteMailbox } = props;

	return (
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
									onClick={pullMailbox}
									loading={mailbox === null}
									type="default"
									icon={<RedoOutlined />}
								/>
							</Tooltip>{' '}
							<Tooltip
								placement="bottom"
								title={'Delete this email address'}>
								<Button
									onClick={deleteMailbox}
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