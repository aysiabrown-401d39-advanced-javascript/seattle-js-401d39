'use strict';
const base64 = require('base-64');
const users = require('./users');

module.exports = (req, res, next) => {
  // get the username and password from the headers and check to see if the password is correct
  console.log('req.headers', req.headers)

  let basic = req.headers.authorization.split(' ').pop();
  console.log('basic', basic)
  let [user, pass] = base64.decode(basic).split(':');
  console.log('user, pass', [user, pass]);

  // is the password OK?
  users.authenticateBasic(user, pass)
    .then(validUser => {
      req.user = validUser;
      next();
    })
}