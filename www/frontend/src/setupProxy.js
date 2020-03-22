const { join } = require('path');
const { existsSync } = require('fs');

const loadBackendRouters = app => {
	const { getRouters } = require('../../backend/dist/core/express');
	getRouters().forEach(route => app.use(route.fn()));
};

/**
 * Proxying requests in Development
 * @see https://create-react-app.dev/docs/proxying-api-requests-in-development/
 */
module.exports = app => {
	if (!existsSync(join(__dirname, '../../backend/dist'))) {
		console.warn('Backend not builded, skipping development proxy...');
	} else loadBackendRouters(app);
};
