import * as React from 'react';
import { Modal } from 'antd';

//#region typings

type Props = {
	onCancel: () => void;
	onOk: () => void;
	visible: boolean;
};

//#endregion
//#region component

const DeleteMailboxModal = (props: Props) => (
	<Modal
		okType="danger"
		okText="Delete"
		title="Delete this email address"
		visible={props.visible}
		onCancel={props.onCancel}
		onOk={props.onOk}>
		<p>
			This action will delete <strong>all existing mails</strong> in this
			mailbox and a new one will be assigned to you.
		</p>
		<p>
			Please note that this email address could be{' '}
			<strong>randomly generated once again</strong> by you or someone
			else.
		</p>
	</Modal>
);

export default DeleteMailboxModal;

//#endregion
