const request = require('supertest');
const app = require('../../index.js');

afterAll(async () => {
  // app.close(() => {});
});

describe('GET /api/v1/photos', () => {
  it('respond with json containing a list of all photos', async () => {
    const response = await request(app)
      .get('/api/v1/photos')
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body[0].path).toBe('foo');
  });
});

describe('GET /api/v1/photos/:id', () => {
  xit('respond with json containing a single photo', async () => {
    const response = await request(app)
      .get('/api/v1/photos/1')
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body[0].path).toBe('bar');
  });
  xit('respond with error when using a non-id', async () => {
    const response = await request(app)
      .get('/api/v1/photos/notanid')
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(500);
    expect(rest).toHaveProperty('error');
  });
});

describe('POST /api/v1/photos', () => {
  it('respond with json containing a newly created photos', async () => {
    const payload = {
      path: 'new-path',
    };
    const response = await request(app)
      .post('/api/v1/photos')
      .send(payload)
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(201);
    expect(rest).toEqual({ id: 3 });
  });
  it('respond with error when submitting bad data', async () => {
    const payload = {
      bla: 'no bueno',
      path: '123',
      user_id: 3,
    };
    const response = await request(app)
      .post('/api/v1/photos')
      .send(payload)
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(500);
    expect(rest).toHaveProperty('error');
  });
  it('respond with error for missing fields', async () => {
    const payload = {};
    const response = await request(app)
      .post('/api/v1/photos')
      .send(payload)
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(422);
    expect(rest).toEqual({
      error:
        'Expected format: { path: <String> }. You\'re missing a "path" property.',
    });
  });
  it('respond with error when using a non-id', async () => {
    const response = await request(app)
      .post('/api/v1/photos/notanid')
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(404);
    expect(rest).toEqual({});
  });
});

describe('PUT /api/v1/photos', () => {
  it('respond with json containing updates to a photo', async () => {
    const payload = {
      id: 1,
      path: 'updated',
    };
    const response = await request(app)
      .put('/api/v1/photos')
      .send(payload)
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(200);
    expect(rest).toEqual({});
  });
  it('respond with error when using a non-id', async () => {
    const payload = {
      id: 'bla',
      path: 'bla',
    };
    const response = await request(app)
      .put('/api/v1/photos')
      .send(payload)
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(500);
    expect(rest).toHaveProperty('error');
  });
  it('respond with error when obmitting a required field', async () => {
    const payload = {
      id: 'bla',
    };
    const response = await request(app)
      .put('/api/v1/photos')
      .send(payload)
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(422);
    expect(rest).toEqual({
      error:
        'Expected format: { path: <String> }. You\'re missing a "path" property.',
    });
  });
});

describe('DELETE /api/v1/photos/:id', () => {
  it('respond with success when deleting a photo', async () => {
    const response = await request(app)
      .delete('/api/v1/photos/3')
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(200);
    expect(rest).toEqual({});
  });
  it('respond with error when using a non-id', async () => {
    const response = await request(app)
      .delete('/api/v1/photos/notanid')
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(500);
    expect(rest).toHaveProperty('error');
  });
});
