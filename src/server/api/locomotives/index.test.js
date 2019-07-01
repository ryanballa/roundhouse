const request = require('supertest');
const app = require('../../index.js');
const { locomotives } = require('../../../../db/data');

afterAll(async () => {
  app.close(() => {});
});

describe('GET /api/v1/locomotives', function () {
    it('respond with json containing a list of all locomotives', async () => {
        const response = await request(app)
            .get('/api/v1/locomotives')
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(200);
        expect(response.body[0].user).toBe('Ryan Balla')
    });
});

describe('GET /api/v1/locomotives/:id', function () {
    it('respond with json containing a single locomotive', async () => {
        const response = await request(app)
            .get('/api/v1/locomotives/1')
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(200);
        expect(response.body[0].road).toBe('BN')
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

describe('POST /api/v1/locomotives', function () {
    it('respond with json containing a newly created locomotive', async () => {
        const payload = {
	         road: "BN",
	         location: "Studio",
        	 user_id: 1,
         };
        const response = await request(app)
            .post('/api/v1/locomotives')
            .send(payload)
            .set('Accept', 'application/json');
        const { ...rest } = response.body;

        expect(response.statusCode).toBe(201);
        expect(rest).toEqual({id: 3});
    });
    it('respond with error when submitting bad data', async () => {
        const payload = {
          road: "BN",
          location: "Studio",
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
        expect(rest).toEqual({error: "Expected format: { location: <String>, road: <String> }. You're missing a \"road\" property."});
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

describe('PUT /api/v1/locomotives/:id', function () {
    it('respond with json containing updates to a locomotive', async () => {
        const payload = {
	         road: "BN1",
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
	         road: "BN1",
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

  describe('DELETE /api/v1/locomotives/:id', function () {
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
