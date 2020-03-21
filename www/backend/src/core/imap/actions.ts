import config from './config';
import { getInstance } from '.';

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

	getInstance().seq.fetch(`1:${pullLimit}`, {
		bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
		struct: true
	});

	return [targetId, pullLimit];
};

//#endregion
