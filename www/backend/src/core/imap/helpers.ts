import config from './config';
import { rand } from '../../modules/crypto';

//#region public methods

export const createBox = () => {
	const { min, max } = config.junkbox.lengths;
	const chars = 'abcdefghijklmnopqrstuvwxyz123567890';
	const length = Math.floor(Math.random() * (max - min + 1)) + min;
	return rand(length, chars);
};

export const joinIdBox = (id: string | number, box: string) => {
	if (isUidTypeValid(id) === false) {
		throw new Error('Specified "id" property is invalid.');
	} else if (isBoxTypeValid(box) === false) {
		throw new Error('Specified "box" property is invalid.');
	} else return [String(id), box].join(':');
};

export const isBoxValid = (box: string = '') => {
	if (isBoxTypeValid(box) === false) {
		return false;
	}

	const isDefaultValue =
		config.junkbox.useUniqueBox === true &&
		box === config.junkbox.uniqueBoxValue;

	if (isDefaultValue === true) {
		return true;
	}

	const { min, max } = config.junkbox.lengths;
	const regexp = new RegExp(
		`^((?![\-\.])([a-z0-9\-\.]{${min},${max}}[^\.\-]))$`,
		'g'
	);

	return regexp.test(box);
};

export const isBoxTypeValid = (box: string = '') =>
	!!box && typeof box === 'string' && box.trim().length !== 0;

export const isHashTypeValid = (hash: string = '') =>
	!!hash && typeof hash === 'string';

export const isUidTypeValid = (uid: string | number = '') =>
	!!uid && isNaN(Number(uid)) === false && Number(uid) >= 1;

//#endregion
