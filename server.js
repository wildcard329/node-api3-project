const express = require('express');

const server = express();

const postsRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');

server.use(express.json());

server.use('/api/posts', postsRouter);
server.use('/api/users', userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`Method: ${req.method} URL: ${req.originalUrl} Timestamp: [${new Date().toISOString()}]`)

  next();
}

module.exports = server;
