export default {
	connection: {
		user: process.env.IMAP_USER || '',
		password: process.env.IMAP_PASSWORD || '',
		host: process.env.IMAP_HOST || '',
		port: 993,
		tls: true
	},
	maxPullLimit: 50
};
