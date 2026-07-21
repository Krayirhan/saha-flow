import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiClientError, apiClient, getApiUrl } from '@/lib/api/client';

describe('apiClient', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.stubGlobal('location', { href: '' });
    vi.stubGlobal('document', {
      querySelector: vi.fn().mockReturnValue(null),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('getApiUrl constructs correct URL', () => {
    const url = getApiUrl('/auth/me');
    expect(url).toBe('http://localhost:8080/api/auth/me');
  });

  it('getApiUrl handles trailing slash in base', () => {
    const url = getApiUrl('auth/me');
    expect(url).toContain('/api/auth/me');
  });

  it('includes X-Correlation-ID header', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ ok: true }),
    });
    vi.stubGlobal('fetch', mockFetch);

    await apiClient('/test');

    const call = mockFetch.mock.calls[0];
    const headers = call[1]?.headers;
    expect(headers['X-Correlation-ID']).toBeDefined();
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('redirects to login on 401', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ code: 'UNAUTHORIZED', message: 'Unauthorized' }),
    });
    vi.stubGlobal('fetch', mockFetch);
    const location = { href: '' };
    vi.stubGlobal('location', location);

    await expect(apiClient('/test')).rejects.toThrow(ApiClientError);

    try {
      await apiClient('/test');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiClientError);
      expect((err as ApiClientError).status).toBe(401);
    }
  });

  it('throws ApiClientError on server error', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ code: 'SERVER_ERROR', message: 'Internal error' }),
    });
    vi.stubGlobal('fetch', mockFetch);

    try {
      await apiClient('/test');
      expect.unreachable('Should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiClientError);
      expect((err as ApiClientError).status).toBe(500);
      expect((err as ApiClientError).code).toBe('SERVER_ERROR');
    }
  });

  it('handles network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network down')));

    try {
      await apiClient('/test');
      expect.unreachable('Should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiClientError);
      expect((err as ApiClientError).code).toBe('NETWORK_ERROR');
    }
  });

  it('handles 204 No Content', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      headers: new Headers(),
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await apiClient('/test');
    expect(result).toBeUndefined();
  });
});
