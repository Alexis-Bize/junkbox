import { Request, Response, NextFunction } from 'express';
import { onError } from '..';

export default () => (
	err: Error,
	_: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof Error) {
		const reason =
			process.env.NODE_ENV === 'production'
				? 'Something went wrong...'
				: err.message;
		console.error(err);
		return onError(res, reason);
	} else return next();
};
