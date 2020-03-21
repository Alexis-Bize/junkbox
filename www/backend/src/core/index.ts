import { start as startExpress } from './express';
import { start as startImap } from './imap';
import api from './express/routers/api';

export const initialize = () =>
	startImap().then(() =>
		startExpress({
			beforeStart: async app => {
				app.use('/api', api());
				app.get('/*', (_req, res) => res.send('> Hello World'));
			}
		})
	);
