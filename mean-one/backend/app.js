const express = require('express')
const app = express()

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

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  )
  next()
})

app.route('/api/posts')
  .get((req, res, next) => {
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: posts
    })
  })
  .post((req, res, next) => {
    const post = req.body
    console.log(post)
    posts.push(post)
    res.status(201).json({
      message: 'Post added successfully'
    })
  })

module.exports = app

//27AZRhchqnFThO0G
