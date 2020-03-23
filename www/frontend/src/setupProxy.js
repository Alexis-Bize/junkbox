const { join } = require('path');
const { existsSync } = require('fs');

//#region backend modules

const backendDistDir = join(__dirname, '../../backend/dist');
const backendExpress = join(backendDistDir, 'core/express');
const backendImap = join(backendDistDir, 'core/imap');

//#endregion
//#region backend loaders

const loadBackendEnvironment = () => {
	require(join(backendDistDir, 'environment'));
};

const assignBackendHandlers = app => {
	const { assignExpressHandlers } = require(backendExpress);
	return assignExpressHandlers(app);
};

const initializeBackendImap = () => {
	const imap = require(join(backendImap, 'initializer'));
	return imap.start();
};

//#endregion

/**
 * Proxying requests in Development
 * @see https://create-react-app.dev/docs/proxying-api-requests-in-development/
 */
module.exports = app => {
	if (existsSync(backendDistDir) === true) {
		loadBackendEnvironment();
		assignBackendHandlers(app);
		initializeBackendImap().catch(console.error);
	} else console.warn('Backend not builded, skipping development proxy...');
};
