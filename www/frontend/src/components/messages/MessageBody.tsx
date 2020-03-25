import * as React from 'react';
import { Layout } from 'antd';

//#region typings

type Props = {
	body: string | JSX.Element;
};

//#endregion
//#region component

const MessageBody = (props: Props) => {
	const bodyElement =
		typeof props.body === 'string' ? (
			<div dangerouslySetInnerHTML={{ __html: props.body }} />
		) : (
			props.body
		);

	return (
		<Layout.Content
			style={{
				backgroundColor: 'white',
				padding: '16px 24px'
			}}>
			{bodyElement}
		</Layout.Content>
	);
};

export default MessageBody;

//#endregion
