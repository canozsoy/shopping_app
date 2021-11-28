import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import 'mocha';

chai.use(chaiHttp);
const { expect, request } = chai;

const customerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRjNmM1YjAzLTg5NzQtNDc4Yy04ZGQwLTVkYjkxNTYzODA2YSIsInVzZXJuYW1lIjoidGVzdCIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTYzODEwNzQ3MSwiZXhwIjoxNjM4MTkzODcxfQ.7Lmu6n1wxT3rrHuAXnhcwcjqJkP-_cQlBfwZR7ombww';
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlN2FiNGQzLWFmODAtNGRjMS1iNmE5LTAyOTcwYjIxMDYxYiIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MzgxMDc0OTUsImV4cCI6MTYzODE5Mzg5NX0.ZjPKaTOa_RrbfZI7GswAQVeFZ1XM185ClLvGpaPTvZk';
const badGuid = '12345678';
const validGuid = '7eb0024b-3260-49f2-b301-00c0b2fb4467';
const notFoundGuid = '7eb0024b-3260-49f2-b301-00c0b2fb4466';

const validBody = [
  { name: 'test', price: 100 },
  { name: 'test2', price: 1005 },
];

const invalidBody = [
  { name: 'asdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfg', price: 100 },
  { price: 500 },
  { name: 'asdf', price: 'a' },
  { name: 'asdfg', price: -1 },
  { name: 'asdfgg', price: '-1' },
];

describe('POST /product-admin', () => {
  invalidBody.forEach((x, i) => {
    it(`Create product should return 400 ${i}`, () => {
      request(app).post('/product-admin').set({ Authorization: `Bearer ${adminToken}` })
        .send(x)
        .then((res) => {
          expect(res.status).to.eql(400);
          expect(res.body).to.include.keys('error');
        });
    });
  });
  it('Create product should return 403', () => {
    request(app).post('/product-admin').set({ Authorization: `Bearer ${customerToken}` })
      .then((res) => {
        expect(res.status).to.eql(403);
        expect(res.body).to.include.keys('error');
      });
  });
  it('Create product should return 401', () => {
    request(app).post('/product-admin')
      .then((res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.include.keys('error');
      });
  });
  validBody.forEach((x, i) => {
    it(`Create product should return 200 ${i}`, () => {
      request(app).post('/product-admin').set({ Authorization: `Bearer ${adminToken}` })
        .send(x)
        .then((res) => {
          expect(res.status).to.eql(200);
          expect(res.body).to.include.keys(['message', 'newProduct']);
          expect(res.body.newProduct).to.include.keys(['id', 'name', 'price', 'detail', 'createdAt', 'updatedAt']);
        });
    });
  });
});

describe('POST /product-admin/:id', () => {
  it('Change product should return 400 (bad guid)', () => {
    request(app).post(`/product-admin/${badGuid}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send(validBody[0])
      .then((res) => {
        expect(res.status).to.eql(400);
        expect(res.body).to.include.keys('error');
      });
  });
  invalidBody.forEach((x, i) => {
    it(`Change product should return 400 ${i}`, () => {
      request(app).post(`/product-admin/${validGuid}`)
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(x)
        .then((res) => {
          expect(res.status).to.eql(400);
          expect(res.body).to.include.keys('error');
        });
    });
  });
  it('Change product should return 404 (not found guid)', () => {
    request(app).get(`/product-admin/${notFoundGuid}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send(validBody[0])
      .then((res) => {
        expect(res.status).to.eql(404);
        expect(res.body).to.include.keys('error');
      });
  });
  it('Change product should return 403 (customer token)', () => {
    request(app).post(`/product-admin/${validGuid}`)
      .set({ Authorization: `Bearer ${customerToken}` })
      .send(validBody[0])
      .then((res) => {
        expect(res.status).to.eql(403);
        expect(res.body).to.include.keys('error');
      });
  });
  it('Change product should return 401', () => {
    request(app).post(`/product-admin/${validGuid}`)
      .send(validBody[0])
      .then((res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.include.keys('error');
      });
  });
  validBody.forEach((x, i) => {
    it(`Change product should return 200 ${i}`, () => {
      request(app).post(`/product-admin/${validGuid}`)
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(x)
        .then((res) => {
          expect(res.status).to.eql(200);
          expect(res.body).to.include.keys(['message', 'updatedProduct']);
          expect(res.body.updatedProduct).to.include.keys(['id', 'name', 'price', 'detail', 'createdAt', 'updatedAt']);
        });
    });
  });
});
