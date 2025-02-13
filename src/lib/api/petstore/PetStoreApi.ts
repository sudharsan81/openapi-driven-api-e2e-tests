// src/petstore/PetStoreApi.ts
import { APIContext } from '../request/context';
import { components, operations } from '../../../../openapi/generated/petstore-types';

export class PetStoreApi {
    private apiContext: APIContext;

    constructor(baseURL: string) {
        this.apiContext = new APIContext(baseURL);
    }

    async init() {
        await this.apiContext.init();
    }

    async close() {
        await this.apiContext.close();
    }

    async getPetById(petId: number): Promise<Response> {
        return await this.apiContext.get(`/pet/${petId}`);
    }

    async addPet(pet: components['schemas']['Pet']): Promise<Response> {  
        return await this.apiContext.post('/pet', pet);
    }

    async updatePet(pet: components['schemas']['Pet']): Promise<Response> {
        return await this.apiContext.put('/pet', pet);
    }

    async deletePet(petId: number): Promise<void> {
        await this.apiContext.delete(`/pet/${petId}`);
    }

    async findPetsByStatus(status: operations['findPetsByStatus']['parameters']['query']['status']): Promise<Response> {
        return await this.apiContext.get(`/pet/findByStatus`, { status });
    }

    async findPetsByTags(tags: operations['findPetsByTags']['parameters']['query']['tags']): Promise<Response> {
        return await this.apiContext.get(`/pet/findByTags`, { tags });
    }

    async uploadFile(petId: number, additionalMetadata: string, file: Buffer): Promise<Response> {
        return await this.apiContext.post(`/pet/${petId}/uploadImage`, {
            additionalMetadata,
            file,
        });
    }

    async getInventory(): Promise<Response> {
        return await this.apiContext.get('/store/inventory');
    }

    async placeOrder(order: components['schemas']['Order']): Promise<Response> {
        return await this.apiContext.post('/store/order', order);
    }

    async getOrderById(orderId: number): Promise<Response> {
        return await this.apiContext.get(`/store/order/${orderId}`);
    }

    async deleteOrder(orderId: number): Promise<void> {
        await this.apiContext.delete(`/store/order/${orderId}`);
    }

    async createUser(user: components['schemas']['User']): Promise<Response> {
        return await this.apiContext.post('/user', user);
    }

    async createUsersWithListInput(users: components['schemas']['User'][]): Promise<Response> {
        return await this.apiContext.post('/user/createWithList', users);
    }

    async loginUser(username: string, password: string): Promise<Response> {
        return await this.apiContext.get('/user/login', { username, password });
    }

    async logoutUser(): Promise<void> {
        await this.apiContext.get('/user/logout');
    }

    async getUserByName(username: string): Promise<Response> {
        return await this.apiContext.get(`/user/${username}`);
    }

    async updateUser(username: string, user: components['schemas']['User']): Promise<void> {
        await this.apiContext.put(`/user/${username}`, user);
    }

    async deleteUser(username: string): Promise<void> {
        await this.apiContext.delete(`/user/${username}`);
    }
}
