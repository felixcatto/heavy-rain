install:
	npm install

start:
	npx gulp dev

build:
	NODE_ENV=production npx gulp prod

start-production: build
	NODE_ENV=test node dist/bin/server.js

deploy:
	git push -f heroku master

webpack_bundle:
	NODE_ENV=production npx webpack-cli

lint:
	npx eslint .

lint-fix:
	npx eslint --fix .

migrate:
	npx sequelize db:migrate

migrate-undo:
	npx sequelize db:migrate:undo
