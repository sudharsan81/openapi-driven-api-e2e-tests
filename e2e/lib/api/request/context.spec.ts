import { test, expect, APIRequestContext, APIResponse } from '@playwright/test';
import { APIContext } from '../../../../src/lib/api/request/context';

// Define a type for our manual spy
type ManualSpy = {
  (...args: any[]): any;
  called: boolean;
  calls: any[][];
  reset: () => void;
  mockResolvedValue: (value: any) => void;
  mockReturnValue: (value: any) => any;
  resolveValue?: any;
  returnValue?: any;
};

const createManualSpy = (name?: string): ManualSpy => {
  const spy: ManualSpy = (...args: any[]): any => {
    spy.called = true;
    spy.calls.push(args);
    if (spy.resolveValue) return Promise.resolve(spy.resolveValue);
    if (spy.returnValue) return spy.returnValue;
    return Promise.resolve(); // Default mock promise resolution
  };
  spy.called = false;
  spy.calls = [];
  spy.reset = () => {
    spy.called = false;
    spy.calls = [];
    spy.resolveValue = undefined;
    spy.returnValue = undefined;
  };
  spy.mockResolvedValue = (value: any) => {
    spy.resolveValue = value;
  };
  spy.mockReturnValue = (value: any) => {
    spy.returnValue = value;
  };
  return spy;
};

// Mock APIRequestContext methods
const mockAPIRequestContextGet = createManualSpy('get');
const mockAPIRequestContextPost = createManualSpy('post');
const mockAPIRequestContextPut = createManualSpy('put');
const mockAPIRequestContextDelete = createManualSpy('delete');
const mockAPIRequestContextDispose = createManualSpy('dispose');

const mockPlaywrightRequest = {
  newContext: async (options?: any): Promise<APIRequestContext> => {
    // Return a mock APIRequestContext
    return {
      get: mockAPIRequestContextGet,
      post: mockAPIRequestContextPost,
      put: mockAPIRequestContextPut,
      delete: mockAPIRequestContextDelete,
      dispose: mockAPIRequestContextDispose,
      fetch: (() => {}) as any, // Add other methods if APIContext uses them
      head: (() => {}) as any,
      patch: (() => {}) as any,
      storageState: (() => {}) as any,
      patchOption: (() => {}) as any,
    } as unknown as APIRequestContext; // Cast to unknown first for type compatibility
  },
};

// Monkey-patch the request object from @playwright/test ONLY for this test suite
// This is a bit hacky. A cleaner way would be dependency injection into APIContext.
const playwrightTest = require('@playwright/test');
const originalRequest = playwrightTest.request;
playwrightTest.request = mockPlaywrightRequest;

