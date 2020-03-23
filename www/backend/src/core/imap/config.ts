export default {
	junkbox: {
		domain: (process.env.IMAP_USER || '').split('@')[1] || '',
		lengths: { min: 6, max: 12 },
		useUniqueBox:
			process.env.NODE_ENV === 'development' ||
			process.env.UNIQUE_BOX === 'yes',
		uniqueBoxValue: process.env.UNIQUE_BOX_VALUE || 'junkbox-demo',
		customBoxReservedList: ['hello', 'no-reply', 'alexis.bize', 'junkbox']
	},
	connection: {
		user: process.env.IMAP_USER || '',
		password: process.env.IMAP_PASSWORD || '',
		host: process.env.IMAP_HOST || '',
		port: 993,
		tls: true
	},
	mapping: {
		inbox: 'INBOX',
		trash: 'Trash'
	}
};
