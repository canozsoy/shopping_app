import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import 'mocha';

chai.use(chaiHttp);
const { expect, request } = chai;

const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ1MzZmZWI1LTVlMzctNGFkMC04ZDRlLWUzNzA2ZWM3NzViOSIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MzgxNzU1ODQsImV4cCI6MTYzODI2MTk4NH0.DuIF9fqVbbhS6I0qZLvVq6JXJfmOLfRoA1cn4SicmX0';
const customerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBiMGNkOTFiLTUwNDUtNDg3Mi1hMWFiLTBjYjYwMDk3NTdjMiIsInVzZXJuYW1lIjoidGVzdCIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTYzODE3MjQ5MywiZXhwIjoxNjM4MjU4ODkzfQ.Y5-Sjpk__h03FUrpEhkg6zME_y1APaPOnk3ypW70uPw';

const validBody = [
  { username: 'testadmin', password: 'test', role: 'customer' },
  { username: 'testtestadmin', password: 'testtest', role: 'customer' },
  { username: 'adlkfndlkmadmin', password: 'sdlfns', role: 'customer' },
];

const invalidBody = [
  {},
  { username: 'test' },
  { password: 'test' },
  { username: 'test test', password: 'test' },
  { username: 'test', password: 'test test' },
  { username: 'te', password: 'test' },
  { username: 'test', password: 'te' },
  { username: 'testtesttesttesttesttesttesttesttest', password: 'test' },
  { username: 'testb', password: 'testtesttesttesttesttesttesttesttest' },
  { username: 'testa', password: 'testtesttesttesttesttesttesttesttest', role: 'adf' },
  { username: 'testasd', password: 'testtesttesttesttesttesttesttesttest', role: 1 },
  { username: 'test', password: 'testtesttesttesttesttesttesttesttest', role: 'customer' },
];

describe('GET /user-admin', () => {
  it('Should return 401 (no token) ', (done) => {
    request(app).get('/user-admin').then((res) => {
      expect(res.status).to.eql(401);
      expect(res.body).to.include.keys(['error']);
      done();
    });
  });
  it('Should return 403 (customer token)', (done) => {
    request(app).get('/user-admin')
      .set({ Authorization: `Bearer ${customerToken}` })
      .then((res) => {
        expect(res.status).to.eql(403);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('Should return 200', (done) => {
    request(app).get('/user-admin')
      .set({ Authorization: `Bearer ${adminToken}` })
      .then((res) => {
        expect(res.status).to.eql(200);
        expect(res.body).to.include.keys('message', 'users');
        expect(res.body.users).to.be.an('array');
        done();
      });
  });
});

describe('POST /user-admin', () => {
  it('Should return 401  (no token)', (done) => {
    request(app).post('/user-admin')
      .then((res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.include.keys('error');
        done();
      });
  });

  it('Should return 403  (customer token)', (done) => {
    request(app).post('/user-admin')
      .set({ Authorization: `Bearer ${customerToken}` })
      .then(((res) => {
        expect(res.status).to.eql(403);
        expect(res.body).to.include.keys('error');
        done();
      }));
  });

  invalidBody.forEach((x, i) => {
    it(`Should return 400  (existing user / validation fail) ${i}`, (done) => {
      request(app).post('/user-admin')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(x)
        .then(((res) => {
          expect(res.status).to.eql(400);
          expect(res.body).to.include.keys('error');
          done();
        }));
    });
  });

  validBody.forEach((x, i) => {
    it(`Should return 200 ${i}`, (done) => {
      request(app).post('/user-admin')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(x)
        .then(((res) => {
          expect(res.status).to.eql(200);
          expect(res.body).to.include.keys(['message', 'newUser']);
          expect(res.body.newUser).to.include.keys(['id', 'username', 'role']);
          done();
        }));
    });
  });
});
