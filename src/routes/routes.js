const login = require('./login_routes');

module.exports = (app) => {
    login(app);
};