import { initialize } from './core';

initialize()
	.then(() => {
		console.info('> Service is up and running!');
	})
	.catch(err => {
		console.error(err);
		process.exit(1);
	});
