import * as Imap from 'imap';
import config from './config';

//#region private methods

const _initialize = (): Promise<Imap.Box> =>
	new Promise((resolve, reject) => {
		const imap = new Imap(config.connection);

		imap.once('ready', () => {
			imap.openBox('INBOX', true, (err, box) =>
				err ? reject(err) : resolve(box)
			);
		});

		imap.once('error', reject);
		imap.connect();
	});

//#endregion
//#region public methods

export const pullForId = async (
	targetId: string,
	pullLimit = config.maxPullLimit
) => {
	if (String(targetId).length <= 2) {
		throw new Error('Specified "targetId" is too short.');
	}

	const isPullLimitValid =
		(pullLimit === void 0 ||
			pullLimit > config.maxPullLimit ||
			pullLimit <= 0) === false;

	if (isPullLimitValid === false) {
		pullLimit = config.maxPullLimit;
	}

	const imapBox = await _initialize();
	const fetch = imapBox.seq.fetch(`1:${pullLimit}`, {
		bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
		struct: true
	});

	return [targetId, pullLimit];
};

//#endregion
