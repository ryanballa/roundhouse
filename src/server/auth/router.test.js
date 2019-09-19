process.env.NODE_ENV = 'test';
const chai = require('chai');

const should = chai.should();
const chaiHttp = require('chai-http');
const passportStub = require('passport-stub');

const server = require('../index.js');

chai.use(chaiHttp);
passportStub.install(server);

afterEach(() => {
  passportStub.logout();
});

describe('POST /auth/register', () => {
  it('should throw an error if a user is logged in', done => {
    passportStub.login({
      password: 'test',
      username: 'rballa',
    });
    chai
      .request(server)
      .post('/auth/register')
      .send({
        password: 'test',
        username: 'third',
      })
      .end((err, res) => {
        res.redirects.length.should.eql(0);
        res.status.should.eql(401);
        res.type.should.eql('application/json');
        res.body.status.should.eql('You are already logged in');
        done();
      });
  });
  it('should throw an error if missing values', done => {
    chai
      .request(server)
      .post('/auth/register')
      .send({
        password: 'test',
      })
      .end((err, res) => {
        res.redirects.length.should.eql(0);
        res.status.should.eql(500);
        res.type.should.eql('application/json');
        res.body.status.name.should.eql('error');
        done();
      });
  });
  it('should create a new user', done => {
    chai
      .request(server)
      .post('/auth/register')
      .send({
        password: 'test',
        username: 'fourth',
      })
      .end((err, res) => {
        res.redirects.length.should.eql(0);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.status.should.eql('success');
        done();
      });
  });
});

describe('GET /auth/logout', () => {
  it('should logout a user', done => {
    passportStub.login({
      id: 1,
      password: 'test',
      username: 'rballa',
    });
    chai
      .request(server)
      .get('/auth/logout')
      .end((err, res) => {
        should.not.exist(err);
        res.redirects.length.should.eql(0);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.status.should.eql('success');
        done();
      });
  });
  it('should throw an error if a user is not logged in', done => {
    chai
      .request(server)
      .get('/auth/logout')
      .end((err, res) => {
        res.redirects.length.should.eql(0);
        res.status.should.eql(401);
        res.type.should.eql('application/json');
        res.body.status.should.eql('Please log in');
        done();
      });
  });
});
describe('GET /auth/login', () => {
  it('should login a user', done => {
    chai
      .request(server)
      .post('/auth/login')
      .send({
        password: 'test',
        username: 'rballa',
      })
      .end((err, res) => {
        should.not.exist(err);
        res.redirects.length.should.eql(0);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.status.should.include.keys('username');
        done();
      });
  });
  it('should not login an unregistered user', done => {
    chai
      .request(server)
      .post('/auth/login')
      .send({
        password: 'johnson123',
        username: 'michael',
      })
      .end((err, res) => {
        res.redirects.length.should.eql(0);
        res.status.should.eql(404);
        res.type.should.eql('application/json');
        res.body.status.should.eql('User not found');
        done();
      });
  });
  it('should not login a user with bad password', done => {
    chai
      .request(server)
      .post('/auth/login')
      .send({
        password: 'johnson123',
        username: 'rballa',
      })
      .end((err, res) => {
        res.redirects.length.should.eql(0);
        res.status.should.eql(404);
        res.type.should.eql('application/json');
        res.body.status.should.eql('User not found');
        done();
      });
  });
  it('should throw an error if a user is logged in', done => {
    passportStub.login({
      password: 'test',
      username: 'rballa',
    });
    chai
      .request(server)
      .post('/auth/login')
      .send({
        password: 'test',
        username: 'rballa',
      })
      .end((err, res) => {
        res.redirects.length.should.eql(0);
        res.status.should.eql(401);
        res.type.should.eql('application/json');
        res.body.status.should.eql('You are already logged in');
        done();
      });
  });
  it('should throw an error if missing values', done => {
    chai
      .request(server)
      .post('/auth/login')
      .send({
        password: 'test',
      })
      .end((err, res) => {
        res.redirects.length.should.eql(0);
        res.status.should.eql(404);
        res.type.should.eql('application/json');
        res.body.status.should.eql('User not found');
        done();
      });
  });
});
