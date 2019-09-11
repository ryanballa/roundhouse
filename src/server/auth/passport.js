const passport = require('passport');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
// eslint-disable-next-line import/order
const database = require('knex')(configuration);

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    database('users')
      .where({ id })
      .first()
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
  });
};
