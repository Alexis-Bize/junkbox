import { Express, Response, static as expressStatic } from 'express';
import { loadMiddlewares } from './middlewares';
import { getRouters } from './initializer';
import { existsSync } from 'fs';
import { join } from 'path';

//#region request errors methods

export const onBadRequest = (res: Response, reason = 'Bad request.') =>
	res.status(400).send({
		error: reason,
		statusCode: 400
	});

export const onNotFound = (res: Response, reason = 'Not found.') =>
	res.status(404).send({
		error: reason,
		statusCode: 404
	});

export const onError = (res: Response, reason = 'Something went wrong...') =>
	res.status(500).send({
		error: reason,
		statusCode: 500
	});

//#endregion
//#region assignation methods

export const assignExpressHandlers = (app: Express) => {
	loadMiddlewares(app);

	const handleFrontendBuild =
		process.env.NOW_LAMBDA !== 'yes' &&
		process.env.NODE_ENV === 'production';

	/**
	 * @see now.json
	 */
	if (handleFrontendBuild === false) {
		getRouters().forEach(router => app.use('/api', router()));
		return;
	}

	const buildPath = join(__dirname, '../../../../frontend/build');

	if (existsSync(buildPath) === true) {
		app.use(expressStatic(buildPath));
		app.get('/*', (_, res) => res.sendFile(join(buildPath, 'index.html')));
	} else throw new Error('Frontend has not been builded.');
};

export const beforeStart = async (app: Express) => {
	assignExpressHandlers(app);
};

//#endregion
