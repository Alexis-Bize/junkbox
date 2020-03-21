import { Router } from 'express';
import { pullForId } from '../../imap/actions';

//#region router

const router = Router();

router.post('/pull', async (req, res) => {
	const { id, limit } = req.body as {
		id?: string;
		limit?: number;
	};

	if (typeof id !== 'string') {
		return res.status(400);
	} else if (limit !== void 0 && typeof limit !== 'number') {
		return res.status(400);
	}

	const emails = await pullForId(id, limit);

	if (Array.isArray(emails) === true) {
		return res.send({
			items: emails,
			count: emails.length
		});
	} else return res.status(500);
});

export default () => router;

//#endregion
