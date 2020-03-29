import React from 'react';
import { Layout } from 'antd';

//#region component

const Footer = () => (
	<Layout.Footer
		style={{
			bottom: 0,
			textAlign: 'center',
			fontSize: '12px',
			position: 'absolute',
			width: '100%'
		}}>
		Created with ♥ by{' '}
		<a
			href="https://alexis-bize.io"
			target="_blank"
			rel="noreferrer noopener">
			Alexis B.
		</a>
		<br />© Junkbox.one {new Date().getFullYear()} -{' '}
		<a
			href="https://github.com/Alexis-Bize/junkbox"
			target="_blank"
			rel="noreferrer noopener">
			GitHub
		</a>
	</Layout.Footer>
);

export default Footer;

//#endregion
