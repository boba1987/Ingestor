# Ingestor

## Requirements
 - [Node v7.6+](https://nodejs.org/en/download/current/) or [Docker](https://www.docker.com/)
 - [Yarn](https://yarnpkg.com/en/docs/install)
 - [Mongo](https://www.mongodb.com/download-center#atlas)

## Development server
1. cd backend
2. npm install
3. npm run dev


## Documentation
```bash
# generate and open api documentation
yarn docs
```

## Docker
```bash
# run container locally
yarn docker:dev
or
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# run container in production
yarn docker:prod
or
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

# run tests
yarn docker:test
or
docker-compose -f docker-compose.yml -f docker-compose.test.yml up
