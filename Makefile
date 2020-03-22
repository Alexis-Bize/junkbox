dev-source-env:
	touch .env-development && source .env-development

dev-build: dev-source-env
	npm run build --prefix ./www/backend

dev-start: dev-source-env
	npm start --prefix ./www/backend
