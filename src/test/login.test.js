const { afterAll, beforeEach } = require('@jest/globals')
const supertest = require('supertest')
const { app, server } = require('../../index')
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)
const { register } = require('../services/login_service')
const userRepositoryMock = require('../repositories/user_repository')
const loginRepositoryMock = require('../repositories/login_repository')

const saltRounds = 10

jest.mock('../repositories/login_repository')
jest.mock('../repositories/user_repository')

beforeEach(() => {
  jest.resetAllMocks()
})

test('login service unit test register user', async () => {
  const newUser = new User({ username: 'adrian.souto', password: 'somePassword', email: 'adrian.souto@email.com' })
  const passwordHash = await bcrypt.hash(newUser.password, saltRounds)
  const newUserReturnedByDb = {
    username: 'adrian.souto',
    password: passwordHash,
    email: 'adrian.souto@email.es',
    roles: [],
    _id: newUser.id,
    __v: 0
  }

  loginRepositoryMock.register.mockReturnValueOnce(newUserReturnedByDb)
  expect(await register(newUser)).toStrictEqual(newUserReturnedByDb)
})

test('API register new user', async () => {
  const newUser = new User({ username: 'adrian.souto', password: 'somePassword', email: 'adrian.souto@email.com' })
  const passwordHash = await bcrypt.hash(newUser.password, saltRounds)
  const newUserReturnedByDb = new User({
    username: 'adrian.souto',
    password: passwordHash,
    email: 'adrian.souto@email.com',
    roles: [],
    _id: newUser.id,
    __v: 0
  })

  userRepositoryMock.findUserByUsername.mockReturnValueOnce(null)
  userRepositoryMock.findUserByEmail.mockReturnValueOnce(null)
  loginRepositoryMock.register.mockReturnValueOnce(newUserReturnedByDb)

  const response = await api
    .post('/register')
    .send({ username: 'adrian.souto', password: 'somePassword', email: 'adrian.souto@email.com' })
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const bodyResponse = { username: 'adrian.souto', email: 'adrian.souto@email.com', id: newUser.id, roles: [] }
  expect(response.body).toStrictEqual(bodyResponse)
})

test('API fail register, username already exists', async () => {
  const username = 'adrian.souto'

  userRepositoryMock.findUserByUsername.mockReturnValueOnce({ })
  userRepositoryMock.findUserByEmail.mockReturnValueOnce(null)

  const response = await api
    .post('/register')
    .send({ username: username, password: 'somePassword', email: 'adrian.souto@email.com' })
    .expect(409)
    .expect('Content-Type', /application\/json/)

  const bodyResponse = 'this username already exists: ' + username
  expect(response.body).toStrictEqual(bodyResponse)
})

test('API fail register, email already exists', async () => {
  const email = 'adrian.souto@email.com'

  userRepositoryMock.findUserByUsername.mockReturnValueOnce(null)
  userRepositoryMock.findUserByEmail.mockReturnValueOnce({ })

  const response = await api
    .post('/register')
    .send({ username: 'adrian.souto', password: 'somePassword', email: email })
    .expect(409)
    .expect('Content-Type', /application\/json/)

  const bodyResponse = 'this email already exists: ' + email
  expect(response.body).toStrictEqual(bodyResponse)
})

afterAll(async () => {
  await mongoose.disconnect()
  await sleep(1000)
  server.close()
})

function sleep (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
