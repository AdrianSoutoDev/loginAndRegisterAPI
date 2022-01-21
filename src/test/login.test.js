const { afterAll, beforeEach } = require('@jest/globals')
const supertest = require('supertest')
const { app, server } = require('../../index')
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)
const { register } = require('../services/login_service')
const userRepository = require('../repositories/user_repository')
const loginRepository = require('../repositories/login_repository')

const saltRounds = 10

loginRepository.register = jest.fn()
userRepository.findUserByUsername = jest.fn()
userRepository.findUserByEmail = jest.fn()

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

  loginRepository.register.mockReturnValueOnce(newUserReturnedByDb)
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

  const bodyResponse = { username: 'adrian.souto', email: 'adrian.souto@email.com', id: newUser.id, roles: [] }

  userRepository.findUserByUsername.mockReturnValueOnce(null)
  userRepository.findUserByEmail.mockReturnValueOnce(null)
  loginRepository.register.mockReturnValueOnce(newUserReturnedByDb)
  const response = await api
    .post('/register')
    .send({ username: 'adrian.souto', password: 'somePassword', email: 'adrian.souto@email.com' })
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toStrictEqual(bodyResponse)
})

test('API fail register, username already exists', async () => {
  const username = 'adrian.souto'
  const bodyResponse = 'this username already exists: ' + username

  userRepository.findUserByUsername.mockReturnValueOnce({ username: 'adrian.souto' })
  userRepository.findUserByEmail.mockReturnValueOnce(null)

  const response = await api
    .post('/register')
    .send({ username: 'adrian.souto', password: 'somePassword', email: 'adrian.souto@email.com' })
    .expect(409)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toStrictEqual(bodyResponse)
})

test('API fail register, email already exists', async () => {
  const email = 'adrian.souto@email.com'
  const bodyResponse = 'this email already exists: ' + email

  userRepository.findUserByUsername.mockReturnValueOnce(null)
  userRepository.findUserByEmail.mockReturnValueOnce({ email: 'adrian.souto@email.com' })

  const response = await api
    .post('/register')
    .send({ username: 'adrian.souto', password: 'somePassword', email: 'adrian.souto@email.com' })
    .expect(409)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toStrictEqual(bodyResponse)
})

afterAll(async () => {
  await mongoose.disconnect()
  server.close()
})
