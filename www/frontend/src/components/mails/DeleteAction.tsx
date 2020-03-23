import * as React from 'react';
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

//#region typings

export type Props = {
	onDelete: (uid: number | null) => void;
};

//#endregion
//#region component

const DeleteAction = (props: Props) => (
	<Popconfirm
		title="Would you like to delete this email?"
		placement="bottomLeft"
		okText="Yes, delete it"
		okType="danger"
		onConfirm={() => props.onDelete(null)}>
		<Button type="danger" icon={<DeleteOutlined />}>
			Delete
		</Button>
	</Popconfirm>
);

export default DeleteAction;

//#endregion
