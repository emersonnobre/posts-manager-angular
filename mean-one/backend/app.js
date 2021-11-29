const express = require('express')
const app = express()

app.use('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 'lsmfmmfw2',
      title: 'First post from api',
      content: 'This is coming from the server-side'
    },
    {
      id: 'sgbdalhi24',
      title: 'Second post from api',
      content: 'This also is coming from the server-side'
    }
  ]
  res.status(200).json({
    message: 'Posts fetched successfully.',
    posts: posts
  })
})

module.exports = app
