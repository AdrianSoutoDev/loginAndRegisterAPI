const loginRepository = require('../repositories/login_repository');
const User = require('../models/user')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const register = async (user) => { 
    const { username, password, email} = user

    try{
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const newUser = new User({username, password: passwordHash, email});
        return loginRepository.register(newUser);
    }catch(error){
        console.log(error)
    }
};

const login = async (username, password) => {
    try{
        const user = await loginRepository.login(username, password);
        return (user != null && await bcrypt.compare(password, user.password)) ? user : null;
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    register,
    login
};