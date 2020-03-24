import * as handlers from '../handlers/mailbox';
import { Router } from 'express';
import { onError } from '..';

//#endregion
//#region router

const router = Router();

router.get('/mailbox', handlers.handleCreateBox);
router.get('/mailbox/pull', (req, res) =>
	handlers.handlePullBox(req, res).catch(err => {
		console.error(err);
		return onError(res);
	})
);

router.post('/mailbox/batch/delete', (req, res) =>
	handlers.handleBatchDeleteFromBox(req, res).catch(err => {
		console.error(err);
		return onError(res);
	})
);

export default () => router;

//#endregion
