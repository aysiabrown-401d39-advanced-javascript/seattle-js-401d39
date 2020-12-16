'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = 'banana';

const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  role: { type: String, required: true, default: 'user', enum: ['user', 'editor', 'admin']}
}, { toJSON: { virtuals: true }});

users.pre('save', async function () {
  if(this.isModified('password')){
    console.log('inside the pre hook')
    this.password = await bcrypt.hash(this.password, 8);
  }
})

// Adds a virtual feild to our schema that only exists in memory - NOT in the DB
// token: ao;ienapp9a84t
users.virtual('token').get(function () {
  const tokenObject = {
    username:this.username
  }

  return jwt.sign(tokenObject, SECRET);
});

users.virtual('capabilities').get(function () {
  // first, create an object that has ALL of the roles and capabilities
  const acl = {
    user: ['read'],
    editor: ['read', 'create'],
    admin: ['read', 'create', 'update', 'delete']
  }
  // then use that object to find this users role to return the capibilites that this user has
  return acl[this.role];
})

// BASIC AUTH
users.statics.authenticateBasic = async function (username, password) {
  const user = await this.findOne({ username });
  const valid = bcrypt.compare(password, user.password);
  if( valid ){ return user; }
  throw new Error('Invalid User');
}

// BEARER AUTH
users.statics.authenticateWithToken = async function (token) {
  try {
    const parsedToken = jwt.verify(token, SECRET);
    const user = await this.findOne({ username: parsedToken.username });
    if(user){ return user }
    throw new Error('User Not Found');
  } catch (e) {
    throw new Error(e.message);
  }
}

module.exports = mongoose.model('users', users);