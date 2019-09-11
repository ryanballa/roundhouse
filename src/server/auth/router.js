const express = require('express');

const router = express.Router();

const authHelpers = require('./_helpers');
const passport = require('./local');

function handleResponse(res, code, statusMsg) {
  res.status(code).json({ status: statusMsg });
}

router.get('/', authHelpers.loginRequired, (req, res) => {
  res.status(200).json({ status: 'success', user: req.user });
});

router.post('/login', authHelpers.loginRedirect, (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      handleResponse(res, 500, 'error');
    }
    if (!user && !res.headersSent) {
      handleResponse(res, 404, 'User not found');
    }
    if (user) {
      req.logIn(user, loginErr => {
        if (loginErr) {
          handleResponse(res, 500, 'error');
        }
        handleResponse(res, 200, user);
      });
    }
  })(req, res, next);
});

router.post('/register', authHelpers.loginRedirect, (req, res, next) => {
  return authHelpers
    .createUser(req, res)
    .then(() => {
      passport.authenticate('local', (err, user) => {
        if (user) {
          handleResponse(res, 200, 'success');
        }
      })(req, res, next);
    })
    .catch(() => {
      handleResponse(res, 500, 'error');
    });
});

router.get('/logout', authHelpers.loginRequired, (req, res) => {
  req.logout();
  handleResponse(res, 200, 'success');
});

module.exports = router;
