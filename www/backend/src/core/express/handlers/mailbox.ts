import { Request, Response } from 'express';
import { createSignedHash, isHashValid } from '../../../modules/crypto';
import { onBadRequest } from '..';
import imapConfig from '../../imap/config';

import {
	createBox,
	isBoxTypeValid,
	isUidTypeValid,
	joinIdBox
} from '../../imap/helpers';

import {
	fetchForUids,
	deleteByUids,
	pullUidsForBox,
	FetchResponse
} from '../../imap';

//#region helpers

const onInvalidProperty = (res: Response, name: string) =>
	onBadRequest(res, `Invalid or missing "${name}" property.`);

//#endregion
//#region handlers

export const handleCreateBox = (_req: Request, res: Response) => {
	const box =
		(imapConfig.junkbox.useUniqueBox &&
			imapConfig.junkbox.uniqueBoxValue) ||
		createBox();

	return res.send({
		box,
		domain: imapConfig.junkbox.domain,
		hash: createSignedHash(box)
	});
};

export const handlePullBox = async (req: Request, res: Response) => {
	const { box = '', hash = '' } = req.query as {
		box: string;
		hash: string;
	};

	if (isBoxTypeValid(box) === false) {
		return onInvalidProperty(res, 'box');
	} else if (isHashValid(box, hash) === false) {
		return onInvalidProperty(res, 'hash');
	}

	const uids = await pullUidsForBox(box);
	const response = { items: [], count: 0 } as {
		items: FetchResponse[];
		count: number;
	};

	if (uids.length === 0) {
		return res.send(response);
	}

	response.items = await fetchForUids(uids, box, {
		bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)'],
		markSeen: false
	});

	response.count = response.items.length;

	return res.send(response);
};

export const handleBatchDeleteFromBox = async (req: Request, res: Response) => {
	const { items = [] } = req.body as {
		items?: Array<Omit<FetchResponse, 'headers' | 'body'>>;
	};

	if (Array.isArray(items) === false) {
		return onInvalidProperty(res, 'items');
	}

	for (const item of items) {
		const { uid, box, hash } = item;

		if (isUidTypeValid(uid) === false) {
			return onInvalidProperty(res, 'uid');
		} else if (isBoxTypeValid(box) === false) {
			return onInvalidProperty(res, 'box');
		} else if (isHashValid(joinIdBox(uid, box), hash) === false) {
			return onInvalidProperty(res, 'hash');
		}
	}

	await deleteByUids(items.map(item => item.uid));
	return res.sendStatus(200);
};

export const handleReadBoxItem = async (req: Request, res: Response) => {
	const { uid = '', box = '', hash = '' } = req.query as {
		uid: string;
		box: string;
		hash: string;
	};

	if (isUidTypeValid(uid) === false) {
		return onInvalidProperty(res, 'id');
	} else if (isHashValid(joinIdBox(uid, box), hash) === false) {
		return onInvalidProperty(res, 'hash');
	}

	const response = await fetchForUids([Number(uid)], box, {
		bodies: ['TEXT'],
		markSeen: true
	});

	return res.send(response);
};

//#endregion
