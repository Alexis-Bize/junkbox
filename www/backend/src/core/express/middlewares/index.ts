import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import { Express } from 'express';
import expressConfig from '../config';
import errorHandler from './error-handler';

export const loadMiddlewares = (app: Express) => {
	app.use(cors({ origin: expressConfig.cors.whitelist }));
	app.use(compression());
	app.use(cookieParser());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(errorHandler);
};
