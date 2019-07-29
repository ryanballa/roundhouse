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

describe('GET /api/v1/locomotives', () => {
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
      .get('/api/v1/locomotives')
      .end((err, res) => {
        should.exist(res.body.data.error);
        res.redirects.length.should.eql(0);
        res.status.should.eql(401);
        res.type.should.eql('application/json');
        res.body.data.error.should.eql('User is not authorized.');
        done();
      });
  });
});
