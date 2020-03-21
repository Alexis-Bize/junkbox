import * as cors from 'cors';
import * as compression from 'compression';
import expressConfig from './core/express/config';
import { static as expressStatic } from 'express';
import { start as startExpress, getRouters } from './core/express';
import { start as startImap } from './core/imap';
import { existsSync } from 'fs';
import { join } from 'path';

startImap().then(() =>
	startExpress({
		beforeStart: async app => {
			const buildPath = join(__dirname, '../../frontend/dist');

			app.use(cors({ origin: expressConfig.cors.whitelist }));
			app.use(compression());
			getRouters().forEach(route => app.use(route()));

			if (existsSync(buildPath) === true) {
				app.use(expressStatic(buildPath));
				app.get('/*', (_, res) =>
					res.sendFile(join(buildPath, 'index.html'))
				);
			} else throw new Error('Frontend has not been builded.');
		}
	})
);
