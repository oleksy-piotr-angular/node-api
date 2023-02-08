const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'here we handle GET request to /tasks',
  });
});

router.post('/', (req, res, next) => {
  res.status(200).json({
    message: 'Here we handle POST request to /tasks',
  });
});

router.get('/:taskId', (req, res, next) => {
  const id = req.params.taskId;
  if (id === 'special') {
    res.status(200).json({
      message: 'Now you see the content with special ID',
      id: id,
    });
  }else{
    res.status(200).json({
      message: 'Now you passed some ID'
    });
  }
});
router.patch('/:taskId', (req, res, next) => {
  const id = req.params.taskId;
  if(id === 'special'){
    res.status(200).json({
      message: 'Updated product',
      id: id
    });
  }else{
    res.status(200).json({
      message: 'None product has been updated'
    });
  }
});

router.delete('/:taskId', (req, res, next) => {
  const id = req.params.taskId;
  if(id === 'special'){
    res.status(200).json({
      message: 'Deleted product',
      id: id
    });
  }else{
    res.status(200).json({
      message: 'None product has been deleted'
    });
  }
});

module.exports = router;
