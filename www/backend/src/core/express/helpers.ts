import { Response } from 'express';

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
