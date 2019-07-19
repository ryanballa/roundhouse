const express = require('express');
const router = express.Router();

const authHelpers = require('./_helpers');
const passport = require('./local');

function handleResponse(res, code, statusMsg) {
  res.status(code).json({ status: statusMsg });
}

router.get('/', authHelpers.loginRequired, (req, res, next) => {
  handleResponse(res, 200, 'success');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      handleResponse(res, 500, 'error');
    }
    if (!user) {
      handleResponse(res, 404, 'User not found');
    }
    if (user) {
      req.logIn(user, (err) => {
        if (err) {
          handleResponse(res, 500, 'error');
        }
        handleResponse(res, 200, user);
      });
    }
  })(req, res, next);
});

router.post('/register', (req, res, next) => {
  return authHelpers
    .createUser(req, res)
    .then(response => {
      passport.authenticate('local', (err, user, info) => {
        if (user) {
          handleResponse(res, 200, 'success');
        }
      })(req, res, next);
    })
    .catch(err => {
      handleResponse(res, 500, 'error');
    });
});

router.get('/logout', authHelpers.loginRequired, (req, res, next) => {
  req.logout();
  handleResponse(res, 200, 'success');
});

module.exports = router;