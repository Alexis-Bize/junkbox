import { Request, Response } from 'express';
import { createSignedHash, isHashValid } from '../../../modules/crypto';
import { onBadRequest } from '../helpers';
import imapConfig from '../../imap/config';

import {
	Metadata,
	fetchBody,
	createBox,
	isBoxValid,
	pullIdsForBox,
	fetchMetadataForIds
} from '../../imap/helpers';

//#region handlers

export const handleCreateBox = (_req: Request, res: Response) => {
	const box =
		(imapConfig.box.useUniqueBox && imapConfig.box.uniqueBoxValue) ||
		createBox();

	return res.send({
		box,
		domain: imapConfig.box.domain,
		hash: createSignedHash(box)
	});
};

export const handlePullBox = async (req: Request, res: Response) => {
	const { box, hash } = req.query as {
		box?: string;
		hash?: string;
	};

	if (isBoxValid(box) === false) {
		return onBadRequest(res, 'Missing or invalid "box" query parameter.');
	} else if (isHashValid(box, hash) === false) {
		return onBadRequest(res, 'Missing or invalid "hash" query parameter.');
	}

	const ids = await pullIdsForBox(box);
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

export const handleReadBoxItem = async (req: Request, res: Response) => {
	const { id, hash } = req.query as {
		id?: string;
		hash?: string;
	};

	if (isNaN(Number(id)) === true || id === void 0) {
		return onBadRequest(res, 'Missing or invalid "id" query parameter.');
	} else if (isHashValid(id, hash) === false) {
		return onBadRequest(res, 'Missing or invalid "hash" query parameter.');
	}

	const body = await fetchBody(id);
	return res.send({ body });
};

//#endregion
