const expect = require('chai').expect;
const supertest = require('supertest');
const app = require('../src/api');
const database = require('../src/database');

let firstTodoIdTest = '';
const firstTodosBody = {
  text: 'Go Grocery Shopping',
  due_date: new Date().getTime(),
};

request = supertest.agent(app);

beforeAll(async () => {
  await database.connect();
});

describe('API test', () => {
  it('Should allow post request to /todos', async () => {
    const response = await request.post('/todos').send(firstTodosBody);

    expect(response.status).to.equal(201);
  });
});
