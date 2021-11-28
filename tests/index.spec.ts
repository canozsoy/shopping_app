import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import 'mocha';

chai.use(chaiHttp);
const { expect, request } = chai;

const validCases = [
  { username: 'test', password: 'test' },
  { username: 'testtest', password: 'testtest' },
  { username: 'adlkfndlkm', password: 'sdlfns' },
];

const invalidCases = [
  {},
  { username: 'test' },
  { password: 'test' },
  { username: 'test test', password: 'test' },
  { username: 'test', password: 'test test' },
  { username: 'te', password: 'test' },
  { username: 'test', password: 'te' },
  { username: 'testtesttesttesttesttesttesttesttest', password: 'test' },
  { username: 'test', password: 'testtesttesttesttesttesttesttesttest' },
];

describe('Post /login', () => {
  validCases.forEach((x, i) => {
    it(`Valid cases should return 401 (not found in database) ${i}`, async () => {
      const res = await request(app).post('/login').send(x);
      expect(res.status).to.eql(401);
      const body = JSON.parse(res.error.text);
      expect(body).to.include.keys('error');
    });
  });
  invalidCases.forEach((x, i) => {
    it(`Invalid cases should return 400 ${i}`, async () => {
      const res = await request(app).post('/login').send(x);
      expect(res.status).to.eql(400);
      const body = JSON.parse(res.error.text);
      expect(body).to.include.keys('error');
      const keys = body.error.map((y:{ key?:string }) => y.key);
      expect(keys).to.satisfy((arr:string[]) => (arr.includes('username') || arr.includes('password')));
    });
  });
  it('Truly valid login', () => {
    request(app).post('/login').send({ username: 'admin', password: 'admin' }).then((res) => {
      expect(res.status).to.eql(200);
      const { body } = res;
      expect(body.message).to.eql('Successfully Logged In');
      expect(body).to.include.keys('currentUser');
      expect(body.currentUser).to.include.keys(['id', 'username', 'role', 'jwt']);
    });
  });
  it('Wrong Password login', () => {
    request(app).post('/login').send({ username: 'admin', password: 'something' })
      .then((res) => {
        expect(res.status).to.eql(401);
        const { body } = res;
        expect(body.message).to.eql('Incorrect username or password');
        expect(body).to.include.keys('error');
        expect(body.error[0]).to.include.keys(['message', 'key', 'value']);
      });
  });
});

describe('Post /signup', () => {
  validCases.forEach((x, i) => {
    it(`Valid cases should return 200 ${i}`, async () => {
      const res = await request(app).post('/signup').send(x);
      expect(res.status).to.eql(200);
      const { body } = res;
      expect(body.message).to.eql('Successfully Created');
      expect(body).to.include.keys('newUser');
      expect(body.newUser).to.include.keys(['id', 'username', 'role', 'jwt']);
    });
  });
  invalidCases.push({ username: 'admin', password: 'something' });
  invalidCases.forEach((x, i) => {
    it(`Invalid cases should return 400 ${i}`, async () => {
      const res = await request(app).post('/signup').send(x);
      expect(res.status).to.eql(400);
      const body = JSON.parse(res.error.text);
      expect(body).to.include.keys('error');
      const keys = body.error.map((y:{ key?:string }) => y.key);
      expect(keys).to.satisfy((arr:string[]) => (arr.includes('username') || arr.includes('password')));
    });
  });
});
