const express = require('express');
const db = require('./userDb.js');
const posts = require('../posts/postDb');

const router = express.Router();

// validateUser
router.post('/', validateUser, (req, res) => {
  db.insert(req.body)
  .then(user => {
    res.status(201).json(user);
  })
  .catch(error => {
    console.error(error.message);
    res.status(500).json({
      message: 'Error adding the user',
    })
  })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const messageInfo = {...req.body, user_id: req.params.id}

  posts.insert(messageInfo)
  .then(message => {
    res.status(200).json(message);
  })
  .catch(error => {
    console.error(error.message);
    res.status(500).json({
      message: 'Error adding message'
    })
  })

});

router.get('/', (req, res) => {
  db.get(req.query)
  .then(user => {
    res.status(200).json(user);
  })
  .catch(error => {
    console.error(error.message);
    res.status(500).json({
      message: 'Error retrieving the users',
    })
  })
});

router.get('/:id', validateUserId, (req, res) => {
  db.getById(req.params.id)
  .then(user => {
    if(user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not fount' });
    }
  })
  .catch(error => {
    console.error(error.message);
    res.status(500).json({
      message: 'Error retrieving the user',
    });
  });
});

router.get('/:id/posts', validateUserId, (req, res) => {
  db.getUserPosts(req.params.id)
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(error => {
    console.error(error.message);
    res.status(200).json({
      message: 'Error getting user posts'
    })
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  db.remove(req.params.id)
  .then(count => {
    if (count > 0) {
      res.status(200).json({ message: 'The user has been deleted' })
    } else {
      res.status(400).json({ message: 'The user could not be fount' })
    }
  })
});

router.put('/:id', validateUserId, (req, res) => {
  db.update(req.params.id, req.body)
  .then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'The user could not be found' })
    }
  })
  .catch(error => {
    console.error(error.message);
    res.status(500).json({
      message: 'Error updating the user' 
    })
  })
});

//custom middleware

function validateUserId(req, res, next) {
    const {id} = req.params;

    db.getById(id)
      .then(user => {
        if (user) {
          req.user = user;
          next();
        } else {
          res.status(400).json({ message: 'invalid user id' })
        }
      })
      .catch(err => {
        res.status(500).json({ message: 'failed', err})
      })
  }



function validateUser(req, res, next) {
  if(!req.body || req.body === {}) {
    res.status(400).json({ message: 'missing user data' })
  } else {
    next();
  }
}


function validatePost(req, res, next) {
  if(!req.body || req.body === {}) {
    res.status(400).json({ message: 'missing post data' })
  } else {
    next();
  }
}


module.exports = router;
