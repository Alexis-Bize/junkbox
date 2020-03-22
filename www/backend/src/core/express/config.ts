export default {
	connection: {
		host: '0.0.0.0',
		port: 8900
	},
	cors: {
		whitelist: [
			'https://junkbox.one',
			'https://junkbox.now.sh',
			'https://dispsbl.email'
		]
	},
	useApiPrefix: process.env.NOW_LAMBA !== 'yes'
};
