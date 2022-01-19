const userRepository = require('../repositories/user_repository');

const usernameExists = async (username) => { 
    try{
        return await userRepository.findUserByUsername(username) != null ;
    }catch(error){
        console.log(error)
    }
};

const emailExists = async (email) => { 
    try{
        return await userRepository.findUserByEmail(email) != null ;
    }catch(error){
        console.log(error)
    }
};

const findUserById = async (id) => {
    return await userRepository.findUserById(id);
};

module.exports = {
    usernameExists,
    emailExists,
    findUserById
};