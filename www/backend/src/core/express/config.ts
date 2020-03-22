export default {
	connection: {
		host: '0.0.0.0',
		port: 8900
	},
	cors: {
		whitelist:
			process.env.NODE_ENV === 'production'
				? ['https://junkbox.one', 'https://junkbox.now.sh']
				: ['*']
	}
};
