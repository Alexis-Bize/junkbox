export default {
	box: {
		lock: true,
		lockedValue: 'demo',
		domain: (process.env.IMAP_USER || '').split('@')[1] || '',
		lengths: { min: 6, max: 12 }
	},
	connection: {
		user: process.env.IMAP_USER || '',
		password: process.env.IMAP_PASSWORD || '',
		host: process.env.IMAP_HOST || '',
		port: 993,
		tls: true
	}
};
