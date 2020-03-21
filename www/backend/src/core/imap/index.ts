import * as Imap from 'imap';
import config from './config';

//#region definitions

let __INSTANCE__: null | Imap = null;
let __BOX__: null | Imap.Box = null;

//#endregion
//#region public methods

export const start = (): Promise<Imap.Box> =>
	new Promise((resolve, reject) => {
		const imap = new Imap(config.connection);

		imap.once('ready', () => {
			imap.openBox('INBOX', true, (err, box) => {
				if (err) return reject(err);
				__BOX__ = box;
				return resolve();
			});
		});

		imap.once('error', reject);
		imap.connect();

		__INSTANCE__ = imap;
	});

export const getInstance = () => {
	if (__INSTANCE__ === null) throw new Error('Instance not set.');
	else return __INSTANCE__;
};

export const getBox = () => {
	if (__BOX__ === null) throw new Error('Box not set.');
	else return __BOX__;
};

//#endregion
