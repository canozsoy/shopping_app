import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import 'mocha';

chai.use(chaiHttp);
const { expect, request } = chai;

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJmMTJjMjhmLWQ4NjYtNDMzZS1iMTY4LWFmYzA0MmZhMzMzMSIsInVzZXJuYW1lIjoidGVzdCIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTYzODE2OTc5MiwiZXhwIjoxNjM4MjU2MTkyfQ.zDZ4u3VYaML88BqEqusq2bXbj_cQPyCTFPBY5YmAi_w';
const badGuid = '12345678';
const validGuid = '145be537-d65b-453e-a7f7-deb2b447b0ba';
const notFoundGuid = 'bf12c28f-d866-433e-b168-afc042fa3330';

describe('GET /product', () => {
  it('Product should return 200', (done) => {
    request(app).get('/product').set({ Authorization: `Bearer ${token}` })
      .then((res) => {
        if (res.status === 200) {
          expect(res.body).to.include.keys(['message', 'products']);
          expect(res.body.products[0]).to.include.keys('id');
          done();
        } else {
          expect(res.status).to.eql(404);
          expect(res.body).to.include.keys('error');
          done();
        }
      });
  });
  it('Product should return 401', (done) => {
    request(app).get('/product')
      .then((res) => {
        expect(res.status).to.eql(401);
        done();
      });
  });
});

describe('GET /product/:id', () => {
  it('Product should return 400', (done) => {
    request(app).get(`/product/${badGuid}`).set({ Authorization: `Bearer ${token}` })
      .then((res) => {
        expect(res.status).to.eql(400);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('Product should return 404', (done) => {
    request(app).get(`/product/${notFoundGuid}`).set({ Authorization: `Bearer ${token}` })
      .then((res) => {
        expect(res.status).to.eql(404);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('Product should return 200', (done) => {
    request(app).get(`/product/${validGuid}`).set({ Authorization: `Bearer ${token}` })
      .then((res) => {
        expect(res.status).to.eql(200);
        expect(res.body).to.include.keys(['message', 'product']);
        expect(res.body.product).to.include.keys(['id', 'name', 'price', 'detail', 'createdAt', 'updatedAt']);
        done();
      });
  });
  it('Product should return 401', (done) => {
    request(app).get(`/product/${validGuid}`)
      .then((res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.include.keys(['error']);
        done();
      });
  });
});
