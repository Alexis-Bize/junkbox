dev-source-env:
	touch .env-development && source .env-development

dev-install: dev-source-env
	npm install --prefix ./www/backend --production=false && \
	npm install --prefix ./www/frontend --production=false

dev-build: dev-source-env
	npm run build --prefix ./www/backend

dev-start: dev-source-env
	npm start --prefix ./www/backend
