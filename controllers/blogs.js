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

export {
  create,
}