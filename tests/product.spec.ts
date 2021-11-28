import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import 'mocha';

chai.use(chaiHttp);
const { expect, request } = chai;

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlN2FiNGQzLWFmODAtNGRjMS1iNmE5LTAyOTcwYjIxMDYxYiIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MzgxMDE3OTIsImV4cCI6MTYzODE4ODE5Mn0.CKQgFciCaWkab_jED5ZIjQAoCWdYToCz5FMb7M8zS7E';
const badGuid = '12345678';
const validGuid = '7eb0024b-3260-49f2-b301-00c0b2fb4467';
const notFoundGuid = '7eb0024b-3260-49f2-b301-00c0b2fb4466';

describe('GET /product', () => {
  it('Product should return 200', () => {
    request(app).get('/product').set({ Authorization: `Bearer ${token}` })
      .then((res) => {
        if (res.status === 200) {
          expect(res.body).to.include.keys(['message', 'products']);
          expect(res.body.products[0]).to.include.keys('id');
        } else {
          expect(res.status).to.eql(404);
          expect(res.body).to.include.keys('error');
        }
      });
  });
  it('Product should return 401', () => {
    request(app).get('/product')
      .then((res) => {
        expect(res.status).to.eql(401);
      });
  });
});

describe('GET /product/:id', () => {
  it('Product should return 400', () => {
    request(app).get(`/product/${badGuid}`).set({ Authorization: `Bearer ${token}` })
      .then((res) => {
        expect(res.status).to.eql(400);
        expect(res.body).to.include.keys('error');
      });
  });
  it('Product should return 404', () => {
    request(app).get(`/product/${notFoundGuid}`).set({ Authorization: `Bearer ${token}` })
      .then((res) => {
        expect(res.status).to.eql(404);
        expect(res.body).to.include.keys('error');
      });
  });
  it('Product should return 200', () => {
    request(app).get(`/product/${validGuid}`).set({ Authorization: `Bearer ${token}` })
      .then((res) => {
        expect(res.status).to.eql(200);
        expect(res.body).to.include.keys(['message', 'product']);
        expect(res.body.products).to.include.keys(['id', 'name', 'price', 'detail', 'createdAt', 'updatedAt']);
      });
  });
  it('Product should return 401', () => {
    request(app).get(`/product/${validGuid}`)
      .then((res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.include.keys(['error']);
      });
  });
});
