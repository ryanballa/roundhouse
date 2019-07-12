const request = require('supertest');
const app = require('../../index.js');
const { railcars } = require('../../../../db/data');

afterAll(async () => {
  app.close(() => {});
});

describe('GET /api/v1/railcars', () => {
  it('respond with json containing a list of all railcars', async () => {
    const response = await request(app)
      .get('/api/v1/railcars')
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body[0].road).toBe('BN');
  });
});

describe('GET /api/v1/railcars/:id', () => {
  it('respond with json containing a single railcar', async () => {
    const response = await request(app)
      .get('/api/v1/railcars/1')
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body[0].road).toBe('BN');
  });
  it('respond with error when using a non-id', async () => {
    const response = await request(app)
      .get('/api/v1/railcars/notanid')
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(500);
    expect(rest).toHaveProperty('error');
  });
});

describe('POST /api/v1/railcars', () => {
  it('respond with json containing a newly created railcars', async () => {
    const payload = {
      car_number: 123,
      location: 'Studio',
      road: 'BN',
      user_id: 1,
    };
    const response = await request(app)
      .post('/api/v1/railcars')
      .send(payload)
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(201);
    expect(rest).toEqual({ id: 3 });
  });
  it('respond with error when submitting bad data', async () => {
    const payload = {
      bla: 'no bueno',
      car_number: '123',
      location: 'Studio',
      road: 'BN',
      user_id: 3,
    };
    const response = await request(app)
      .post('/api/v1/railcars')
      .send(payload)
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(500);
    expect(rest).toHaveProperty('error');
  });
  it('respond with error for missing fields', async () => {
    const payload = {};
    const response = await request(app)
      .post('/api/v1/railcars')
      .send(payload)
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(422);
    expect(rest).toEqual({
      error:
        'Expected format: { car_number: <String>, location: <String>, road: <String> }. You\'re missing a "car_number" property.',
    });
  });
  it('respond with error when using a non-id', async () => {
    const response = await request(app)
      .post('/api/v1/railcars/notanid')
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(404);
    expect(rest).toEqual({});
  });
});

describe('PUT /api/v1/railcars/:id', () => {
  it('respond with json containing updates to a railcar', async () => {
    const payload = {
      road: 'BN1',
    };
    const response = await request(app)
      .put('/api/v1/railcars/3')
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
      .put('/api/v1/railcars/notanid')
      .send(payload)
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(500);
    expect(rest).toHaveProperty('error');
  });
});

describe('DELETE /api/v1/railcars/:id', () => {
  it('respond with success when deleting a railcar', async () => {
    const response = await request(app)
      .delete('/api/v1/railcars/3')
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(200);
    expect(rest).toEqual({});
  });
  it('respond with error when using a non-id', async () => {
    const response = await request(app)
      .delete('/api/v1/railcars/notanid')
      .set('Accept', 'application/json');
    const { ...rest } = response.body;

    expect(response.statusCode).toBe(500);
    expect(rest).toHaveProperty('error');
  });
});
