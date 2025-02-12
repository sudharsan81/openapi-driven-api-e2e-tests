npm install openapi-typescript

npx openapi-typescript ./openapi/specification/petstore-api.yaml --output ./openapi/generated-types/types.ts

swagger-cli bundle ./openapi/specification/petstore-api.yaml -o ./openapi/generated-schemas/petstore-api.json