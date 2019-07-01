const request = require('supertest');
const app = require('../../index.js');
const { users } = require('../../../../db/data');

afterAll(async () => {
  app.close(() => {});
});

describe('GET /api/v1/users', function () {
    it('respond with json containing a list of all users', async () => {
        const response = await request(app)
            .get('/api/v1/users')
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(200);
        expect(response.body[0].full_name).toBe('Ryan Balla')
    });
});

describe('POST /api/v1/users', function () {
    it('respond with json containing a newly created user', async () => {
        const payload = {
	        full_name: 'Second User'
         };
        const response = await request(app)
            .post('/api/v1/users')
            .send(payload)
            .set('Accept', 'application/json');
        const { ...rest } = response.body;

        expect(response.statusCode).toBe(201);
        expect(rest).toEqual({id: 2});
    });
    it('respond with error for missing fields', async () => {
        const payload = {};
        const response = await request(app)
            .post('/api/v1/users')
            .send(payload)
            .set('Accept', 'application/json');
        const { ...rest } = response.body;

        expect(response.statusCode).toBe(422);
        expect(rest).toEqual({error: "Expected format: { full_name: <String> }. You're missing a \"full_name\" property."});
    });
});
