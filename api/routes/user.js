const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

//create account
router.post('/signup', (req, res, next) => {
  const saltRound = 10; // cost factor.(more hashing more rounds)

  User.find({ email: req.body.email }) /* check if email not exist in storage */
    .exec() /* thanks this method we can use Promise methods */
    .then((user) => {
      //we always get an array but we need to check if it's empty
      if (user.length >= 1) {
        return res.status(422).json({
          message: 'Cannot create - email account exists in storage',
        });
      } else {
        //email not found - can create new Account
        bcrypt.hash(req.body.password, saltRound, (err, hash) => {
          if (err) {
            //Some kind of Internal Server Error happen
            return res.status(500).json({
              //HTTP Status means "Internal Server Error"
              error: err,
            });
          } else {
            //hash done properly => create new User
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            //save User account below
            user
              .save()
              .then((result) => {
                //No Error (Resolved)
                console.log(result);
                res.status(201).json({
                  //HTTP Status means "Created"
                  message: 'User created',
                });
              })
              .catch((err) => {
                //some error happen when we try to create an 'Account'(Rejected)
                console.log(err);
                res.status(500).json({
                  //HTTP Status means "Internal Server Error"
                  error: err,
                });
              });
          }
        });
      }
    });
});

//delete
router.delete('/:userId', (req, res, next) => {
  User.find({_id: req.params.userId})
    .then((user) => {
      if (user.length >= 1) {
        User.deleteOne({
          _id: req.params.userId,
        })
          .exec() // Return a promise to use then(), catch() methods
          .then((result) => {
            res.status(200).json({
              message: 'User deleted successfully',
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({//HTTP Status means "Internal Server Error"
              error: err,
            });
          });
      }else {
        return res.status(404).json({//HTTP Status means "Not Found"
          message: 'Cannot remove - User not found'
        });
      }
    })
    .catch((err) => {
      //some error happen when we try to find Id to remove an 'Account'(Rejected)
      console.log(err);
      res.status(500).json({
        //HTTP Status means "Internal Server Error"
        error: err,
      });
    });
});

module.exports = router;
