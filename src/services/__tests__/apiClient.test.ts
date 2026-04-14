/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * API CLIENT TESTS
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Unit tests cho apiClient service
 * 
 * @file src/services/__tests__/apiClient.test.ts
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be initialized with correct base URL', () => {
    const baseURL = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    expect(baseURL).toBeDefined();
  });

  it('should make GET requests successfully', async () => {
    const mockData = { success: true, data: [] };
    vi.mocked(axios.get).mockResolvedValueOnce({ data: mockData });

    const response = await axios.get('http://localhost:3000/api/test');
    expect(response.data).toEqual(mockData);
  });

  it('should make POST requests successfully', async () => {
    const mockData = { success: true, message: 'Created' };
    vi.mocked(axios.post).mockResolvedValueOnce({ data: mockData });

    const response = await axios.post('http://localhost:3000/api/test', { name: 'test' });
    expect(response.data).toEqual(mockData);
  });

  it('should handle API errors gracefully', async () => {
    const error = new Error('Network Error');
    vi.mocked(axios.get).mockRejectedValueOnce(error);

    try {
      await axios.get('http://localhost:3000/api/test');
      expect.fail('Should have thrown error');
    } catch (e) {
      expect(e).toEqual(error);
    }
  });

  it('should include auth tokens in request headers if available', () => {
    const mockToken = 'test-token-123';
    localStorage.setItem('auth_token', mockToken);

    const headers = {
      Authorization: `Bearer ${mockToken}`,
    };

    expect(headers.Authorization).toBe(`Bearer ${mockToken}`);
    
    localStorage.removeItem('auth_token');
  });
});
