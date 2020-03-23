import { Router } from 'express';
import * as handlers from '../handlers/mailbox';

//#endregion
//#region router

const router = Router();

router.get('/mailbox', handlers.handleCreateBox);
router.get('/mailbox/pull', (req, res) =>
	handlers.handlePullBox(req, res).catch(err => {
		console.error(err);
		return res.sendStatus(500);
	})
);

router.get('/mailbox/read', (req, res) =>
	handlers.handleReadBoxItem(req, res).catch(err => {
		console.error(err);
		return res.sendStatus(500);
	})
);

router.post('/mailbox/batch/delete', handlers.handleBatchDeleteFromBox);

export default () => router;

//#endregion
