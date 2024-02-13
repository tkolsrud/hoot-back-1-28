import { Profile } from '../models/profile.js'
import { Blog } from '../models/blog.js'

const create = async (req, res) => {
  try {
    req.body.author = req.user.profile 
    const blog = await Blog.create(req.body)
    const profile = await Profile.findByIdAndUpdate(
      req.user.profile,
      { $push: { blogs: blog } },
      { new: true }
    )
    blog.author = profile
    res.status(201).json(blog)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const index = async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .populate('author')
      .sort({ createdAt: 'desc' })
    res.status(200).json(blogs)
  } catch (error) {
    res.status(500).json(error)
  }
}  

const show = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author')
      .populate('comments.author')
    res.status(200).json(blog)
  } catch (error) {
    res.status(500).json(error)
  }
}

const update = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    ).populate('author')
    res.status(200).json(blog)
  } catch (error) {
    res.status(500).json(error)
  }
}

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id)
    if(blog.author.equals(req.user.profile)) {
      const profile = await Profile.findById(req.user.profile)
      profile.blogs.remove({ _id: req.params.id })
      await profile.save()
      res.status(200).json(blog)
    } else {
      throw new Error('Not authorized')
    }  
  } catch (error) {
    res.status(500).json(error)
  }
}

export {
  create,
  index,
  show,
  update,
  deleteBlog as delete
}