'use strict';

// 3rd party libraries
const mongoose = require('mongoose');
const express = require('express');
const app = express();

// my modules
const User = require('./users');
const basicAuth = require('./basic-auth-middleware');
const bearerAuth = require('./bearer-auth-middleware');

// middleware VERY NECISSARY!!!!!
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// routes
app.post('/signup', (req, res) => {
  const user = new User(req.body);
  user.save()
  .then(user => {
      res.status(200).send(user);
    })
});

// basicAuth, if successful, puts a user on the request object
app.post('/signin', basicAuth, (req, res) => {
  res.status(200).send(req.user);
})

app.post('/user', bearerAuth, (req, res) => {
  res.status(200).json(req.user);
})

// app.get('/reallyCoolStuff', bearerAuth, (req, res) => {
  
// })

mongoose.connect('mongodb://localhost:27017/newauth', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // turn on the server
    app.listen(3000, () => {
      console.log('server up');
    })
  })
  .catch(e => console.error('explode!,', e.message));
