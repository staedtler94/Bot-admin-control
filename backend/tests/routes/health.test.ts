import request from 'supertest';
import { createApp } from '../../src/app';

describe('GET /health', () => {
  const app = createApp();

  it('returns a healthy status payload', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    // Normalise the timestamp so the snapshot is deterministic.
    const body = { ...res.body, timestamp: '<ISO_TIMESTAMP>' };
    expect(body).toMatchSnapshot();
  });
});

describe('404 handler', () => {
  const app = createApp();

  it('returns a structured 404 for unknown routes', async () => {
    const res = await request(app).get('/api/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toMatchSnapshot();
  });
});
