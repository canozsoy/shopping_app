import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import 'mocha';

chai.use(chaiHttp);
const { expect, request } = chai;

const customerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFmYzEzYjIzLWU4OWUtNGI2Zi1hNmI0LWMxYTFiMDMwYjJlMCIsInVzZXJuYW1lIjoidGVzdCIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTYzODE5Njc5MSwiZXhwIjoxNjM4MjgzMTkxfQ.w9OjtKaCQ9nTXMj8TUbJEAcQhcGOvqeVCmM0dJ4YXCM';
const invalidToken = '89435y9834y589u68jghnfghnfghj8';

const validButNotMatchingProducts = {
  products: [
    '7eb0024b-3260-49f2-b301-00c0b2fb4466',
    '6f218a09-890a-4cac-a870-82ba7cc64ea4'],
};
const validProducts = {
  products: [
    '07582ac3-7401-4eb4-ac09-d852412d7e1c',
    '71c55795-7eb9-45cf-a0e5-bbd1bc4a8aae',
  ],
};

const invalidBody = [
  { products: '' },
  { products: ['', ''] },
  { products: [1, 2] },
  { },
];

const validOrderId = '95793757-5fdd-4073-9228-cb99f771c56e';
const notFoundOrderId = '9c973ad9-851e-4ba5-9fe9-5af33c8d8e5f';
const badGuid = '324345045';

describe('GET /customer/:customerId/order', () => {
  it('List orders should return 401 (invalid token)', (done) => {
    request(app).get('/customer/order')
      .set({ Authorization: `Bearer ${invalidToken}` })
      .then((res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('List orders should return 401 (no token)', (done) => {
    request(app).get('/customer/order')
      .then((res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('List orders should return 200 or 404 (if not exists)', (done) => {
    request(app).get('/customer/order')
      .set({ Authorization: `Bearer ${customerToken}` })
      .then((res) => {
        if (res.status === 404) {
          expect(res.body).to.include.keys('error');
          done();
        } else {
          expect(res.status).to.eql(200);
          expect(res.body).to.include.keys(['message', 'orders']);
          expect(res.body.orders).to.be.an('array');
          done();
        }
      });
  });
});

describe('POST /customer/:customerId/order', () => {
  it('List orders should return 401 (invalid token)', (done) => {
    request(app).post('/customer/order')
      .set({ Authorization: `Bearer ${invalidToken}` })
      .then((res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('List orders should return 401 (no token)', (done) => {
    request(app).post('/customer/order')
      .then((res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  invalidBody.forEach((x, i) => {
    it(`Create order should return 400 (invalid body) ${i}`, (done) => {
      request(app).post('/customer/order')
        .set({ Authorization: `Bearer ${customerToken}` })
        .send(x)
        .then((res) => {
          expect(res.status).to.eql(400);
          expect(res.body).to.include.keys('error');
          done();
        });
    });
  });
  it('Create order should return 400 / 404 (not matching or wrong request)', (done) => {
    request(app).post('/customer/order')
      .set({ Authorization: `Bearer ${customerToken}` })
      .send(validButNotMatchingProducts)
      .then((res) => {
        if ([400, 404].includes(res.status)) {
          expect(res.body).to.include.keys(['error']);
          done();
        }
      });
  });
  it('Create order should return 200 (valid request)', (done) => {
    request(app).post('/customer/order')
      .set({ Authorization: `Bearer ${customerToken}` })
      .send(validProducts)
      .then((res) => {
        expect(res.status).to.eql(200);
        expect(res.body).to.include.keys(['message', 'orderItems']);
        expect(res.body.orderItems).to.be.an('array');
        done();
      });
  });
});

describe('GET /customer/:customerId/order/:orderId', () => {
  it('Order detail should return 401 (no token)', (done) => {
    request(app).get(`/customer/order/${validOrderId}`)
      .then((res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('Order detail should return 400 (bad id)', (done) => {
    request(app).get(`/customer/order/${badGuid}`)
      .set({ Authorization: `Bearer ${customerToken}` })
      .then((res) => {
        expect(res.status).to.eql(400);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('Order detail should return 404 (not found id)', (done) => {
    request(app).get(`/customer/order/${notFoundOrderId}`)
      .set({ Authorization: `Bearer ${customerToken}` })
      .then((res) => {
        expect(res.status).to.eql(404);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('Orders should return 200 or 404 (if not exists)', (done) => {
    request(app).get(`/customer/order/${validOrderId}`)
      .set({ Authorization: `Bearer ${customerToken}` })
      .then((res) => {
        if (res.status === 404) {
          expect(res.body).to.include.keys('error');
          done();
        } else {
          expect(res.status).to.eql(200);
          expect(res.body).to.include.keys(['message', 'orderDetails']);
          expect(res.body.orderDetails).to.include.keys(['order', 'products']);
          expect(res.body.orderDetails.order).to.include.keys(['id', 'date', 'userId', 'createdAt', 'updatedAt']);
          expect(res.body.orderDetails.products).to.be.an('array');
          done();
        }
      });
  });
});
