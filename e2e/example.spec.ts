import { test, expect } from '@playwright/test';
import { PetStoreApi } from '../src/lib/api/petstore/PetStoreApi';
import { components } from '../openapi/generated-types/types';

test('Create a new Pet', async () => {
  const baseURL = 'http://localhost:3000/v2';
  const petStoreApi = new PetStoreApi(baseURL);
  await petStoreApi.init();
  try {
    // Create a new pet
    const newPet: components['schemas']['Pet'] = {
      id: 0,
      name: 'Test Pet',
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
    console.log('Created Pet:', createdPet);

    console.log('Response Status:', createdPetResponse.status);
    console.log('Response Body:', await createdPetResponse.text());

    // Ensure the created pet has an ID assigned by the server
    expect(createdPet.id).not.toBeNull();
    expect(createdPet.id).not.toEqual(0);
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
    console.log('Created Pet:', createdPet);

    console.log('Response Status:', createdPetResponse.status);
    console.log('Response Body:', await createdPetResponse.text());

    // Ensure the created pet has an ID assigned by the server
    expect(createdPet.id).not.toBeNull();
    expect(createdPet.id).not.toEqual(0);

    // Retrieve the created pet using GET endpoint
    const retrievedPetResponse = await petStoreApi.getPetById(createdPet.id);
    const retrievedPet = await retrievedPetResponse.json();
    console.log('Retrieved Pet:', retrievedPet);

    // Ensure the retrieved pet matches the created pet
    expect(retrievedPet.id).toEqual(createdPet.id);
    expect(retrievedPet.name).toEqual(createdPet.name);
    expect(retrievedPet.status).toEqual(createdPet.status);
  }
  finally {
    await petStoreApi.close();
  }
});
