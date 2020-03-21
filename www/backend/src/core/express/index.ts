import * as express from 'express';
import { Server } from 'http';
import { Express } from 'express';
import config from './config';

//#region typings

type Options = {
	beforeStart?: (app: Express) => Promise<any>;
};

//#endregion

//#region definitions

let __INSTANCE__: null | Express = null;
let __SERVER__: null | Server = null;

//#endregion
//#region public methods

export const start = async (options: Options = {}): Promise<Express> => {
	const { beforeStart = (_app: Express) => Promise.resolve() } = options;

	const app = express();
	const host = config.connection.host;
	const port = Number(config.connection.port);

	__INSTANCE__ = app;
	const appInstance = getInstance();

	await beforeStart(appInstance);
	await new Promise((resolve, reject) => {
		__SERVER__ = appInstance.listen(port, host, err => {
			if (err) return reject(err);
			else return resolve();
		});
	});

	return appInstance;
};

export const getInstance = () => {
	if (__INSTANCE__ === null) throw new Error('Instance not set.');
	else return __INSTANCE__;
};

export const getServer = () => {
	if (__SERVER__ === null) throw new Error('Box not set.');
	else return __SERVER__;
};

//#endregion
