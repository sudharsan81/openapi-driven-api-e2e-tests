# API E2E Tests

This repository demostrates how open-api specification can be used in api e2e to dynamically generate types, validate response body schemas.

For demo purpose, we download and use latest [Swagger's Petstore Open API specification](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml) in yaml format. We also run Petstore API server locally.

## Pre-requisites

- node, version <= 23.6.1
- npm, version <= 10.9.2
- curl, version <=7.54.0

## Preparation

> Ensure you are in the home directory of this repo.

> All the local foler names are set by convention.

1. Download Swagger's Pet store API open-api specification file to a local folder

```bash
mkdir -p ./openapi/specification/ && curl -o ./openapi/specification/petstore-api-spec.yaml https://raw.githubusercontent.com/swagger-api/swagger-petstore/master/src/main/resources/openapi.yaml
```

2. Generate types from the open api specification

```bash
npm install -g openapi-typescript

mkdir -p ./openapi/generated/ && npx openapi-typescript ./openapi/specification/petstore-api-spec.yaml --output ./openapi/generated/petstore-types.ts
```

3. Convert downloaded open api specification from yaml to json format

```bash
npm install -g swagger-cli

mkdir -p ./openapi/generated/ && swagger-cli bundle ./openapi/specification/petstore-api-spec.yaml -o ./openapi/generated/petstore-api-spec.json
```

4. Start local pet store api server

```bash
cd petstore-server

node server.js
```

## Run tests

> Open a new ternimal.

> Ensure you are in the home directory of this repo.

1. Execute all tests

```bash
npx playwright test ./e2e/
```

2. View Test Report

```bash
npx playwright show-report
```
