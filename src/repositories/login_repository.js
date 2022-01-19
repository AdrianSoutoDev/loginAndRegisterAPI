const User = require("../models/user");

const register = (newUser => newUser.save())
const login = (username => User.findOne({username: username}))

module.exports = {
    login,
    register
};