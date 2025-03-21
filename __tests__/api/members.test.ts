import { createMocks } from 'node-mocks-http';
import getMembers from '../../src/pages/api/member/[id]';
import getMemberById from '../../src/pages/api/member/exclude/[id]';
import fs from 'fs/promises';

jest.mock('fs/promises');

describe('Members API', () => {
  const mookMembers = [
    {
        "id": "6510405482",
        "name": "Natdanai Pinaves"
    },
    {
        "id": "6510405814",
        "name": "Sornchai Somsakul"
    },
    {
        "id": "6610451010",
        "name": "Pipatpol Wijitchayanon"
    }
  ];

  beforeEach(() => {
    jest.resetAllMocks();
    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mookMembers));
  });

  describe('GET /api/member/exclude/[id] endpoint', () => {
    test('should return filtered students list without specified ID', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { id: '6510405482' },
      });

      await getMemberById(req, res);

      expect(res._getStatusCode()).toBe(200);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(200);
      expect(responseData.message).toBeNull();
      console.log(responseData.data);
      expect(responseData.data).toHaveLength(2);
      expect(responseData.data.find((s: { id: string }) => s.id === '6510405482')).toBeUndefined();
      expect(responseData.data.find((s: { id: string }) => s.id === '6510405814')).toBeDefined();
      expect(responseData.data.find((s: { id: string }) => s.id === '6610451010')).toBeDefined();
    });

    test('should return 400 when ID is invalid', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { id: 'invalid' },
      });

      await getMembers(req, res);

      expect(res._getStatusCode()).toBe(400);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(400);
      expect(responseData.message).toBe('Invalid ID');
      expect(responseData.data).toBeNull();
    });

    test('should return 400 when ID is missing', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {},
      });

      await getMembers(req, res);

      expect(res._getStatusCode()).toBe(400);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(400);
      expect(responseData.message).toBe('Invalid ID');
      expect(responseData.data).toBeNull();
    });

    test('should return 404 when file data is empty', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('');
      
      const { req, res } = createMocks({
        method: 'GET',
        query: { id: '6510405482' },
      });

      await getMembers(req, res);

      expect(res._getStatusCode()).toBe(404);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(404);
      expect(responseData.message).toBe('Data not found');
      expect(responseData.data).toBeNull();
    });

    test('should return 405 for non-GET methods', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { id: '6510405482' },
      });

      await getMembers(req, res);

      expect(res._getStatusCode()).toBe(405);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(405);
      expect(responseData.message).toBe('Method Not Allowed');
      expect(responseData.data).toBeNull();
    });

    test('should return 500 when file reading fails', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('File read error'));
      
      const { req, res } = createMocks({
        method: 'GET',
        query: { id: '6510405482' },
      });

      await getMembers(req, res);

      expect(res._getStatusCode()).toBe(500);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(500);
      expect(responseData.message).toBe('Server Error');
      expect(responseData.data).toBeNull();
    });
  });

  describe('GET /api/member/[id] endpoint', () => {
    test('should return a specific student by ID', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { id: '6510405814' },
      });

      await getMembers(req, res);

      expect(res._getStatusCode()).toBe(200);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(200);
      expect(responseData.message).toBeNull();
      expect(responseData.data).toEqual({ id: '6510405814', name: 'Sornchai Somsakul' });
    });

    test('should return 404 when student is not found', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { id: '999' },
      });

      await getMemberById(req, res);

      expect(res._getStatusCode()).toBe(404);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(404);
      expect(responseData.message).toBe('Student not found');
      expect(responseData.data).toBeNull();
    });

    test('should return 400 when ID is invalid', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { id: 'invalid' },
      });

      await getMemberById(req, res);

      expect(res._getStatusCode()).toBe(400);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(400);
      expect(responseData.message).toBe('Invalid ID');
      expect(responseData.data).toBeNull();
    });

    test('should return 400 when ID is missing', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {},
      });

      await getMemberById(req, res);

      expect(res._getStatusCode()).toBe(400);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(400);
      expect(responseData.message).toBe('Invalid ID');
      expect(responseData.data).toBeNull();
    });

    test('should return 404 when file data is empty', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('');
      
      const { req, res } = createMocks({
        method: 'GET',
        query: { id: '6510405814' },
      });

      await getMemberById(req, res);

      expect(res._getStatusCode()).toBe(404);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(404);
      expect(responseData.message).toBe('Data not found');
      expect(responseData.data).toBeNull();
    });

    test('should return 405 for non-GET methods', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { id: '6510405814' },
      });

      await getMemberById(req, res);

      expect(res._getStatusCode()).toBe(405);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(405);
      expect(responseData.message).toBe('Method Not Allowed');
      expect(responseData.data).toBeNull();
    });

    test('should return 500 when file reading fails', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('File read error'));
      
      const { req, res } = createMocks({
        method: 'GET',
        query: { id: '6510405814' },
      });

      await getMemberById(req, res);

      expect(res._getStatusCode()).toBe(500);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(500);
      expect(responseData.message).toBe('Server Error');
      expect(responseData.data).toBeNull();
    });
  });
});