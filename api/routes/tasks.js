const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); //to handle Mongoose connection

const Task = require('../models/task'); //Import Task Schema for MongoDB Documents

router.get('/', (req, res, next) => {
  Task.find() // looking for Documents with this Schema
    .select('_id name created isDone end')
    .exec() // returns Promise to Use then(), catch() methods
    .then((docs) => {
      const response = {
        tasks: docs.map((doc) => {
          return {//set document construction thanks map()
            _id: doc.id,
            name: doc.name,
            created: doc.created,
            isDone: doc.isDone,
            end: doc.end,
            request: {
              type: 'GET',
            },
          };
        })
      };

      console.log(docs);
      res.status(200).json(response); //send JSON Response for Requests
    })
    .catch((err) => {
      console.log(err);
      //Send ERROR in JSON response
      res.status(500).json({
        error: err,
      });
    });
});

router.post('/', (req, res, next) => {
  const task = new Task({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    created: req.body.created,
    end: req.body.end,
    isDone: req.body.isDone,
  }); //we expected to receive those information

  task
    .save() //Save data into MongoDB
    .then((result) => {
      console.log(result);
      res.status(201).json({
        //HTTP Status means "Created"
        message: 'Task created successfully',
        createdTask: {
          _id: result._id,
          name: result.name,
          created: result.created,
          isDone: result.isDone,
          end: result.end,
          request: {
            type: 'POST',
          },

        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        //HTTP Status means "Internal Server Error"
        error: err,
      });
    });
});

router.get('/:taskId', (req, res, next) => {
  const id = req.params.taskId; //extract Id from params
  Task.findById(id)
    .select('_id name created isDone end')//show only these Properties
    .exec() // return Promise Object
    .then((doc) => {
      console.log('from MongoDB' + doc);
      if (doc) {
        res.status(200).json({//HTTP Status means "OK"
          task: doc,
          request: {
            type: 'GET',
          }
        }); 
      } else {
        res
          .status(404).json({//HTTP Status means "Not Found"
             message: 'No valid entry found for Provided ID',
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.patch('/:taskId', (req, res, next) => {
  const id = req.params.taskId;
  const updateOps = {}; // here we create an object which be filled with properties to change

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value; //add a property with value
  }

  Task.updateOne({ _id: id }, { $set: updateOps })
    .exec() //return Promise
    .then((result) => {
      console.log(result);
      res.status(200).json({ //HTTP Status means "OK"
        message: 'Task Updated',
        request: {
          type: 'PATCH'
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        //HTTP Status means "Internal Server Error"
        error: err,
      });
    });
});

router.delete('/:taskId', (req, res, next) => {
  const id = req.params.taskId;
  Task.deleteOne({ _id: id })
    .exec()//return Promise and use then(), catch()
    .then((result => {
      if(result.deletedCount === 0){
        res.status(200).json({//HTTP Status means "OK"
          message: 'None Product has been deleted. Product not exist',
          request: {
            type: 'DELETE'
          }
        });
      }else{
        res.status(200).json({//HTTP Status means "OK"
          message: 'Product has been deleted',
          request: {
            type: 'DELETE'
          }
        });
      }
      console.log(result);
    }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({//HTTP Status means "Internal Server Error"
        error: err
      });
    });
});

module.exports = router;
