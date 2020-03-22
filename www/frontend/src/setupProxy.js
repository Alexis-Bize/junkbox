const { join } = require('path');
const { existsSync } = require('fs');

const assignBackendRoutes = app => {
	const { getRouters } = require('../../backend/dist/core/express');
	getRouters().forEach(router => app.use('/api', router()));
};

const loadBackendImap = () => {
	const imap = require('../../backend/dist/core/imap');
	return imap.start();
};

/**
 * Proxying requests in Development
 * @see https://create-react-app.dev/docs/proxying-api-requests-in-development/
 */
module.exports = app => {
	if (!existsSync(join(__dirname, '../../backend/dist'))) {
		console.warn('Backend not builded, skipping development proxy...');
	} else require('../../backend/dist/environment');

	assignBackendRoutes(app);
	loadBackendImap(app).catch(console.error);
};
