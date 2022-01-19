const User = require("../models/user");

const findUserByUsername = ( username => User.findOne( {username: username } ));
const findUserByEmail = ( email => User.findOne( {email: email } ) );
const findUserById = id => User.findById(id);

module.exports = {
    findUserByUsername,
    findUserByEmail,
    findUserById
};