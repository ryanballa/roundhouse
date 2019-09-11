const bcrypt = require('bcryptjs');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
// eslint-disable-next-line import/order
const database = require('knex')(configuration);

function loginRedirect(req, res, next) {
  if (req.user) {
    return res.status(401).json({ status: 'You are already logged in' });
  }
  return next();
}

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

function createUser(req) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  return database('users')
    .insert({
      password: hash,
      username: req.body.username,
    })
    .returning('*');
}

function loginRequired(req, res, next) {
  if (!req.user) return res.status(401).json({ status: 'Please log in' });
  return next();
}

module.exports = {
  comparePass,
  createUser,
  loginRedirect,
  loginRequired,
};
