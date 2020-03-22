export default {
	box: {
		domain: (process.env.IMAP_USER || '').split('@')[1] || '',
		lengths: { min: 6, max: 12 },
		useUniqueBox:
			process.env.NODE_ENV === 'development' ||
			process.env.UNIQUE_BOX === 'yes',
		uniqueBoxValue: process.env.UNIQUE_BOX_VALUE || 'demo-box'
	},
	connection: {
		user: process.env.IMAP_USER || '',
		password: process.env.IMAP_PASSWORD || '',
		host: process.env.IMAP_HOST || '',
		port: 993,
		tls: true
	}
};
