// lib/api/context.ts
import { request, APIRequestContext, APIResponse } from '@playwright/test';

export class APIContext {
    private requestContext: APIRequestContext | null = null;
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    async init() {
        this.requestContext = await request.newContext({ baseURL: this.baseURL });
    }

    async getRequestContext(): Promise<APIRequestContext> {
        if (!this.requestContext) {
            throw new Error('APIContext not initialized. Call init() first.');
        }
        return this.requestContext;
    }

    async get(url: string, params?: Record<string, string>): Promise<APIResponse> {
        if (!this.requestContext) {
            throw new Error('APIContext not initialized. Call init() first.');
        }
        return this.requestContext.get(url, { params });
    }

    async post(url: string, data?: any): Promise<APIResponse> {
        if (!this.requestContext) {
            throw new Error('APIContext not initialized. Call init() first.');
        }
        return this.requestContext.post(url, { data });
    }

    async put(url: string, data?: any): Promise<APIResponse> {
        if (!this.requestContext) {
            throw new Error('APIContext not initialized. Call init() first.');
        }
        return this.requestContext.put(url, { data });
    }

    async delete(url: string): Promise<APIResponse> {
        if (!this.requestContext) {
            throw new Error('APIContext not initialized. Call init() first.');
        }
        return this.requestContext.delete(url);
    }

    async close() {
        if (this.requestContext) {
            await this.requestContext.dispose();
        }
    }
}
