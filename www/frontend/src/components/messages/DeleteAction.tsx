import * as React from 'react';
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

//#region typings

type Props = {
	onDelete: (uid: number | null) => void;
	loading?: boolean;
};

//#endregion
//#region component

const DeleteAction = (props: Props) => (
	<Popconfirm
		title="Are you sure you want to delete this email?"
		placement="bottomLeft"
		okText="Yes, delete it"
		okType="danger"
		onConfirm={() => props.onDelete(null)}>
		<Button
			type="danger"
			loading={!!props.loading}
			icon={<DeleteOutlined />}>
			Delete
		</Button>
	</Popconfirm>
);

export default DeleteAction;

//#endregion
