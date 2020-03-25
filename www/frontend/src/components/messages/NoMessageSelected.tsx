import React from 'react';
import { Layout } from 'antd';

//#region components

const NoMessageSelected = () => (
	<Layout.Content
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

//#endregion
