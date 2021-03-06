import * as React from 'react';
import { Layout, Divider } from 'antd';

//#region typings

type Props = {
	body: string | JSX.Element;
};

//#endregion
//#region component

const MessageBody = (props: Props) => {
	const bodyContent = (typeof props.body !== 'string' && props.body) || (
		<div dangerouslySetInnerHTML={{ __html: props.body }} />
	);

	return (
		<Layout.Content
			style={{
				backgroundColor: 'white',
				padding: '16px 24px'
			}}>
			<Divider style={{ marginTop: 0 }} />
			{bodyContent}
			<Divider style={{ marginBottom: 0 }} />
		</Layout.Content>
	);
};

export default MessageBody;

//#endregion
