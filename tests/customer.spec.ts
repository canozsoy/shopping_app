import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import 'mocha';

chai.use(chaiHttp);
const { expect, request } = chai;

const customerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBiMGNkOTFiLTUwNDUtNDg3Mi1hMWFiLTBjYjYwMDk3NTdjMiIsInVzZXJuYW1lIjoidGVzdCIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTYzODE3MjQ5MywiZXhwIjoxNjM4MjU4ODkzfQ.Y5-Sjpk__h03FUrpEhkg6zME_y1APaPOnk3ypW70uPw';
const otherCustomerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNiZDhjYzcwLTY4ZDMtNDQwOS04ZmYwLTMxMWQ5YmQ2Njk5OCIsInVzZXJuYW1lIjoidGVzdHRlc3QiLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE2MzgxNzIyNzQsImV4cCI6MTYzODI1ODY3NH0.tWHzzzWOjg2uXJOYGgWSEDtEe9AKW8_XJTKdR7EFDKg';
const validGuid = '0b0cd91b-5045-4872-a1ab-0cb6009757c2';
const badGuid = '1234567';
const invalidGuid = '4c6c5b03-8974-478c-8dd0-5db91563806b';

const validButNotMatchingProducts = {
  products: [
    '7eb0024b-3260-49f2-b301-00c0b2fb4466',
    '6f218a09-890a-4cac-a870-82ba7cc64ea4'],
};
const validProducts = {
  products: [
    '7a12e653-ed79-4577-81ef-b50ea2381293',
    '483da10a-df11-467b-98e2-29dcbc6b1f3e',
  ],
};

const invalidBody = [
  { products: '' },
  { products: ['', ''] },
  { products: [1, 2] },
  { },
];

const validOrderId = '9c973ad9-851e-4ba5-9fe9-5af33c8d8e5e';
const notFoundOrderId = '9c973ad9-851e-4ba5-9fe9-5af33c8d8e5f';

describe('GET /customer/:customerId/order', () => {
  it('List orders should return 403 (bad guid due to verify self)', (done) => {
    request(app).get(`/customer/${badGuid}/order`)
      .set({ Authorization: `Bearer ${customerToken}` })
      .then((res) => {
        expect(res.status).to.eql(403);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('List orders should return 403 (invalid guid due to verify self)', (done) => {
    request(app).get(`/customer/${invalidGuid}/order`)
      .set({ Authorization: `Bearer ${customerToken}` })
      .then((res) => {
        expect(res.status).to.eql(403);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('List orders should return 401 (no token)', (done) => {
    request(app).get(`/customer/${validGuid}/order`)
      .then((res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('List orders should return 200 or 404 (if not exists)', (done) => {
    request(app).get(`/customer/${validGuid}/order`)
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
  it('List orders should return 403 (bad guid, verify self)', (done) => {
    request(app).post(`/customer/${badGuid}/order`)
      .set({ Authorization: `Bearer ${customerToken}` })
      .then((res) => {
        expect(res.status).to.eql(403);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('List orders should return 403 (invalid guid, verify self)', (done) => {
    request(app).post(`/customer/${invalidGuid}/order`)
      .set({ Authorization: `Bearer ${customerToken}` })
      .then((res) => {
        expect(res.status).to.eql(403);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('List orders should return 401 (no token)', (done) => {
    request(app).post(`/customer/${invalidGuid}/order`)
      .then((res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('List orders should return 403 (other customer\'s token)', (done) => {
    request(app).post(`/customer/${validGuid}/order`)
      .set({ Authorization: `Bearer ${otherCustomerToken}` })
      .then((res) => {
        expect(res.status).to.eql(403);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  invalidBody.forEach((x, i) => {
    it(`Create order should return 400 (invalid body) ${i}`, (done) => {
      request(app).post(`/customer/${validGuid}/order`)
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
    request(app).post(`/customer/${validGuid}/order`)
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
    request(app).post(`/customer/${validGuid}/order`)
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
    request(app).get(`/customer/${validGuid}/order/${validOrderId}`)
      .then((res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('Order detail should return 400 (bad id)', (done) => {
    request(app).get(`/customer/${validGuid}/order/${badGuid}`)
      .set({ Authorization: `Bearer ${customerToken}` })
      .then((res) => {
        expect(res.status).to.eql(400);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('Order detail should return 404 (not found id)', (done) => {
    request(app).get(`/customer/${validGuid}/order/${notFoundOrderId}`)
      .set({ Authorization: `Bearer ${customerToken}` })
      .then((res) => {
        expect(res.status).to.eql(404);
        expect(res.body).to.include.keys('error');
        done();
      });
  });
  it('Orders should return 200 or 404 (if not exists)', (done) => {
    request(app).get(`/customer/${validGuid}/order/${validOrderId}`)
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