test.describe('APIContext', () => {
  let apiContext: APIContext;
  const baseURL = 'http://localhost:3000';

  test.beforeEach(async () => {
    // Reset spies before each test
    mockAPIRequestContextGet.reset();
    mockAPIRequestContextPost.reset();
    mockAPIRequestContextPut.reset();
    mockAPIRequestContextDelete.reset();
    mockAPIRequestContextDispose.reset();

    apiContext = new APIContext(baseURL);
    // The original playwrightTest.request is modified here for subsequent newContext calls
  });

  test.afterEach(async () => {
    await apiContext.close();
    // Restore original request object after all tests in this describe block if needed,
    // but for simplicity, we're leaving it patched for other describe blocks in the same file.
    // If this was the only describe block, we could do: playwrightTest.request = originalRequest;
  });

  test('should initialize the request context', async () => {
    await apiContext.init();
    expect(mockAPIRequestContextDispose.called).toBe(false);
    const context = await apiContext.getRequestContext();
    expect(context).toBeDefined();
    // Check if the context returned is our mock (optional, but good for sanity)
    expect(context.get).toBe(mockAPIRequestContextGet);
  });

  test('should throw an error if getRequestContext is called before init', async () => {
    await expect(apiContext.getRequestContext()).rejects.toThrowError(
      'APIContext not initialized. Call init() first.',
    );
  });

  test('should perform a GET request', async () => {
    await apiContext.init();
    const mockResponsePayload = { message: 'GET success' };
    // Simulate a Playwright APIResponse structure
    const mockResponse = {
      ok: () => true,
      status: () => 200,
      json: () => Promise.resolve(mockResponsePayload),
    } as unknown as APIResponse;
    mockAPIRequestContextGet.mockReturnValue(mockResponse); // Use mockReturnValue for Playwright responses

    const response = await apiContext.get('/test');
    expect(mockAPIRequestContextGet.called).toBe(true);
    expect(mockAPIRequestContextGet.calls[0][0]).toBe('/test');
    expect(mockAPIRequestContextGet.calls[0][1]).toEqual({ params: undefined });
    expect(response).toEqual(mockResponse);
  });

  test('should perform a POST request', async () => {
    await apiContext.init();
    const mockResponsePayload = { message: 'POST success' };
    const mockResponse = {
      ok: () => true,
      status: () => 201,
      json: () => Promise.resolve(mockResponsePayload),
    } as unknown as APIResponse;
    mockAPIRequestContextPost.mockReturnValue(mockResponse);
    const postData = { key: 'value' };

    const response = await apiContext.post('/test', postData);
    expect(mockAPIRequestContextPost.called).toBe(true);
    expect(mockAPIRequestContextPost.calls[0][0]).toBe('/test');
    expect(mockAPIRequestContextPost.calls[0][1]).toEqual({ data: postData });
    expect(response).toEqual(mockResponse);
  });

  test('should perform a PUT request', async () => {
    await apiContext.init();
    const mockResponsePayload = { message: 'PUT success' };
    const mockResponse = {
      ok: () => true,
      status: () => 200,
      json: () => Promise.resolve(mockResponsePayload),
    } as unknown as APIResponse;
    mockAPIRequestContextPut.mockReturnValue(mockResponse);
    const putData = { key: 'updatedValue' };

    const response = await apiContext.put('/test', putData);
    expect(mockAPIRequestContextPut.called).toBe(true);
    expect(mockAPIRequestContextPut.calls[0][0]).toBe('/test');
    expect(mockAPIRequestContextPut.calls[0][1]).toEqual({ data: putData });
    expect(response).toEqual(mockResponse);
  });

  test('should perform a DELETE request', async () => {
    await apiContext.init();
    const mockResponse = {
      ok: () => true,
      status: () => 204,
    } as unknown as APIResponse; // No json body for 204
    mockAPIRequestContextDelete.mockReturnValue(mockResponse);

    const response = await apiContext.delete('/test');
    expect(mockAPIRequestContextDelete.called).toBe(true);
    expect(mockAPIRequestContextDelete.calls[0][0]).toBe('/test');
    expect(response).toEqual(mockResponse);
  });

  test('should close the request context', async () => {
    await apiContext.init();
    await apiContext.close();
    expect(mockAPIRequestContextDispose.called).toBe(true);
  });

  test('should throw an error if GET request is called before init', async () => {
    await expect(apiContext.get('/test')).rejects.toThrowError(
      'APIContext not initialized. Call init() first.',
    );
  });

  test('should throw an error if POST request is called before init', async () => {
    await expect(apiContext.post('/test')).rejects.toThrowError(
      'APIContext not initialized. Call init() first.',
    );
  });

  test('should throw an error if PUT request is called before init', async () => {
    await expect(apiContext.put('/test')).rejects.toThrowError(
      'APIContext not initialized. Call init() first.',
    );
  });

  test('should throw an error if DELETE request is called before init', async () => {
    await expect(apiContext.delete('/test')).rejects.toThrowError(
      'APIContext not initialized. Call init() first.',
    );
  });
});

// Restore original request after all describe blocks in this file are done
// test.afterAll(async () => {
//   playwrightTest.request = originalRequest;
// });
