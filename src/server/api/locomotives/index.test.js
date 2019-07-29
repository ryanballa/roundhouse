const request = require('supertest');
const passportStub = require('passport-stub');
const app = require('../../index.js');

passportStub.install(app);

afterAll(async () => {
  // app.close(() => {});
});

describe('GET /api/v1/locomotives', () => {
  it('respond with json containing a list of all locomotives', async () => {
    passportStub.login({
      password: 'test',
      username: 'rballa',
    });
    const response = await request(app)
      .get('/api/v1/locomotives')
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body[0].road).toBe('BN');
  });
});

describe('GET /api/v1/locomotives/:id', () => {
  it('respond with json containing a single locomotive', async () => {
    const response = await request(app)
      .get('/api/v1/locomotives/1')
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body.locomotive[0].road).toBe('BN');
  });
  it('respond with error when using a non-id', async () => {
    const response = await request(app)
      .get('/api/v1/locomotives/notanid')
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(500);
    expect(rest).toHaveProperty('error');
  });
});

describe('POST /api/v1/locomotives', () => {
  it('respond with json containing a newly created locomotive', async () => {
    const payload = {
      location: 'Studio',
      road: 'BN',
      user_id: 1,
    };
    const response = await request(app)
      .post('/api/v1/locomotives')
      .send(payload)
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(201);
    expect(rest).toEqual({ id: 3 });
  });
  it('respond with error when submitting bad data', async () => {
    const payload = {
      bla: 'no bueno',
      location: 'Studio',
      road: 'BN',
      user_id: 3,
    };
    const response = await request(app)
      .post('/api/v1/locomotives')
      .send(payload)
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(500);
    expect(rest).toHaveProperty('error');
  });
  it('respond with error for missing fields', async () => {
    const payload = {};
    const response = await request(app)
      .post('/api/v1/locomotives')
      .send(payload)
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(422);
    expect(rest).toEqual({
      error:
        'Expected format: { location: <String>, road: <String> }. You\'re missing a "road" property.',
    });
  });
  it('respond with error when using a non-id', async () => {
    const response = await request(app)
      .post('/api/v1/locomotives/notanid')
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(404);
    expect(rest).toEqual({});
  });
});

describe('PUT /api/v1/locomotives/:id', () => {
  it('respond with json containing updates to a locomotive', async () => {
    const payload = {
      road: 'BN1',
    };
    const response = await request(app)
      .put('/api/v1/locomotives/3')
      .send(payload)
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(200);
    expect(rest).toEqual({});
  });
  it('respond with error when using a non-id', async () => {
    const payload = {
      road: 'BN1',
    };
    const response = await request(app)
      .put('/api/v1/locomotives/notanid')
      .send(payload)
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(500);
    expect(rest).toHaveProperty('error');
  });
});

describe('DELETE /api/v1/locomotives/:id', () => {
  it('respond with success when deleting a locomotive', async () => {
    const response = await request(app)
      .delete('/api/v1/locomotives/3')
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(200);
    expect(rest).toEqual({});
  });
  it('respond with error when using a non-id', async () => {
    const response = await request(app)
      .delete('/api/v1/locomotives/notanid')
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(500);
    expect(rest).toHaveProperty('error');
  });
});
