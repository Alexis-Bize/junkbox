import './environment';
import { start as startExpress } from './core/express/initializer';
import { beforeStart as beforeExpressStart } from './core/express';
import { start as startImap } from './core/imap/initializer';

startImap()
	.then(() => startExpress({ beforeStart: beforeExpressStart }))
	.catch(err => {
		console.error(err);
		process.exit(1);
	});
