import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import 'mocha';

chai.use(chaiHttp);
const { expect, request } = chai;

const customerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRjNmM1YjAzLTg5NzQtNDc4Yy04ZGQwLTVkYjkxNTYzODA2YSIsInVzZXJuYW1lIjoidGVzdCIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTYzODEyMzYxNCwiZXhwIjoxNjM4MjEwMDE0fQ.NkL7MXNJUmwXUsfWqS-XwkCZv0axiIw3QZaUF4OD9qQ';
const otherCustomerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBjZWFmZGJhLTBlNjQtNDY3YS05NDc3LTk3YTMyYTljZTRiNCIsInVzZXJuYW1lIjoidGVzdHRlc3QiLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE2MzgxMjM2NDYsImV4cCI6MTYzODIxMDA0Nn0.3uTdmwibMhk0csPC-PFLO9y27I7BcOGGCXjzOnBmA7Q';
const validGuid = '4c6c5b03-8974-478c-8dd0-5db91563806a';
const badGuid = '1234567';
const invalidGuid = '4c6c5b03-8974-478c-8dd0-5db91563806b';

const validButNotMatchingProducts = {
  products: [
    '7eb0024b-3260-49f2-b301-00c0b2fb4466',
    '6f218a09-890a-4cac-a870-82ba7cc64ea4'],
};
const validProducts = {
  products: [
    '7eb0024b-3260-49f2-b301-00c0b2fb4467',
    '6f218a09-890a-4cac-a870-82ba7cc64ea2',
  ],
};

const invalidBody = [
  { products: '' },
  { products: ['', ''] },
  { products: [1, 2] },
  { },
];

describe('GET /customer/:customerId/order', () => {
  it('List orders should return 400 (bad guid)', () => {
    request(app).get(`/customer/${badGuid}/order`)
      .set({ Authorization: `Bearer ${customerToken}` })
      .then((res) => {
        expect(res.status).to.eql(400);
        expect(res.body).to.include.keys('error');
      });
  });
  it('List orders should return 404 (invalid guid)', () => {
    request(app).get(`/customer/${invalidGuid}/order`)
      .set({ Authorization: `Bearer ${customerToken}` })
      .then((res) => {
        expect(res.status).to.eql(404);
        expect(res.body).to.include.keys('error');
      });
  });
  it('List orders should return 401 (no token)', () => {
    request(app).get(`/customer/${validGuid}/order`)
      .then((res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.include.keys('error');
      });
  });
  it('List orders should return 200 or 404 (if not exists)', () => {
    request(app).get(`/customer/${validGuid}/order`)
      .set({ Authorization: `Bearer ${customerToken}` })
      .then((res) => {
        if (res.status === 404) {
          expect(res.body).to.include.keys('error');
        } else {
          expect(res.status).to.eql(200);
          expect(res.body).to.include.keys(['message', 'orders']);
          expect(res.body.orders).to.include.keys(['id', 'date', 'userId', 'createdAt', 'updatedAt']);
        }
      });
  });
});

describe('POST /customer/:customerId/order', () => {
  it('List orders should return 400 (bad guid)', () => {
    request(app).post(`/customer/${badGuid}/order`)
      .set({ Authorization: `Bearer ${customerToken}` })
      .then((res) => {
        expect(res.status).to.eql(400);
        expect(res.body).to.include.keys('error');
      });
  });
  it('List orders should return 404 (invalid guid)', () => {
    request(app).post(`/customer/${invalidGuid}/order`)
      .set({ Authorization: `Bearer ${customerToken}` })
      .then((res) => {
        expect(res.status).to.eql(404);
        expect(res.body).to.include.keys('error');
      });
  });
  it('List orders should return 401 (no token)', () => {
    request(app).post(`/customer/${invalidGuid}/order`)
      .then((res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.include.keys('error');
      });
  });
  it('List orders should return 403 (other customer\'s token)', () => {
    request(app).post(`/customer/${validGuid}/order`)
      .set({ Authorization: `Bearer ${otherCustomerToken}` })
      .then((res) => {
        console.log(res.status);
        expect(res.status).to.eql(200);
        expect(res.body).to.include.keys('asdf');
      });
  });
  invalidBody.forEach((x, i) => {
    it(`Create order should return 400 (invalid body) ${i}`, () => {
      request(app).post(`/customer/${validGuid}/order`)
        .set({ Authorization: `Bearer ${customerToken}` })
        .send(x)
        .then((res) => {
          expect(res.status).to.eql(400);
          expect(res.body).to.include.keys('error');
        });
    });
  });
  it('Create order should return 400 / 404 (not matching or wrong request)', () => {
    request(app).post(`/customer/${validGuid}/order`)
      .set({ Authorization: `Bearer ${customerToken}` })
      .send(validButNotMatchingProducts)
      .then((res) => {
        expect(res.status).to.include.oneOf([400, 404]);
        expect(res.body).to.include.keys(['error']);
      });
  });
});
