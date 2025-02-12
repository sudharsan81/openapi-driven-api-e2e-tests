import { test, expect } from '@playwright/test';
import { PetStoreApi } from '../src/lib/api/PetStoreApi';
import * as fs from 'fs';
import * as path from 'path';
import chai from 'chai';
import jsonSchema from 'chai-json-schema';

chai.use(jsonSchema);
const chaiExpect = chai.expect;

test('Create a new Pet', async () => {
  const baseURL = 'http://localhost:3000/v2';
  const petStoreApi = new PetStoreApi(baseURL);
  await petStoreApi.init();

  try {
    // Create a new pet
    const newPet = {
      id: 0,
      name: 'Test Pet',
      status: 'available', // Ensure this is one of the expected values
      category: {
          id: 0,
          name: 'Test Category',
      },
      tags: [
          {
              id: 0,
              name: 'Test Tag',
          },
      ],
      photoUrls: [
          'http://example.com/photo1.jpg',
          'http://example.com/photo2.jpg'
      ],
    };

    // Create the new pet using POST endpoint
    const createdPetResponse = await petStoreApi.addPet(newPet);
    const createdPetResponseBody = await createdPetResponse.json();

    // Ensure the created pet has an ID assigned by the server
    expect(createdPetResponseBody.id).not.toBeNull();
    expect(createdPetResponseBody.id).not.toEqual(0);

    // Read the JSON schema file
    const schemaFilePath = path.resolve(__dirname, '../openapi/generated-schemas/petstore-api.json');
    const schemaFileContent = fs.readFileSync(schemaFilePath, 'utf8');
    const petSchema = JSON.parse(schemaFileContent);

    // Validate the schema of the created pet response body
    chaiExpect(createdPetResponseBody).to.be.jsonSchema(petSchema);
  }
  finally {
    await petStoreApi.close();
  }
});

test('Retrieve a Pet', async () => {
  const baseURL = 'http://localhost:3000/v2';
  const petStoreApi = new PetStoreApi(baseURL);
  await petStoreApi.init();

  try {
    // Define a new pet
    const newPet: components['schemas']['Pet'] = {
      id: 1,
      name: 'Pet',
      status: 'available',
      category: {
          id: 0,
          name: 'Test Category',
      },
      tags: [
          {
              id: 0,
              name: 'Test Tag',
          },
      ],
      photoUrls: [
          'http://example.com/photo1.jpg',
          'http://example.com/photo2.jpg'
      ],
    };

    // Create the new pet using POST endpoint
    const createdPetResponse = await petStoreApi.addPet(newPet);
    const createdPet = await createdPetResponse.json();

    // Ensure the created pet has an ID assigned by the server
    expect(createdPet.id).not.toBeNull();
    expect(createdPet.id).not.toEqual(0);

    // Retrieve the created pet using GET endpoint
    const retrievedPetResponse = await petStoreApi.getPetById(createdPet.id);
    const retrievedPet = await retrievedPetResponse.json();

    // Ensure the retrieved pet matches the created pet
    expect(retrievedPet.id).toEqual(createdPet.id);
    expect(retrievedPet.name).toEqual(createdPet.name);
    expect(retrievedPet.status).toEqual(createdPet.status);
  }
  finally {
    await petStoreApi.close();
  }
});
