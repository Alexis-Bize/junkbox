import { Router, Request, Response } from 'express';
import { createSignedHash, isHashValid } from '../../../modules/crypto';

import {
	Metadata,
	fetchBody,
	createTarget,
	isTargetValid,
	pullIdsForTarget,
	fetchMetadataForIds
} from '../../imap/helpers';

//#region handlers

const handlePing = (_req: Request, res: Response) =>
	res.send({
		alive: true
	});

const handleCreateTarget = (_req: Request, res: Response) => {
	const target = createTarget();

	return res.send({
		target,
		hash: createSignedHash(target)
	});
};

const handlePullTarget = async (req: Request, res: Response) => {
	const { target, hash } = req.query as {
		target?: string;
		hash?: string;
	};

	if (isTargetValid(target) === false) {
		return res
			.status(403)
			.send({ error: 'Missing or invalid "target" query parameter.' });
	} else if (isHashValid(target, hash) === false) {
		return res
			.status(403)
			.send({ error: 'Missing or invalid "hash" query parameter.' });
	}

	const ids = await pullIdsForTarget(target);
	const response = { items: [], count: 0 } as {
		items: Metadata[];
		count: number;
	};

	if (ids.length === 0) {
		return res.send(response);
	}

	response.items = await fetchMetadataForIds(ids);
	response.count = response.items.length;

	return res.send(response);
};

const handleReadBody = async (req: Request, res: Response) => {
	const { id, hash } = req.query as {
		id?: string;
		hash?: string;
	};

	if (isNaN(Number(id)) === true || id === void 0) {
		return res
			.status(400)
			.send({ error: 'Missing or invalid "id" query parameter.' });
	} else if (isHashValid(id, hash) === false) {
		return res
			.status(403)
			.send({ error: 'Missing or invalid "hash" query parameter.' });
	}

	const body = await fetchBody(id);
	return res.send({ body });
};

//#endregion
//#region router

const router = Router();

router.get('/ping', handlePing);
router.get('/read-body', (req, res) =>
	handleReadBody(req, res).catch(err => {
		console.error(err);
		return res.sendStatus(500);
	})
);

router.get('/create-target', handleCreateTarget);
router.get('/pull-target', (req, res) =>
	handlePullTarget(req, res).catch(err => {
		console.error(err);
		return res.sendStatus(500);
	})
);

export default () => router;

//#endregion
