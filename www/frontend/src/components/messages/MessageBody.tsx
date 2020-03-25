import * as React from 'react';
import * as ReactHtmlParser from 'react-html-parser';
import { Layout, Divider } from 'antd';

//#region typings

type Props = {
	body: string | JSX.Element;
};

//#endregion
//#region component

const MessageBody = (props: Props) => {
	const bodyElement =
		typeof props.body === 'string'
			? ReactHtmlParser.default(props.body, { decodeEntities: true })
			: props.body;

	return (
		<Layout.Content
			style={{
				backgroundColor: 'white',
				padding: '16px 24px'
			}}>
			<Divider style={{ marginTop: 0 }} />
			{bodyElement}
			<Divider style={{ marginBottom: 0 }} />
		</Layout.Content>
	);
};

export default MessageBody;

//#endregion
