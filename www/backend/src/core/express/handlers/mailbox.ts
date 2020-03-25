import { Request, Response, CookieOptions } from 'express';
import { createSignedHash, isHashValid } from '../../../modules/crypto';
import { onBadRequest } from '..';
import imapConfig from '../../imap/config';

import {
	createBox,
	isBoxTypeValid,
	isUidTypeValid,
	joinIdBox,
	isBoxValid
} from '../../imap/helpers';

import {
	fetchForUids,
	deleteByUids,
	pullUidsForBox,
	FetchResponse
} from '../../imap';

//#region utils

const getCookieBox = (cookies?: { [key: string]: string }) => {
	let cookieBox: string | null = null;

	if (cookies === void 0) {
		return cookieBox;
	}

	if (cookies['box_current'] !== void 0) {
		const explode = String(cookies['box_current']).split('#');
		const isCookieBoxValid =
			isBoxValid(explode[0]) && isHashValid(explode[0], explode[1]);

		if (isCookieBoxValid === true) {
			cookieBox = String(explode[0]);
		}
	}

	return cookieBox;
};

const assignDefaultCookies = (res: Response, box: string, hash: string) => {
	const defaultCookieOptions: CookieOptions = {
		httpOnly: false,
		sameSite: true,
		encode: value => value,
		secure: process.env.NODE_ENV === 'production'
	};

	res.cookie(
		'box_created_at',
		new Date().toISOString(),
		defaultCookieOptions
	);

	res.cookie('box_current', [box, hash].join('#'), defaultCookieOptions);
	res.cookie('box_welcome_mail_deleted', 'no', defaultCookieOptions);
	res.cookie('box_welcome_mail_read', 'no', defaultCookieOptions);
};

const onInvalidProperty = (res: Response, name: string) =>
	onBadRequest(res, `Invalid or missing "${name}" property.`);

//#endregion
//#region handlers

export const handleCreateBox = (req: Request, res: Response) => {
	const cookieBox = getCookieBox(req.cookies);
	const currentBox =
		(imapConfig.junkbox.useUniqueBox &&
			imapConfig.junkbox.uniqueBoxValue) ||
		cookieBox ||
		createBox();

	const hash = createSignedHash(currentBox);

	if (cookieBox === null) {
		assignDefaultCookies(res, currentBox, hash);
	}

	return res.send({
		box: currentBox,
		domain: imapConfig.junkbox.domain,
		hash
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
		bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
		markSeen: true
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
	} else if (items.length === 0) {
		return res.send({ success: true });
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
	return res.send({ success: true });
};

//#endregion
