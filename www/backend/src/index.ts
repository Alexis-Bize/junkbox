import * as cors from 'cors';
import * as compression from 'compression';
import expressConfig from './core/express/config';
import { static as expressStatic } from 'express';
import { start as startExpress, getRouters } from './core/express';
import { start as startImap } from './core/imap';
import { existsSync } from 'fs';
import { join } from 'path';

startImap()
	.then(() =>
		startExpress({
			beforeStart: async app => {
				app.use(cors({ origin: expressConfig.cors.whitelist }));
				app.use(compression());

				getRouters().forEach(router => {
					const prefixApiRoutes =
						router.name === 'api' &&
						expressConfig.useApiPrefix === true;

					if (prefixApiRoutes === true) {
						app.use('/api', router.fn());
					} else app.use(router.fn());
				});

				if (process.env.NOW_LAMBDA !== 'yes') {
					const buildPath = join(__dirname, '../../frontend/dist');

					if (existsSync(buildPath) === true) {
						app.use(expressStatic(buildPath));
						app.get('/*', (_, res) =>
							res.sendFile(join(buildPath, 'index.html'))
						);
					} else throw new Error('Frontend has not been builded.');
				}
			}
		})
	)
	.catch(err => {
		console.error(err);
	});
