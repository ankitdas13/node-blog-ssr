const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const Blog = require("../models/blog")
const Comment = require("../models/comment")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`))
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName)
  }
})

const upload = multer({ storage: storage })

router.get('/add-new', (req, res) => {
  return res.render('addBlog', {
    user: req.user
  })
})

router.post('/', upload.single('coverImageURL'), async (req, res) => {
  const { title, body } = req.body
  const blog = await Blog({
    title,
    body,
    coverImageURL: `/uploads/${req.file.filename}`,
    createdBy: req.user._id
  }).save()

  return res.redirect(`/blog/${blog._id}`)
})

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('createdBy')
    const comments = await Comment.find({
      "blogId": req.params.id
    }).populate('createdBy')

    return res.render('blog', {
      user: req.user,
      blog: blog,
      comments: comments
    })
  } catch (error) {
     console.log("Comment", error)
  }
})

router.post('/comment/:blogId', async (req, res) => {
  const { content } = req.body
  await Comment.create({
    content,
    blogId: req.params.blogId,
    createdBy: req.user._id
  })
  return res.redirect(`/blog/${req.params.blogId}`)
})

module.exports = router