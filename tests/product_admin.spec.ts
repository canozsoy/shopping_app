import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import 'mocha';

chai.use(chaiHttp);
const { expect, request } = chai;

const customerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBiMGNkOTFiLTUwNDUtNDg3Mi1hMWFiLTBjYjYwMDk3NTdjMiIsInVzZXJuYW1lIjoidGVzdCIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTYzODE3MDQzNCwiZXhwIjoxNjM4MjU2ODM0fQ.N6taFySdi-hOVS-gc1_lUmOeYY0BLu_m3_C4w7MeKoM';
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ1MzZmZWI1LTVlMzctNGFkMC04ZDRlLWUzNzA2ZWM3NzViOSIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MzgxNzA0NTksImV4cCI6MTYzODI1Njg1OX0.XopkIJGnHxuzVQDB-VnJqTCGZCL-rOyxikR8oCdyjQE';
const badGuid = '12345678';
const validGuid = '145be537-d65b-453e-a7f7-deb2b447b0ba';
const notFoundGuid = '7eb0024b-3260-49f2-b301-00c0b2fb4466';

const validBody = [
  { name: 'test', price: 100 },
  { name: 'test2', price: 1005 },
];

const invalidBody = [
  { name: 'asdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfg', price: 100 },
  { name: 'asdf', price: 'a' },
  { name: 'asdfg', price: -1 },
  { name: 'asdfgg', price: '-1' },
];

describe('POST /product-admin', () => {
  invalidBody.forEach((x, i) => {
    it(`Create product should return 400 ${i}`, (done) => {
      request(app).post('/product-admin').set({ Authorization: `Bearer ${adminToken}` })
        .send(x)
        .then((res) => {
          expect(res.status).to.eql(400);
          expect(res.body).to.include.keys('error');
          done();
        });
    });
  });
  it('Create product should return 403', (done) => {
    request(app).post('/product-admin').set({ Authorization: `Bearer ${customerToken}` })
      .then((res) => {
        expect(res.status).to.eql(403);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('Create product should return 401', (done) => {
    request(app).post('/product-admin')
      .then((res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  validBody.forEach((x, i) => {
    it(`Create product should return 200 ${i}`, (done) => {
      request(app).post('/product-admin').set({ Authorization: `Bearer ${adminToken}` })
        .send(x)
        .then((res) => {
          expect(res.status).to.eql(200);
          expect(res.body).to.include.keys(['message', 'newProduct']);
          expect(res.body.newProduct).to.include.keys(['id', 'name', 'price', 'detail', 'createdAt', 'updatedAt']);
          done();
        });
    });
  });
});

describe('POST /product-admin/:id', () => {
  it('Change product should return 400 (bad guid)', (done) => {
    request(app).post(`/product-admin/${badGuid}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send(validBody[0])
      .then((res) => {
        expect(res.status).to.eql(400);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  invalidBody.forEach((x, i) => {
    it(`Change product should return 400 ${i}`, (done) => {
      request(app).post(`/product-admin/${validGuid}`)
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(x)
        .then((res) => {
          expect(res.status).to.eql(400);
          expect(res.body).to.include.keys('error');
          done();
        });
    });
  });
  it('Change product should return 404 (not found guid)', (done) => {
    request(app).post(`/product-admin/${notFoundGuid}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send(validBody[0])
      .then((res) => {
        expect(res.status).to.eql(404);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('Change product should return 403 (customer token)', (done) => {
    request(app).post(`/product-admin/${validGuid}`)
      .set({ Authorization: `Bearer ${customerToken}` })
      .send(validBody[0])
      .then((res) => {
        expect(res.status).to.eql(403);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('Change product should return 401', (done) => {
    request(app).post(`/product-admin/${validGuid}`)
      .send(validBody[0])
      .then((res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  validBody.forEach((x, i) => {
    it(`Change product should return 200 ${i}`, (done) => {
      request(app).post(`/product-admin/${validGuid}`)
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(x)
        .then((res) => {
          expect(res.status).to.eql(200);
          expect(res.body).to.include.keys(['message', 'updatedProduct']);
          expect(res.body.updatedProduct).to.include.keys(['id', 'name', 'price',
            'detail', 'createdAt', 'updatedAt']);
          done();
        });
    });
  });
});
