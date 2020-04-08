const express = require('express');
const db = require('./postDb.js');

const router = express.Router();

router.get('/', (req, res) => {
  db.get(req.query)
  .then(post => {
    res.status(200).json(post);
  })
  .catch(error => {
    console.error(error.message);
    res.status(500).json({
      message: 'Error retrieving the posts',
    })
  })
});

router.get('/:id', (req, res) => {
  db.getById(req.params.id)
  .then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not fount' });
    }
  })
  .catch(error => {
    console.error(error.message);
    res.status(500).json({
      message: 'Error retrieving the post',
    });
  });
});

router.delete('/:id', (req, res) => {
  db.remove(req.params.id)
  .then(count => {
    if (count > 0) {
      res.status(200).json({ message: 'The post has been removed' });
    } else {
      res.status(404).json({ message: 'The post could not be found' });
    }
  })
  .catch()
});

router.put('/:id', (req, res) => {
  db.update(req.params.id, req.body)
  .then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(400).json({ message: 'The post could not be found' })
    }
  })
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
}

module.exports = router;
