import React from 'react';
import { Layout } from 'antd';

const NoMessageSelected = () => (
	<Layout.Content
		id="junkbox-components-mails-mail-empty"
		style={{
			backgroundColor: 'transparent',
			marginBottom: '8px',
			padding: '16px 24px'
		}}>
		<div
			style={{
				textAlign: 'center',
				fontSize: '20px',
				opacity: '0.5'
			}}>
			No message selected
		</div>
	</Layout.Content>
);

export default NoMessageSelected;
