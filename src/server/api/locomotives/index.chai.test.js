process.env.NODE_ENV = 'test';
const chai = require('chai');

const should = chai.should();
const chaiHttp = require('chai-http');
const passportStub = require('passport-stub');

const server = require('../../index.js');

chai.use(chaiHttp);
passportStub.install(server);

afterEach(() => {
  passportStub.logout();
});

describe('POST /api/v1/locomotives', () => {
  it('responds with json for a new locomotive', done => {
    passportStub.login({
      id: 1,
      password: 'test',
      username: 'rballa',
    });
    chai
      .request(server)
      .post('/api/v1/locomotives')
      .send({
        engine_number: 412,
        is_operational: true,
        location: 'Home',
        road: 'BN3',
        user_id: 1,
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.eql({ id: 4 });
        res.redirects.length.should.eql(0);
        res.status.should.eql(201);
        res.type.should.eql('application/json');
        done();
      });
  });
  it('respond with error when submitting bad data', done => {
    passportStub.login({
      id: 1,
      password: 'test',
      username: 'rballa',
    });
    chai
      .request(server)
      .post('/api/v1/locomotives')
      .send({
        badData: 'test',
        engine_number: 412,
        is_operational: true,
        location: 'Home',
        road: 'BN3',
        user_id: 1,
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.include.keys('error');
        res.redirects.length.should.eql(0);
        res.status.should.eql(500);
        res.type.should.eql('application/json');
        done();
      });
  });
  it('respond with error when submitting missing data', done => {
    passportStub.login({
      id: 1,
      password: 'test',
      username: 'rballa',
    });
    chai
      .request(server)
      .post('/api/v1/locomotives')
      .send({
        engine_number: '',
        is_operational: true,
        location: 'Home',
        road: 'BN3',
        user_id: 1,
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.include.keys('error');
        res.redirects.length.should.eql(0);
        res.status.should.eql(500);
        res.type.should.eql('application/json');
        done();
      });
  });
  it('respond with error when submitting missing data', done => {
    passportStub.login({
      id: 1,
      password: 'test',
      username: 'rballa',
    });
    chai
      .request(server)
      .post('/api/v1/locomotives')
      .send({
        engine_number: '',
        is_operational: true,
        location: 'Home',
        user_id: 1,
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.include.keys('error');
        res.redirects.length.should.eql(0);
        res.status.should.eql(422);
        res.type.should.eql('application/json');
        done();
      });
  });
  it('respond with error when using a non-id', done => {
    passportStub.login({
      id: 1,
      password: 'test',
      username: 'rballa',
    });
    chai
      .request(server)
      .post('/api/v1/locomotives')
      .send({
        engine_number: 'b;a',
        is_operational: true,
        location: 'Home',
        road: 'BN3',
        user_id: 1,
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.include.keys('error');
        res.redirects.length.should.eql(0);
        res.status.should.eql(500);
        res.type.should.eql('application/json');
        done();
      });
  });
  it("respond with error when submitting to someone else's account", done => {
    passportStub.login({
      id: 1,
      password: 'test',
      username: 'rballa',
    });
    chai
      .request(server)
      .post('/api/v1/locomotives')
      .send({
        engine_number: 'b;a',
        is_operational: true,
        location: 'Home',
        road: 'BN3',
        user_id: 2,
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.eql({});
        res.redirects.length.should.eql(0);
        res.status.should.eql(403);
        res.type.should.eql('application/json');
        done();
      });
  });
});
describe('GET /api/v1/locomotives/', () => {
  it('responds with json containing all locomotives', done => {
    passportStub.login({
      id: 1,
      password: 'test',
      username: 'rballa',
    });
    chai
      .request(server)
      .get('/api/v1/locomotives')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.length.should.eql(3);
        res.redirects.length.should.eql(0);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        done();
      });
  });
  it('responds with json containing for a single locomotive', done => {
    passportStub.login({
      id: 1,
      password: 'test',
      username: 'rballa',
    });
    chai
      .request(server)
      .get('/api/v1/locomotives/1')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.include.keys('locomotive');
        res.redirects.length.should.eql(0);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        done();
      });
  });
  it("responds with an error if accesing someone else's locomotive", done => {
    passportStub.login({
      id: 1,
      password: 'test',
      username: 'rballa',
    });
    chai
      .request(server)
      .get('/api/v1/locomotives/3')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.eql({});
        res.redirects.length.should.eql(0);
        res.status.should.eql(403);
        res.type.should.eql('application/json');
        done();
      });
  });
  it('responds with an error if accesing a non-existant locomotive', done => {
    passportStub.login({
      id: 1,
      password: 'test',
      username: 'rballa',
    });
    chai
      .request(server)
      .get('/api/v1/locomotives/1233')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.eql({ error: {} });
        res.redirects.length.should.eql(0);
        res.status.should.eql(500);
        res.type.should.eql('application/json');
        done();
      });
  });
});
describe('PUT /api/v1/locomotives/', () => {
  it('responds with json containing an updated locomotive', done => {
    passportStub.login({
      id: 1,
      password: 'test',
      username: 'rballa',
    });
    chai
      .request(server)
      .put('/api/v1/locomotives/1')
      .send({
        engine_number: 412,
        is_operational: true,
        location: 'Home',
        road: 'BN2',
        user_id: 1,
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.eql(1);
        res.redirects.length.should.eql(0);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        done();
      });
  });
  it("responds with an error when updating someone else's locomotive", done => {
    passportStub.login({
      id: 2,
      password: 'test',
      username: 'second',
    });
    chai
      .request(server)
      .put('/api/v1/locomotives/4')
      .send({
        engine_number: 412,
        is_operational: true,
        location: 'Home',
        road: 'BN2',
        user_id: 1,
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.eql({});
        res.redirects.length.should.eql(0);
        res.status.should.eql(403);
        res.type.should.eql('application/json');
        done();
      });
  });
});
describe('DELETE /api/v1/locomotives/:id', () => {
  it('respond with success when deleting a locomotive', done => {
    passportStub.login({
      id: 1,
      password: 'test',
      username: 'rballa',
    });
    chai
      .request(server)
      .delete('/api/v1/locomotives/1')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.eql(1);
        res.redirects.length.should.eql(0);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        done();
      });
  });
  it("respond with error when deleting someone else's locomotive", done => {
    passportStub.login({
      id: 2,
      password: 'test',
      username: 'second',
    });
    chai
      .request(server)
      .delete('/api/v1/locomotives/1')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.eql({});
        res.redirects.length.should.eql(0);
        res.status.should.eql(403);
        res.type.should.eql('application/json');
        done();
      });
  });
  it("respond with error when deleting someone else's locomotive", done => {
    passportStub.login({
      id: 2,
      password: 'test',
      username: 'second',
    });
    chai
      .request(server)
      .delete('/api/v1/locomotives/4')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.eql({});
        res.redirects.length.should.eql(0);
        res.status.should.eql(403);
        res.type.should.eql('application/json');
        done();
      });
  });
});
